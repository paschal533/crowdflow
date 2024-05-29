import Image from "next/image";
import Link from "next/link";
import images from "../assets";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

const Logo = () => {
  const { currentAccount } = useContext(AuthContext);

  return (
    <div className="flex flex-row justify-start flex-1">
      <Link href="/">
        <a className="flex justify-center align-center">
          <Image
            src={images.logo02}
            objectFit="contain"
            width={32}
            height={32}
            alt="logo"
          />
          <p
            className={`ml-1 text-xl ${
              currentAccount ? "sm:mt-1" : "sm:mt-2"
            } mt-2 minlg:mt-4 font-bold dark:text-white text-nft-black-1`}
          >
            CrowdFlow
          </p>
        </a>
      </Link>
    </div>
  );
};

export default Logo;
