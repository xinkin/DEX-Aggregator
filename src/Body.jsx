import React from "react";
import { useState } from "react";
import TokenInput from "./TokenInput";
import { MdOutlineSwapCalls } from "react-icons/md";
import { Box, Heading, VStack, Text, Button, Flex } from "@chakra-ui/react";
import { Divider, AbsoluteCenter } from "@chakra-ui/react";

// text = #ffffff
// bg = #161712
// primary = #0d8fbf
// secondary = #042c39
// accent = #b7f01a

export default function Body({ isDisabled }) {
  const bg = "#161712";
  const primary = "#0d8fbf";
  const secondary = "#042c39";
  const accent = "#b7f01a";

  return (
    <Flex
      height={`calc(100vh - 75px)`}
      alignItems="center"
      justifyContent="center"
      bg={bg}
    >
      <Box width="xl" bg={primary} borderRadius="2xl" color="white" p={10}>
        <Heading size="xl">Swap</Heading>
        <Divider my={4} />
        <VStack spacing={4}>
          <TokenInput accent={accent} />
          <Box position="relative" padding="4" bg={primary}>
            <AbsoluteCenter px="4">
              <MdOutlineSwapCalls size={35} />
            </AbsoluteCenter>
          </Box>
          <TokenInput accent={accent} />
        </VStack>
        <Text mt={10} mb={4} fontSize="lg">
          Estimated Gas:
        </Text>
        <Button
          isDisabled={isDisabled}
          bg={accent}
          w="100%"
          h={50}
          borderRadius="3xl"
        >
          Review Swap
        </Button>
      </Box>
    </Flex>
  );
}
