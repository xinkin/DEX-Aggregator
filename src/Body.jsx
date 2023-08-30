import React from "react";
import TokenInput from "./TokenInput";
import { MdOutlineSwapCalls } from "react-icons/md";
import { Box, Heading, VStack, Text, Button, Flex } from "@chakra-ui/react";
import { Divider, Center, AbsoluteCenter } from "@chakra-ui/react";

export default function Body() {
  return (
    <Flex
      height={`calc(100vh - 75px)`}
      alignItems="center"
      justifyContent="center"
      bg="#161712"
    >
      <Box width="xl" bg="#0d8fbf" borderRadius="2xl" color="white" p={10}>
        <Heading size="xl">Swap</Heading>
        <Divider my={4} />
        <VStack spacing={4}>
          <TokenInput />
          <Box position="relative" padding="4" bg="#0d8fbf">
            <AbsoluteCenter px="4">
              <MdOutlineSwapCalls size={35} />
            </AbsoluteCenter>
          </Box>
          <TokenInput />
        </VStack>
        <Text mt={10} mb={4} fontSize="lg">
          Estimated Gas:
        </Text>
        <Button bg="#b7f01a" w="100%" h={50} borderRadius="3xl">
          Review Swap
        </Button>
      </Box>
    </Flex>
  );
}
