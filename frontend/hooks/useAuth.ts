import { useEffect, useRef, useState } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { handleNewNotification, handleConnect } from "@/services/notifications";
import { useAccount, useSwitchNetwork, useNetwork } from "wagmi";

const useAuth = () => {
  const onboarding = useRef<MetaMaskOnboarding>();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [accounts, setAccounts] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { chains, error, pendingChainId, switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  useEffect(() => {
    setAccounts(address);

    if (!isConnecting && chains[0]?.id !== chain?.id) {
      switchNetwork && switchNetwork(chains[0].id);
    }
    if (address?.length === undefined) {
      handleNewNotification();
    } else {
      handleConnect();
    }
  }, [address, chain?.id]);

  /** Check if connected */
  /*useEffect(() => {
    let isMounted = true;

    function handleNewAccounts(newAccounts: string[]) {
      if (!isMounted) {
        return;
      }
      setAccounts(newAccounts);
    }

    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
      window.ethereum.on("accountsChanged", handleNewAccounts);
      return () => {
        isMounted = false;
        window.ethereum.removeListener("accountsChanged", handleNewAccounts);
      };
    } else {
      notifyMetamaskIsNotFounded();
    }
  }, []);*/

  const connectWallet = async () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      setIsLoading(true);
      const newAccounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccounts(newAccounts[0]);
      setIsLoading(false);
    } else {
      onboarding.current?.startOnboarding();
    }
  };

  const disconnectWallet = async () => {};

  return {
    accounts,
    currentAccount: accounts,
    isLoading,
    connectWallet,
    disconnectWallet,
  };
};

export default useAuth;
