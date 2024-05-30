import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import * as API from "@/services/api";
import { handleNewFundraiser, handleWithdraw } from "@/services/notifications";

export const useFundraisers = () => {
  const [isLoadingFundraiser, setIsLoadingFundraiser] = useState(true);
  const [fundraisers, setFundraisers] = useState<any>([]);
  const FundraiserCurrency = "SUI";
  const [owner, setIsOwner] = useState(false);
  //const [userDonations, setUserDonations] = useState<MyDonations | null>(null);
  const [currentSigner, setCurrentSigner] = useState<any>();
  const [fundraisersDetails, setFundraisersDetails] = useState([]);

  const [loadDonations, setLoadDonations] = useState(true);
  const { currentAccount } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;

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
  }, [currentAccount]);

  useEffect(() => {
    const fetchFundraisers = async () => {
      const items = await API.fetchFundraisers;
      //@ts-ignore
      setFundraisersDetails(items);
    };

    fetchFundraisers();
  }, []);

  const getFundRaiserDetails = async (address: string) => {
    /*try {
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
    }*/
  };

  // Create a fundraiser
  const createAFundraiser = async (
    target: number,
    milestone_count: number,
    tokenName: string,
    symbol: string,
    name: string,
    images: Array<string>,
    categories: Array<string>,
    description: string,
    region: string
  ) => {
    //@ts-ignore
    try {

      const transaction = await API.createFundraiser(
        target,
        milestone_count,
        tokenName,
        symbol,
        name,
        images,
        categories,
        description,
        region
      );
  
      setIsLoadingFundraiser(true);
      console.log(transaction)
      //handleNewFundraiser();
      //setIsLoadingFundraiser(false);

    }catch (error) {
      console.log(error)
    }
     
  };

  // withdraw funds
  const withdrawalFunds = async (address: string) => {
    if (!currentAccount) {
      return;
    }

    //@ts-ignore
    await API.withdraw();

    handleWithdraw();
  };

  return {
    isLoadingFundraiser,
    fundraisers,
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
