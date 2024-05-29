import { useEffect, useCallback, useState } from "react";
import { handleNewNotification, handleConnect } from "@/services/notifications";
import * as AuthService from "@/utils/authService";

import { SuiService } from "@/utils/suiService";

const useAuth = () => {
  const [accounts, setAccounts] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState("0");
  const suiService = new SuiService();

  //@ts-ignore
  const getBalance = useCallback(async () => {
    try {
      if (AuthService.isAuthenticated()) {
        setBalance(
          await suiService.getFormattedBalance(
            await AuthService.walletAddress()
          )
        );
      }
    } catch (error) {
      console.log({ error });
    } finally {
    }
  });

  const logout = async () => {
    sessionStorage.clear();

    window.location.href = "/";
  };

  useEffect(() => {
    getBalance();

    const getAccount = async () => {
      console.log("stating");
      console.log(AuthService.isAuthenticated());
      if (AuthService.isAuthenticated()) {
        setAccounts(await AuthService.walletAddress());

        console.log(await AuthService.walletAddress());
      }
    };

    getAccount();
  }, [AuthService.isAuthenticated()]);

  return {
    accounts,
    balance,
    currentAccount: accounts,
    isLoading,
    logout,
  };
};

export default useAuth;
