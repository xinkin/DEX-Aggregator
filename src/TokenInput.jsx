import { Box, Center, NumberInput, NumberInputField } from "@chakra-ui/react";
import Token from "./Token";
export default function TokenInput({
  accent,
  onChange,
  data,
  amtChange,
  buyAmount,
}) {
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
        <Token accent={accent} onChange={onChange} data={data} />
      </Center>
      <NumberInput
        defaultValue={0}
        value={buyAmount}
        size="lg"
        marginLeft="auto"
      >
        <NumberInputField onChange={(e) => amtChange(e.target.value)} />
      </NumberInput>
    </Box>
  );
}
