import React from "react";
import Token from "./Token";
import { MdOutlineSwapCalls } from "react-icons/md";
import { Box, Container, Heading, VStack } from "@chakra-ui/react";
import { NumberInput, NumberInputField } from "@chakra-ui/react";
import { Divider, Center, AbsoluteCenter } from "@chakra-ui/react";

export default function Body() {
  return (
    <>
      <Center>
        <Box width="xl" bg="blue.700" borderRadius="lg" color="white" p={6}>
          <Heading size="xl">Swap</Heading>
          <Divider my={4} />
          <VStack spacing={4}>
            <Box
              borderRadius="lg"
              display="flex"
              bg="blue.400"
              width="100%"
              p="4"
              height="40%"
            >
              <Center>
                <Token />
              </Center>
              <NumberInput
                defaultValue={15}
                precision={2}
                size="lg"
                marginLeft="auto"
              >
                <NumberInputField />
              </NumberInput>
            </Box>
            <Box position="relative" padding="4" bg="blue.700">
              <AbsoluteCenter px="4">
                <MdOutlineSwapCalls size={35} />
              </AbsoluteCenter>
            </Box>
            <Box
              borderRadius="lg"
              display="flex"
              bg="blue.400"
              width="100%"
              p="4"
              height="40%"
            >
              <Center>
                <Token />
              </Center>
              <NumberInput
                defaultValue={15}
                precision={2}
                size="lg"
                marginLeft="auto"
              >
                <NumberInputField />
              </NumberInput>
            </Box>
          </VStack>
        </Box>
      </Center>
    </>
  );
}
