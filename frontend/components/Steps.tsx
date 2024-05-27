import { Box, Text, Grid } from "@chakra-ui/react";
import Step from "@/components/Step";
import { IoMdCreate } from "react-icons/io";
import { BiDonateHeart, BiReceipt } from "react-icons/bi";

export default function Steps() {
  return (
    <Box
      id="steps"
      position="relative"
      zIndex={2}
      w="full"
      opacity="0.97"
      bg="#2d89e6"
      mx="auto"
      py="20"
    >
      <Box mb="10">
        <Text color="white" align="center" fontWeight="bold" fontSize="4xl">
          How it works
        </Text>
      </Box>
      <Grid
        mt="2"
        px="10"
        maxW="6xl"
        mx="auto"
        templateColumns={{
          base: "repeat(1,1fr)",
          sm: "repeat(1,1fr)",
          md: "repeat(2,1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap="10"
        w="full"
      >
        <Step
          title="Make a Donation"
          step={<BiDonateHeart />}
          description={`
              Donate to a fundraiser by simply clicking on "Browse Causes" button above and then click on the fundraiser card, this will take you to the fundraiser
              page for you to make your donations.
          `}
        />
        <Step
          title="Create a Fundraiser"
          step={<IoMdCreate />}
          description={`
              You can create a fundraiser by clicking on the "Create" button at
              the Navbar, that will take you to the 'Create fundraiser' page
              where you will need to fill the information about the fundraiser
              you want create.
          `}
        />
        <Step
          title="Print receipt"
          step={<BiReceipt />}
          description={`
            You can print the receipt of any of your donations by going to your 
            profile page and click on the "Donations record" tab, and then click on "request receipt" button.
        `}
        />
      </Grid>
    </Box>
  );
}
