import cc from "cryptocompare";

import { TransactionBlock } from "@mysten/sui.js/transactions";

import { PACKAGE_ID, SUI_CLIENT } from "@/utils/suiClient";

import * as AuthService from "@/utils/authService";

async function makeMoveCall(txData: any, txb: TransactionBlock) {
  const keypair = await AuthService.getEd25519Keypair();

  const sender = await AuthService.walletAddress();

  txb.setSender(sender);

  txb.moveCall(txData);

  const { bytes, signature: userSignature } = await txb.sign({
    client: SUI_CLIENT,

    signer: keypair,
  });

  const zkLoginSignature = await AuthService.generateZkLoginSignature(
    userSignature
  );

  return SUI_CLIENT.executeTransactionBlock({
    transactionBlock: bytes,

    signature: zkLoginSignature,
  });
}

export async function fetchFundraisers() {
  const txb = new TransactionBlock();

  const txData = {
    target: `${PACKAGE_ID}::main::Fundraiser`,
  };

  console.log(txData);

  return txData;
}

export async function createFundraiser(
  target: number,
  milestone_count: number,
  tokenName: string,
  symbol: string,
  name: string,
  images: Array<string>,
  categories: Array<string>,
  description: string,
  region: string
) {
  const txb = new TransactionBlock();

  console.log("starting")

   // Helper function to convert string to Uint8Array
  const stringToUint8Array = (str) => {
    return new TextEncoder().encode(str);
  };

  // Convert strings to Uint8Arrays
  const encodedImages = images.map(stringToUint8Array);
  const encodedCategories = categories.map(stringToUint8Array);


  const txData = {
    target: `${PACKAGE_ID}::main::create_fundraiser`,

    arguments: [
      txb.pure.u64(target),
      txb.pure.u64(milestone_count),
      txb.pure.string(tokenName),
      txb.pure.string(symbol),
      txb.pure.string(name),
      ...encodedImages.map(image => txb.pure(image)), // spread Uint8Arrays for images
      ...encodedCategories.map(category => txb.pure(category)), // spread Uint8Arrays for categories
      txb.pure.string(description),
      txb.pure.string(region),
    ],
  };

  console.log(txData)

  return await makeMoveCall(txData, txb);
}

export async function withdraw() {
  const txb = new TransactionBlock();

  const txData = {
    target: `${PACKAGE_ID}::main::withdraw_funds`,
  };

  const res = await makeMoveCall(txData, txb);

  console.log(res);

  return res;
}

/*export const fetchFundraisers = async (
  limit = 10,
  offset = 0
): Promise<FundraiserItem[]> => {
  const provider = new providers.JsonRpcProvider(
    `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ProjectAPIKey}`
  );

  const contract = fetchContract(provider);

  const data = await contract.fundraisers(limit, offset);

  const exchangeRate = await getExchangeRate();

  const items = await Promise.all(
    data.map(async (item) => {
      const instance = Fundraiser__factory.connect(item, provider);
      // TODO: Collect all data asynchronously
      const name = await instance.name();
      const description = await instance.description();
      const totalDonations = await instance.totalDonations();
      // @ts-ignore TODO: fix typescript error
      const images = await instance.getImageUrls();
      const categories = await instance.getCategories();
      const { donors, values, dates } = await instance.allDonations();
      const res = await Promise.all(
        dates.map(async (item) => {
          return item.toString();
        })
      );
      const count = await instance.donationsCount();
      const donationCount = count.toString();
      const country = await instance.region();
      const goal = await instance.goal();
      const goalFormat = goal.toString();
      const amountInETH = ethers.utils.formatEther(totalDonations.toString());

      // @ts-ignore TODO: fix typescript error
      const dollarDonationAmount = amountInETH * exchangeRate;

      return {
        name,
        description,
        dollarDonationAmount,
        categories,
        country,
        values,
        res,
        donors,
        goalFormat,
        images,
        donationCount,
        address: item,
      };
    })
  );
  // @ts-ignore TODO: fix typescript error
  return items;
};*/

/*export const fetchFundraisersDetails = async (
  limit: number,
  offset: number,
  currentAccount: Address
): Promise<FundraiserUserItem[]> => {
  const provider = new providers.JsonRpcProvider(
    `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ProjectAPIKey}`
  );

  const contract = fetchContract(provider);
  const data = await contract.fundraisers(limit, offset);

  const exchangeRate = await getExchangeRate();

  const items = await Promise.all(
    data.map(async (item) => {
      const instance = Fundraiser__factory.connect(item, provider);
      // TODO: Collect all data asynchronously
      const name = await instance.name();
      const totalDonations = await instance.totalDonations();
      const amountInETH = ethers.utils.formatEther(totalDonations.toString());
      const userDonation = await instance.myDonations({
        from: currentAccount,
      });

      const normalizedDonations = await renderDonationsList(userDonation);
      // @ts-ignore TODO: fix typescript error
      const dollarDonationAmount = amountInETH * exchangeRate;

      return {
        name,
        dollarDonationAmount,
        address: item,
        userDonations: normalizedDonations,
      };
    })
  );

  // @ts-ignore TODO: fix typescript error
  return items;
};*/

/*export const fetchFundraiserCampaigns = async (
  limit: number,
  offset: number,
  currentAccount: Address
): Promise<FundraiserDetailsItem[]> => {
  const provider = new providers.JsonRpcProvider(
    `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ProjectAPIKey}`
  );

  const contract = fetchContract(provider);
  const data = await contract.fundraisers(limit, offset);

  const exchangeRate = await getExchangeRate();

  const items = await Promise.all(
    data.map(async (item) => {
      const instance = Fundraiser__factory.connect(item, provider);
      // TODO: Collect all data asynchronously
      const name = await instance.name();
      const totalDonations = await instance.totalDonations();
      const amountInETH = ethers.utils.formatEther(totalDonations.toString());
      const Owner = await instance.owner({ from: currentAccount });

      // @ts-ignore TODO: fix typescript error
      const dollarDonationAmount = amountInETH * exchangeRate;

      return {
        name,
        dollarDonationAmount,
        address: item,
        Owner,
      };
    })
  );

  // @ts-ignore TODO: fix typescript error
  return items;
};*/

export const getExchangeRate = async () => {
  const exchangeRate = await cc.price("SUI", ["USD"]);
  return exchangeRate["USD"];
};

/*export const renderDonationsList = async (donations: MyDonations) => {
  try {
    const exchangeRate = await getExchangeRate();

    if (donations === null) {
      return null;
    }

    const totalDonations = donations.length;

    const donationList = [];

    for (let item of donations) {
      for (let i = 0; i < item.length; i++) {
        const donation = item[i].toString();

        const ethAmount = ethers.utils.formatEther(donation);

        // @ts-ignore TODO: fix typescript error
        const userDonation = exchangeRate * ethAmount;

        let donationDate;

        if (donations.dates[i] === undefined) {
          donationDate = "no date found";
        } else {
          donationDate = donations.dates[i].toString();
        }

        donationList.push({
          donationAmount: userDonation.toFixed(2),
          date: donationDate,
        });
      }
    }

    return donationList;
  } catch (error) {
    console.log(error);
  }
};

export const setBeneficiary = async (
  beneficiary: string,
  address: string,
  currentAccount: string,
  signer: any
) => {
  if (!currentAccount) {
    return;
  }

  const instance = fetchFundraiserContract(address, signer);
  await instance.setBeneficiary(beneficiary, { from: currentAccount });

  handleNewBeneficiary();
};

export const withdraw = async (
  address: string,
  currentAccount: string,
  signer: any
) => {
  if (!currentAccount) {
    return;
  }

  const instance = fetchFundraiserContract(address, signer);
  await instance.withdraw({ from: currentAccount });

  handleWithdraw();
};*/
