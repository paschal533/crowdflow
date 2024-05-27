import { Flex, Box, Text, Grid, Link } from "@chakra-ui/react";

const ProfileStep = ({ icon, title, description }: any) => {
  return (
    <Flex
      className="bg-indigo-600 drop-shadow-2xl bg-gradient-to-r from-blue-500 to-violet-500"
      cursor="pointer"
      _hover={{ bg: "#2d89e6" }}
      transitionDuration="200ms"
      p="10"
      rounded="xl"
    >
      <Box
        bg="brand.blue"
        border="4px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        rounded="full"
        w="12"
        h="12"
        fontSize="xl"
        fontWeight="bold"
        color="white"
        p="2"
        borderColor="whiteAlpha.500"
      >
        {icon}
      </Box>
      <Box ml="2">
        <Text fontWeight="bold" fontSize="2xl" color="white">
          {title}
        </Text>
        <Text mt="1" color="whiteAlpha.800">
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

export default ProfileStep;
