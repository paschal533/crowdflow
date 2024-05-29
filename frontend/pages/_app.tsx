import "../styles/globals.css";
import Script from "next/script";
import type { AppProps } from "next/app";
import AuthLayout from "../layouts/AuthLayout";
import { FundraiserProvider } from "@/context/FundraiserContext";
import { ToastContainer } from "@/services/toast";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { ChakraProvider } from "@chakra-ui/react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
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
    </ChakraProvider>
  );
}

export default MyApp;
