import { Text, Box, Image } from "@chakra-ui/react";
import CustomContainer from "./CustomContainer";

export default function NFTs({ nfts }) {
  return (
    <CustomContainer>
      <Text fontSize="2xl" fontWeight="bold">
        My NFTs
      </Text>
      {nfts.length > 0 ? (
        nfts.map((nft) => (
          <Box
            mt="4"
            px="2"
            py="2"
            borderWidth="1px"
            borderRadius="md"
            key={nft.token_url}
          >
            {nft.imageUrl && <Image src={nft.imageUrl} />}
            <p>{nft.token_url}</p>
          </Box>
        ))
      ) : (
        <p className=" text-xl font-bold text-center">No NFT assets Owned</p>
      )}
    </CustomContainer>
  );
}
