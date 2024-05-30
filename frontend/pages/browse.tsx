import {
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Image,
  Box,
  Button,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import styles from "@styles/Browse.module.css";
import Link from "next/link";
import { tags } from "@data/tags";
import { useState, useContext } from "react";
import { FundraiserContext } from "@/context/FundraiserContext";
import { shortenAddress } from "@utils/shortenAddress";
import { data } from "@data/info";

function Browse() {
  const [clicked, setClicked] = useState(false);
  const [cat, setCat] = useState("");
  const { /*fundraisers,*/ isLoadingFundraiser } = useContext(FundraiserContext);
  const fundraisers = data;
  const perc = (amount) => {
    return Number(amount).toFixed(2);
  };

  return (
    <div className="pt-0 pl-[10px] pr-[10px] pb-[10px]">
      <VStack>
        <VStack className="item-start">
          <Text className={styles.causeSectionTitle}>Fundraisers</Text>
          <HStack w="100%" justifyContent="space-between">
            <div
              className="flex flex-wrap justify-center items-center space-y-2 mt-4"
              onClick={() => setClicked(!clicked)}
            >
              {tags.map(({ name, count }, idx) => {
                return (
                  <HStack
                    onClick={() => setCat(name)}
                    key={idx}
                    className={`${styles.causeTag} ml-2 sm:ml-0 sm:mb-2 cursor-pointer space-between`}
                  >
                    <Text className={styles.causeTagTitle}>{name}</Text>
                    <VStack className={styles.causeTagCountContainer}>
                      <Text className={styles.causeTagCount}>{count}</Text>
                    </VStack>
                  </HStack>
                );
              })}
            </div>
          </HStack>
        </VStack>
        {clicked ? (
          <div className="w-full flex flex-wrap justify-start mt-8 md:justify-center">
            {!isLoadingFundraiser
              ? fundraisers
                  .filter(({ categories }) => categories.includes(cat))
                  .map((fundraiser) => {
                    return (
                      <Link
                        href={{
                          pathname: "/fundraiser-details",
                          query: { address: fundraiser.address },
                        }}
                      >
                        <VStack
                          className={`${styles.causeContainer} ml-2 sm:ml-0 sm:mb-4 mb-4 mt-4`}
                          cursor="pointer"
                        >
                          <HStack className={styles.profileCell}>
                            <Image
                              alt="0xcarhartt"
                              src="/profiles/donor_2.png"
                              className={styles.profileImage}
                            ></Image>
                            <Text className={styles.profileName}>
                              {shortenAddress(fundraiser.address)}
                            </Text>
                          </HStack>
                          <Image
                            alt="featured 1"
                            src={fundraiser.images[0]}
                            className={styles.causeImage}
                          ></Image>
                          <VStack className={styles.causeTextContainer}>
                            <Text className={styles.causeTitle}>
                              {fundraiser.name}
                            </Text>
                            <Text
                              className={styles.causeSubtitle}
                            >{`Last donation 15 mins ago`}</Text>
                            <HStack className={styles.scoreContainer}>
                              <Box className={`${styles.progressBarContainer}`}>
                                <Box
                                  style={{
                                    backgroundColor: "#2d89e6",
                                    width: `${(Number(
                                      perc(fundraiser.dollarDonationAmount)
                                    ) > 0
                                      ? (Number(
                                          perc(fundraiser.dollarDonationAmount)
                                        ) /
                                          fundraiser.goalFormat) *
                                        100
                                      : 0
                                    ).toFixed(3)}%`,
                                  }}
                                  className={`${styles.progressBar}`}
                                ></Box>
                              </Box>
                            </HStack>
                            <HStack>
                              <Image
                                alt="money icon"
                                src="/money.png"
                                width="20px"
                              ></Image>
                              <Text
                                fontSize="16px"
                                fontWeight={500}
                                color="#5A5A5A"
                              >
                                {`${fundraiser.dollarDonationAmount.toFixed(
                                  3
                                )} USD raised of ${fundraiser.goalFormat} USD`}
                              </Text>
                            </HStack>
                          </VStack>
                        </VStack>
                      </Link>
                    );
                  })
              : [1, 2, 3].map(() => {
                  return (
                    <Box
                      padding="6"
                      boxShadow="lg"
                      className="flex-1 p-4 m-2 bg-white shadow-md cursor-pointer dark:bg-nft-black-3 rounded-2xl minlg:m-8 sm:my-2 sm:mx-2"
                    >
                      <div className="relative overflow-hidden sm:w-full h-72 sm:h-36 xs:h-56 minmd:h-60 minlg:h-300 rounded-2xl">
                        <SkeletonCircle size="12" />
                        <SkeletonText mt="4" noOfLines={6} spacing="4" />
                      </div>
                    </Box>
                  );
                })}
          </div>
        ) : (
          <div className="w-full flex max-w-7xl flex-wrap justify-start mt-8 md:justify-center">
            {!isLoadingFundraiser && fundraisers.length != null
              ? fundraisers?.slice(0, 6).map((fundraiser) => {
                  return (
                    <Link
                      href={{
                        pathname: "/fundraiser-details",
                        query: { address: fundraiser.address },
                      }}
                    >
                      <VStack
                        className={`${styles.causeContainer} ml-2 sm:ml-0 sm:mb-4 mb-4 mt-4`}
                        cursor="pointer"
                      >
                        <HStack className={styles.profileCell}>
                          <Image
                            alt="0xcarhartt"
                            src="/profiles/donor_2.png"
                            className={styles.profileImage}
                          ></Image>
                          <Text className={styles.profileName}>
                            {shortenAddress(fundraiser.address)}
                          </Text>
                        </HStack>
                        <Image
                          alt="featured 1"
                          src={fundraiser.images[0]}
                          className={styles.causeImage}
                        ></Image>
                        <VStack className={styles.causeTextContainer}>
                          <Text className={styles.causeTitle}>
                            {fundraiser.name}
                          </Text>
                          <Text
                            className={styles.causeSubtitle}
                          >{`Last donation 15 mins ago`}</Text>
                          <HStack className={styles.scoreContainer}>
                            <Box className={`${styles.progressBarContainer}`}>
                              <Box
                                style={{
                                  backgroundColor: "#2d89e6",
                                  width: `${(Number(
                                    perc(fundraiser.dollarDonationAmount)
                                  ) > 0
                                    ? (Number(
                                        perc(fundraiser.dollarDonationAmount)
                                      ) /
                                        fundraiser.goalFormat) *
                                      100
                                    : 0
                                  ).toFixed(3)}%`,
                                }}
                                className={`${styles.progressBar}`}
                              ></Box>
                            </Box>
                          </HStack>
                          <HStack>
                            <Image
                              alt="money icon"
                              src="/money.png"
                              width="20px"
                            ></Image>
                            <Text
                              fontSize="16px"
                              fontWeight={500}
                              color="#5A5A5A"
                            >
                              {`${fundraiser.dollarDonationAmount.toFixed(
                                3
                              )} USD raised of ${fundraiser.goalFormat} USD`}
                            </Text>
                          </HStack>
                        </VStack>
                      </VStack>
                    </Link>
                  );
                })
              : [1, 2, 3].map(() => {
                  return (
                    <Box
                      padding="6"
                      boxShadow="lg"
                      className="flex-1 p-4 m-2 bg-white shadow-md cursor-pointer dark:bg-nft-black-3 rounded-2xl minlg:m-8 sm:my-2 sm:mx-2"
                    >
                      <div className="relative overflow-hidden sm:w-full h-72 sm:h-36 xs:h-56 minmd:h-60 minlg:h-300 rounded-2xl">
                        <SkeletonCircle size="12" />
                        <SkeletonText mt="4" noOfLines={6} spacing="4" />
                      </div>
                    </Box>
                  );
                })}
          </div>
        )}
        <Button className={styles.loadMoreBtn}>Load more</Button>
      </VStack>
    </div>
  );
}

export default Browse;
