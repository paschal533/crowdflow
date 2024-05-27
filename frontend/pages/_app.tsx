import "../styles/globals.css";
import Script from "next/script";
import type { AppProps } from "next/app";
import AuthLayout from "../layouts/AuthLayout";
import { FundraiserProvider } from "@/context/FundraiserContext";
import { ToastContainer } from "@/services/toast";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { ChakraProvider } from "@chakra-ui/react";
import { WagmiConfig, createClient, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

const infuraId = process.env.NEXT_PUBLIC_INFURA_ProjectAPIKey;

const chains = [chain.goerli];

const client = createClient(
  getDefaultClient({
    appName: "FundBrave",
    infuraId,
    chains,
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WagmiConfig client={client}>
        <ConnectKitProvider>
          <AuthProvider>
            <FundraiserProvider>
              <AuthLayout>
                <ProfileProvider>
                  <Component {...pageProps} />
                </ProfileProvider>
              </AuthLayout>
              <ToastContainer />
              <Script
                src="https://kit.fontawesome.com/d45b25ceeb.js"
                crossOrigin="anonymous"
              />
            </FundraiserProvider>
          </AuthProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
