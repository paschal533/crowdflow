import {
  Button,
  FormControl,
  Spinner,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import CustomContainer from "./CustomContainer";

export default function Send({ user }) {
  const [amount, setAmount] = useState(0);
  const [receiver, setReceiver] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (value) => setAmount(value);

  const toast = useToast();

  const sendToken = async (e) => {
    if (!amount || !receiver) return;
    e.preventDefault();
    // @ts-ignore TODO: fix typescript error
    setSending(true);
    try {
      toast({
        position: "top-left",
        title: "Token successfully sent.",
        description: "Fresh Token are showing up into the wallet.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setReceiver("");
      setSending(false);
    } catch (error) {
      console.log(error);
      setReceiver("");
      setSending(false);
    }
  };

  return (
    <CustomContainer>
      {sending ? (
        <div className="flex h-[250px] flex-col items-center justify-center py-2">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </div>
      ) : (
        <>
          <Text fontSize="xl" fontWeight="bold">
            Send Token
          </Text>
          <form onSubmit={(e) => sendToken(e)}>
            <FormControl mt="4">
              <FormLabel htmlFor="amount">Amount of Token</FormLabel>
              <NumberInput step={0.1} onChange={handleChange}>
                <NumberInputField id="amount" value={amount} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormLabel htmlFor="receiver">Send to</FormLabel>
              <Input
                onChange={(e) => setReceiver(e.target.value)}
                id="receiver"
                value={receiver}
                type="text"
                placeholder="Receiver Address"
              />
            </FormControl>
            <Button type="submit" mt="4" colorScheme="purple">
              Send
            </Button>
          </form>
        </>
      )}
    </CustomContainer>
  );
}
