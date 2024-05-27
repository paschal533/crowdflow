import { Divider, Text } from "@chakra-ui/react";
import { utils } from "ethers";
import CustomContainer from "./CustomContainer";

export default function Balance({ balances }) {
  return (
    <CustomContainer>
      <Text mb="6" fontSize="2xl" fontWeight="bold">
        My ERC20 Tokens
      </Text>
      {balances.length > 0 ? (
        balances?.map((balance) => {
          return (
            <div className="flex w-full justify-between">
              <p>{balance.symbol}</p>
              <p>{balance.name}</p>
              <p>{utils.formatUnits(balance.amount, balance.decimal)}</p>
            </div>
          );
        })
      ) : (
        <p className=" text-xl font-bold text-center">No Token assets Owned</p>
      )}
      <Divider />
    </CustomContainer>
  );
}
