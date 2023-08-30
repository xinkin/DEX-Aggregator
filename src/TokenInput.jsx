import { Box, Center, NumberInput, NumberInputField } from "@chakra-ui/react";
import Token from "./Token";
export default function TokenInput({ accent }) {
  return (
    <Box
      borderRadius="xl"
      display="flex"
      bg="#042c39"
      width="100%"
      p="4"
      height="40%"
    >
      <Center>
        <Token accent={accent} />
      </Center>
      <NumberInput defaultValue={0} precision={1} size="lg" marginLeft="auto">
        <NumberInputField />
      </NumberInput>
    </Box>
  );
}
