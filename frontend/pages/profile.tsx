import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { BTN, ProfileStep, UserCampaigns } from "@/components";

import { ProfileContext } from "@/context/ProfileContext";
import Donations from "@/components/Donations";
import * as API from "@/services/api";
import { Flex, Text } from "@chakra-ui/react";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import SignIn from "@components/signIn";

const Home = () => {
  const { currentAccount, balance } = useContext(AuthContext);
  const [currentItem, setCurrentItem] = useState("Donation Records");
  const { getTotalDonations, totalDonations, myDonations } =
    useContext(ProfileContext);

  useEffect(() => {
    if (myDonations) {
      getTotalDonations();
    }
  }, [myDonations]);

  const MenuBar = () => {
    return (
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
        />
        <MenuList>
          {["Donation Records", "POAPs Received", "Active campaigns"].map(
            (item) => {
              return (
                <MenuItem
                  onClick={() => setCurrentItem(item)}
                  className={`text-xl text-center ${
                    currentItem == item
                      ? "bg-[#2d89e6] hover:bg-[#66abef] p-2 text-center rounded-lg hover:text-white text-white"
                      : ""
                  } cursor-pointer hover:text-[#807b7b] font-bold`}
                >
                  {item}
                </MenuItem>
              );
            }
          )}
        </MenuList>
      </Menu>
    );
  };

  if (!currentAccount) {
    return (
      <>
        <Head>
          <title>Login | Dashboard</title>
        </Head>
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="80vh"
          overflowX="hidden"
          overflowY="hidden"
          bgGradient="linear(to-br, teal.400, purple.700)"
        >
          <Text fontSize="5xl" fontWeight="semiBold" color="white">
            Profile Page
          </Text>
          <div className="flex items-center justify-center w-full">
            <SignIn width="" />
          </div>
        </Flex>
      </>
    );
  }

  return (
    <div className="flex w-full divide-x-2 z-2 justify-center items-center">
      <Head>
        <title>Profile</title>
      </Head>
      <div className="w-[20vw] sm:hidden block p-6 space-y-6 z-2 h-[50vw]">
        {["Donation Records", "POAPs Received", "Active campaigns"].map(
          (item) => {
            return (
              <div
                onClick={() => setCurrentItem(item)}
                className={`text-xl text-center ${
                  currentItem == item
                    ? "bg-[#2d89e6] hover:bg-[#66abef] p-2 text-center rounded-lg hover:text-white text-white"
                    : "hover:text-[#6c737a]"
                } cursor-pointer font-bold`}
              >
                {item}
              </div>
            );
          }
        )}
      </div>
      <div className="w-[80vw] sm:w-[100%] z-2 p-4 min-h-[50vw] sm:h-[100%]">
        <div className="sm:block hidden">
          <MenuBar />
        </div>
        {(() => {
          switch (currentItem) {
            case "Donation Records":
              return (
                <div className=" justify-center w-full items-center flex flex-col">
                  <div className="max-w-[1100px] flex w-full sm:flex-col justify-around items-center sm:p-4 pr-10 pl-10 pt-4 pb-4">
                    <ProfileStep
                      icon={<MdOutlineAccountBalanceWallet />}
                      title="Wallet Balance"
                      description={`Your wallet balance ${balance} SUI`}
                    />
                    <br />
                    <ProfileStep
                      icon={<MdOutlineAccountBalanceWallet />}
                      title="Total Donations"
                      description={`Your Total Donation is 0 SUI`}
                    />
                  </div>
                  <div className=" max-w-[1100px] w-full mt-4 drop-shadow-2xl">
                    <Donations />
                  </div>
                </div>
              );
              break;
            case "POAPs Received":
              return (
                <div className="p-4">
                  {Number(totalDonations) == 0 ? (
                    <div className="text-center text-2xl font-bold mt-8">
                      No POAP Received
                    </div>
                  ) : (
                    <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557 ">
                      <Image
                        alt="fundraiser-imageURL"
                        src="https://openseauserdata.com/files/d80e3b549642e88b2154664c574ea334.svg"
                        objectFit="cover"
                        className="shadow-lg rounded-xl"
                        layout="fill"
                      />
                    </div>
                  )}
                </div>
              );
              break;
            case "Active campaigns":
              return (
                <div className=" justify-center items-center flex flex-col w-full mt-4">
                  <div className="max-w-[1100px] w-full items-center drop-shadow-2xl">
                    <UserCampaigns />
                  </div>
                </div>
              );
              break;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};

export default Home;
