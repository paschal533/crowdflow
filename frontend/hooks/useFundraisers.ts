import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Address, FundraiserItem } from "@/types";
import * as API from "@/services/api";
import { handleNewFundraiser, handleWithdraw } from "@/services/notifications";
import { MyDonations } from "@/types";
import { useSigner } from "wagmi";

export const useFundraisers = () => {
  const [isLoadingFundraiser, setIsLoadingFundraiser] = useState(true);
  const [fundraisers, setFundraisers] = useState<FundraiserItem[]>([]);
  const FundraiserCurrency = "ETHER";
  const [owner, setIsOwner] = useState(false);
  const [userDonations, setUserDonations] = useState<MyDonations | null>(null);
  const [currentSigner, setCurrentSigner] = useState<any>();
  const [fundraisersDetails, setFundraisersDetails] = useState<
    FundraiserItem[]
  >([]);

  const [loadDonations, setLoadDonations] = useState(true);
  const { currentAccount } = useContext(AuthContext);
  const { data: signer, isError, isLoading } = useSigner();

  useEffect(() => {
    let isMounted = true;

    setCurrentSigner(signer);

    if (!isLoading && !isError) {
      setCurrentSigner(signer);
    }

    const fetchFundraisers = async () => {
      setIsLoadingFundraiser(true);
      const items = await API.fetchFundraisers();

      if (!isMounted) return;
      setFundraisers(items);
      setIsLoadingFundraiser(false);
    };

    fetchFundraisers();

    return () => {
      isMounted = false;
    };
  }, [currentAccount, isLoading, isError, signer]);

  useEffect(() => {
    const fetchFundraisers = async () => {
      const items = await API.fetchFundraisers();
      setFundraisersDetails(items);
    };

    fetchFundraisers();
  }, []);

  // NOTE: Maybe subscribe to new blocks to update Fundraisers list in real time + New Fundraisers notifications
  //   useEffect(() => {
  //     provider.on("block", fetchFundraisers);
  //     return () => {
  //       provider.off("block", fetchFundraisers);
  //     };
  //   }, [fetchFundraisers]);

  // Get a fundraiser details
  const getFundRaiserDetails = async (address: string) => {
    try {
      if (!currentAccount) {
        return;
      }
      setIsOwner(false);

      //const signer = await getProvider();
      const instance = API.fetchFundraiserContract(address, currentSigner);
      const userDonations = await instance.connect(currentSigner).myDonations();

      const isOwner = await instance.connect(signer).owner();

      if (isOwner.toLowerCase() === currentAccount) {
        setIsOwner(true);
      }

      const normalizedDonations = await API.renderDonationsList(userDonations);
      // @ts-ignore TODO: fix typescript error
      setUserDonations(normalizedDonations);
      setLoadDonations(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Create a fundraiser
  const createAFundraiser = async (
    name: string,
    images: Array<string>,
    categories: Array<string>,
    description: string,
    country: string,
    beneficiary: Address,
    goal: number
  ) => {
    //const signer = await getProvider();

    const contract = API.fetchContract(currentSigner);

    const transaction = await contract.createFundraiser(
      name,
      images,
      categories,
      description,
      country,
      beneficiary,
      goal
    );

    setIsLoadingFundraiser(true);
    await transaction.wait();
    handleNewFundraiser();
    setIsLoadingFundraiser(false);
  };

  // withdraw funds
  const withdrawalFunds = async (address: string) => {
    if (!currentAccount) {
      return;
    }

    //const signer = await getProvider();

    const instance = API.fetchFundraiserContract(address, currentSigner);
    await instance.withdraw({ from: currentAccount });

    handleWithdraw();
  };

  return {
    isLoadingFundraiser,
    fundraisers,
    userDonations,
    FundraiserCurrency,
    loadDonations,
    setLoadDonations,
    setIsOwner,
    withdrawalFunds,
    getFundRaiserDetails,
    createAFundraiser,
    owner,
    currentSigner,
    fundraisersDetails,
  };
};
