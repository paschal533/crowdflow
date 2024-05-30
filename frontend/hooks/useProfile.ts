import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { FundraiserContext } from "@/context/FundraiserContext";
import * as API from "@/services/api";

const useProfile = () => {
  const [isLoadingUserDonations, setIsLoadingUserDonations] = useState(false);
  const [isLoadingUserCampaigns, setIsLoadingUserCampaigns] = useState(false);
  const [myDonations, setmyDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState("");
  const [UserCampaigns, setUserCampaigns] = useState([]);
  const [donation, setDonations] = useState([]);
  const { currentAccount } = useContext(AuthContext);

  /*useEffect(() => {
    let isMounted = true;
    const fetchAllFundraiserDonations = async () => {
      if (currentAccount) {
        setIsLoadingUserDonations(true);
        const items = await API.fetchFundraisersDetails(10, 0, currentAccount);

        setDonations(items);

        if (!isMounted) return;
        // @ts-ignore TODO: fix typescript error
        const datas = await Promise.all(
          items.map(async ({ name, userDonations }) => {
            const res =
              userDonations?.length > 0
                ? await Promise.all(
                    userDonations.map(async ({ donationAmount, date }) => {
                      return {
                        name,
                        donationAmount,
                        date,
                      };
                    })
                  )
                : null;
            return res;
          })
        );

        const result = datas.flat(1);
        const filterResult = result.filter((a) => a !== null);
        setmyDonations(filterResult.filter((a) => a.donationAmount !== "0.00"));
        setIsLoadingUserDonations(false);
      }
    };

    fetchAllFundraiserDonations();

    return () => {
      isMounted = false;
    };
  }, [currentAccount]);

  useEffect(() => {
    let isMounted = true;
    const fetchAllFundraiserCampaigns = async () => {
      if (currentAccount) {
        setIsLoadingUserCampaigns(true);
        const items = await API.fetchFundraiserCampaigns(10, 0, currentAccount);

        if (!isMounted) return;
        // @ts-ignore TODO: fix typescript error
        const data = await Promise.all(
          items.map(async ({ name, Owner, address, dollarDonationAmount }) => {
            const isOwner =
              Owner.toLowerCase() === currentAccount.toLowerCase()
                ? true
                : false;

            return {
              name,
              address,
              isOwner,
              dollarDonationAmount,
            };
          })
        );

        setUserCampaigns(data.filter((a) => a.isOwner === true));
        setIsLoadingUserCampaigns(false);
      }
    };

    fetchAllFundraiserCampaigns();

    return () => {
      isMounted = false;
    };
  }, [currentAccount]);*/

  const getTotalDonations = async () => {
    /*const items = await Promise.all(
      donation.map(async (item) => {
        return item.userDonations;
      })
    );

    const donations: any[] = [];

    items.map((item) => {
      // @ts-ignore TODO: fix typescript error
      return item?.map((res) => donations.push(res.donationAmount));
    });

    setTotalDonations(
      donations.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2)
    );*/
  };

  const setNewBeneficiary = async (address: string, beneficiary: string) => {
    /*try {
      await API.setBeneficiary(
        beneficiary,
        address,
        currentAccount,
        currentSigner
      );
    } catch (error) {
      console.log(error);
    }*/
  };

  const withdraw = async (address: string) => {
    /*try {
      await API.withdraw(address, currentAccount, currentSigner);
    } catch (error) {
      console.log(error);
    }*/
  };

  return {
    myDonations,
    isLoadingUserDonations,
    getTotalDonations,
    totalDonations,
    isLoadingUserCampaigns,
    UserCampaigns,
    setNewBeneficiary,
    withdraw,
  };
};

export default useProfile;
