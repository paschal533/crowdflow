import { useEffect, useCallback, useState } from "react";
import { handleNewNotification, handleConnect } from "@/services/notifications";
import { AuthService } from '@/utils/authService';

import { SuiService } from '@/utils/suiService';

const useAuth = () => {
  const [accounts, setAccounts] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState("0");
  const suiService = new SuiService();

  const getBalance = useCallback(async () => {
    try {

      if (AuthService.isAuthenticated()) {

        setBalance(await suiService.getFormattedBalance(AuthService.walletAddress()));

      }

    } catch (error) {

      console.log({ error });

    } finally {

    }

  });


  const logout = async () => {

    sessionStorage.clear();


    window.location.href = '/';

  };

  useEffect(() => {

    getBalance();

    if (AuthService.isAuthenticated()) {

      setAccounts(AuthService.walletAddress());
  
    }

  }, [getBalance, accounts]);


  return {
    accounts,
    balance,
    currentAccount: accounts,
    isLoading,
    logout,
  };
};

export default useAuth;
