import { useEffect, useState, useContext } from "react";
import { Notification } from "./Notifications";
import Image from "next/image";
import images from "@/assets";
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import NavButtonGroup from "@/components/NavButtonGroup";
import styled from "styled-components";
import { BiMenuAltRight } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";
import { AuthContext } from "@/context/AuthContext";
import * as AuthService from "@/utils/authService";
import Wallet from "./Wallet";

const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 8px 12px;
  color: #ffffff;
  background: #1a88f8;
  width: 150px;
  font-size: 20px;
  font-weight: 500;
  box-shadow: 0 2px 12px -3px #1a88f8;
  border-radius: 10px;

  transition: 200ms ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 20px -6px #1a88f8;
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px -6px #1a88f8;
  }

  &:disabled,
  button[disabled] {
    border: 1px solid #999999;
    color: #ffffff;
    background: #83bffb !important;
    cursor: no-drop;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentAccount, logout, balance } = useContext(AuthContext);

  useEffect(() => {
    // disable body scroll when navbar is open
    document.body.style.overflow = isOpen ? "hidden" : "visible";
  }, [isOpen]);

  return (
    <nav className="sticky z-20 top-0 left-0 flex flex-row justify-between w-full p-4 bg-white border-b align-center border-nft-gray-1 dark:bg-nft-dark dark:border-nft-black-1">
      <Notification />
      <Logo />

      <div className="flex flex-row justify-end flex-initial">
        <div className="flex md:hidden">
          <NavMenu setIsOpen={setIsOpen} />
          <div className="ml-4">
            <NavButtonGroup setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>

      <div className="hidden ml-2 md:flex">
        <div className="mr-4">
          {!currentAccount ? (
            <StyledButton onClick={() => AuthService.login()}>
              Login with Google
            </StyledButton>
          ) : (
            <Wallet
              address={currentAccount}
              amount={balance}
              symbol="SUI"
              destroy={logout}
            />
          )}
        </div>
        {/*<Image
          src={isOpen ? images.cross : images.menu}
          objectFit="contain"
          width={25}
          height={25}
          alt={isOpen ? "close" : "menu"}
          role="button"
          onClick={() => setIsOpen(!isOpen)}
          className="filter invert"
         />*/}

        {!isOpen ? (
          <BiMenuAltRight
            className="w-10 h-10"
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <GrFormClose
            className="w-10 h-10"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}

        <div
          className={`${
            isOpen ? "visible" : "hidden"
          } fixed inset-0 z-10 flex flex-col justify-between bg-white top-65 dark:bg-nft-dark h-[calc(100vh - 65px)]`}
        >
          <div className="flex-1 p-4">
            <NavMenu setIsOpen={setIsOpen} />
          </div>
          <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1">
            <NavButtonGroup setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
