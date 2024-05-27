import { Flex, Box, Text } from "@chakra-ui/react";

interface Props {
  title: string;
  step: any;
  description: string;
}

const Step = ({ step, title, description }: Props) => {
  return (
    <Flex
      className="shadow-lg shadow-black-500 "
      direction="column"
      bg="whiteAlpha.900"
      cursor="pointer"
      _hover={{ bg: "whiteAlpha.800" }}
      transitionDuration="200ms"
      p="10"
      rounded="xl"
    >
      <Box
        bg="#2d89e6"
        border="4px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        rounded="full"
        w="12"
        h="12"
        fontSize="xl"
        fontWeight="bold"
        color="whiteAlpha.900"
        p="2"
        borderColor="#2d89e6"
      >
        {step}
      </Box>
      <Box mt="2">
        <Text fontWeight="bold" fontSize="2xl" color="black">
          {title}
        </Text>
        <Text mt="1" color="black">
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

export default Step;
