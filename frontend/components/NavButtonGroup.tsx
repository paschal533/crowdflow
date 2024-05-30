import SignIn from "./signIn";
import Link from "next/link";

import styled from "styled-components";

const StyledButtonCreate = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 8px 12px;
  color: #ffffff;
  background: #1a88f8;
  width: 100px;
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

const NavButtonGroup = ({ setIsOpen }) => {
  const userWhitelistStatus = true;

  return (
    <div className="flex justify-center align-center">
      {userWhitelistStatus ? (
        <div
          className="flex justify-center align-center mr-4 "
          onClick={() => setIsOpen(false)}
        >
          <Link href="/create">
            <StyledButtonCreate>Create</StyledButtonCreate>
          </Link>
        </div>
      ) : (
        <div className="flex justify-center align-center">
          <Link href="/">
            <a className="mx-2 btn-primary rounded-xl">Proposal</a>
          </Link>
        </div>
      )}
      <div onClick={() => setIsOpen(false)}>
        <SignIn width="" />
      </div>
    </div>
  );
};

export default NavButtonGroup;
