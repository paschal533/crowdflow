// @ts-nocheck
import { HStack, VStack, Text, Button, Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import type { NextPage } from "next";
//import Head from "next/head";
import styles from "../styles/Home.module.css";
//import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Banner, Steps, BTN, World } from "../components";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";

const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 12px 22px;
  color: #ffffff;
  background: #1a88f8;
  width: 300px;
  font-size: 20px;
  font-weight: 500;
  border-radius: 8rem;
  box-shadow: 0 4px 24px -6px #1a88f8;

  @media (max-width: 600px) {
    width: 300px;
  }

  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 40px -6px #1a88f8;
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 32px -6px #1a88f8;
  }

  &:disabled,
  button[disabled] {
    border: 1px solid #999999;
    color: #ffffff;
    background: #83bffb !important;
    cursor: no-drop;
  }
`;

const Home: NextPage = () => {
  return (
    <>
      <div className="sm:px-2 sm:pt-16 px-8 ">
        <main className={styles.main}>
          <Banner
            name={
              <>
                The slightest help from you, <br />
                means a lot to us.
              </>
            }
            childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
            parentStyle="justify-start max-w-[2000px] sm:mt-[-20px] mb-2 mt-6 h-72 sm:h-60 p-12 sm:p-4 xs:p-4 xs:h-44 rounded-3xl"
          />
          <LandingContainer />
        </main>
      </div>
      <Steps />
      <World />
      <br />
    </>
  );
};

function LandingContainer() {
  const router = useRouter();

  return (
    <div>
      <div className="sm:hidden block">
        <HStack className="overflow-hidden w-full justify-center mb-6">
          <HStack gap={5} className="sm:hidden block">
            <div className="drop-shadow-xl">
              <Image
                alt="5"
                src="/landing/1.png"
                className="rounded-lg"
                width={300}
                height={400}
              />
            </div>
            <VStack gap={5}>
              <div className="drop-shadow-xl">
                <Image
                  alt="1"
                  src="/landing/2.png"
                  className="rounded-lg"
                  width={300}
                  height={400}
                />
              </div>
              <div className="drop-shadow-xl">
                <Image
                  alt="2"
                  src="/landing/3.png"
                  className="rounded-lg"
                  width={300}
                  height={400}
                />
              </div>
            </VStack>
          </HStack>
          <VStack gap={5}>
            <Text className="w-full font-bold text-4xl text-center">
              Find a cause you love
            </Text>
            <Text className="w-full sm:font-normal font-semibold sm:text-2xl text-2xl text-center text-[#5a5a5a]">
              Help others in need with crypto or fundraise for your own cause
            </Text>
            <Link href="/browse">
              <button
                className="home-button"
                onClick={() => router.push("/browse")}
              >
                Browse Causes
              </button>
            </Link>
          </VStack>
          <HStack gap={5} className="sm:hidden block">
            <VStack gap={5}>
              <div className="drop-shadow-xl">
                <Image
                  alt="3"
                  src="/landing/4.png"
                  className="rounded-lg"
                  width={300}
                  height={400}
                />
              </div>
              <div className="drop-shadow-xl">
                <Image
                  alt="4"
                  src="/landing/5.png"
                  className="rounded-lg"
                  width={300}
                  height={400}
                />
              </div>
            </VStack>
            <div className="drop-shadow-xl">
              <Image
                alt="6"
                src="/landing/6.png"
                className="rounded-lg"
                width={300}
                height={400}
              />
            </div>
          </HStack>
        </HStack>
      </div>

      <div className="hidden sm:block">
        <VStack className="overflow-hidden w-full justify-center mb-6">
          <VStack gap={5} className="sm:hidden block">
            <div className="drop-shadow-xl">
              <Image
                alt="5"
                src="/landing/1.png"
                className="rounded-lg drop-shadow-xl"
                width={300}
                height={400}
              />
            </div>
            <Flex gap={5}>
              <div className="drop-shadow-xl">
                <Image
                  alt="1"
                  src="/landing/2.png"
                  className="rounded-lg drop-shadow-xl"
                  width={300}
                  height={600}
                />
              </div>
              <div className="drop-shadow-xl">
                <Image
                  alt="2"
                  src="/landing/3.png"
                  className="rounded-lg drop-shadow-xl"
                  width={300}
                  height={600}
                />
              </div>
            </Flex>
          </VStack>
          <VStack gap={5} className="py-12">
            <Text className="w-full font-bold text-4xl mb-8 text-center">
              Find a cause you love
            </Text>
            <Text className="w-full sm:font-normal mb-8 font-semibold sm:text-2xl text-2xl text-center text-[#5a5a5a]">
              Help others in need with crypto or fundraise for your own cause
            </Text>
            <Link href="/browse">
              <button
                className="home-button"
                onClick={() => router.push("/browse")}
              >
                Browse Causes
              </button>
            </Link>
          </VStack>
          <VStack gap={5} className="sm:hidden mt-6 block">
            <Flex gap={5}>
              <div className="drop-shadow-xl">
                <Image
                  alt="3"
                  src="/landing/4.png"
                  className="rounded-lg drop-shadow-xl"
                  width={300}
                  height={600}
                />
              </div>
              <div className="drop-shadow-xl">
                <Image
                  alt="4"
                  src="/landing/5.png"
                  className="rounded-lg drop-shadow-xl"
                  width={300}
                  height={600}
                />
              </div>
            </Flex>
            <div className="drop-shadow-xl">
              <Image
                alt="6"
                src="/landing/6.png"
                className="rounded-lg"
                width={300}
                height={400}
              />
            </div>
          </VStack>
        </VStack>
      </div>
    </div>
  );
}

export default Home;
