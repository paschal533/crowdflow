import Link from "next/link";
import Button from "@/components/Button";
import { ConnectKitButton } from "connectkit";

const NavButtonGroup = ({ setIsOpen }) => {
  const userWhitelistStatus = true;

  return (
    <div className="flex justify-center align-center">
      {userWhitelistStatus ? (
        <div
          className="flex justify-center align-center"
          onClick={() => setIsOpen(false)}
        >
          <Link href="/create">
            <a className="mx-2 btn-primary hover:bg-[#235f9b] rounded-xl">
              Create
            </a>
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
        <ConnectKitButton />
      </div>
    </div>
  );
};

export default NavButtonGroup;
