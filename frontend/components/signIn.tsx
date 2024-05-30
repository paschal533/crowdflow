import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import * as AuthService from "@/utils/authService";
import Wallet from "./Wallet";
import Image from "next/image";
import styled from "styled-components";
import Google from "@/assets/google-logo.png";

const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: flex;
  padding: 8px 12px;
  color: #000000;
  background: #bec3c7;
  width: 300px;
  font-size: 20px;
  font-weight: 500;
  box-shadow: 0 2px 12px -3px #bec3c7;
  border-radius: 10px;

  transition: 200ms ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 20px -6px #bec3c7;
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px -6px #bec3c7;
  }

  &:disabled,
  button[disabled] {
    border: 1px solid #999999;
    color: #000000;
    background: #83bffb !important;
    cursor: no-drop;
  }
`;
const SignIn = ( { width }) => {
  const { currentAccount, logout, balance } = useContext(AuthContext);

  return (
    <div>
      {!currentAccount ? (
        <StyledButton
          className={`${width ? width : ""} justify-center text-center`}
          onClick={() => AuthService.login()}
        >
          <Image
            src={Google}
            objectFit="contain"
            width={32}
            height={32}
            alt="logo"
            className="mr-2"
          />
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
  );
};

export default SignIn;
