import React, { useEffect } from "react";
import { useState } from "react";
import TokenInput from "./TokenInput";
import axios from "axios";
//
import qs from "qs";
import { MdOutlineSwapCalls } from "react-icons/md";
import { Box, Heading, VStack, Text, Button, Flex } from "@chakra-ui/react";
import { Divider, AbsoluteCenter } from "@chakra-ui/react";

// text = #ffffff
// bg = #161712
// primary = #0d8fbf
// secondary = #042c39
// accent = #b7f01a

export default function Body({ isDisabled, data }) {
  const bg = "#161712";
  const primary = "#0d8fbf";
  const secondary = "#042c39";
  const accent = "#b7f01a";

  const [sellToken, setsellToken] = useState("");
  const [buyToken, setbuyToken] = useState("");
  const [sellAmount, setsellAmount] = useState(0);
  const [buyAmount, setbuyAmount] = useState(0);
  const [swapInfo, setswapInfo] = useState({});
  const [reviewSwap, setreviewSwap] = useState(false);

  useEffect(() => {
    async function getSwapInfo() {
      const params = {
        sellToken: sellToken,
        buyToken: buyToken,
        sellAmount: sellAmount * 10 ** 18,
      };
      const headers = {
        "0x-api-key": "63efa87d-8185-4d60-a2d0-c8ccde5b2ee8",
      };
      if (reviewSwap) {
        try {
          const response = await axios.get(
            `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`,
            { headers },
          );
          setswapInfo(response.data);
          setbuyAmount(swapInfo.price);
        } catch (error) {
          console.log(error);
        }
      }
    }
    console.log("reviewSwap", reviewSwap);
    getSwapInfo();
    setreviewSwap(false);
  }, [reviewSwap]);

  console.log(swapInfo);
  console.log(buyAmount);

  const handleAmountChange = (value) => {
    setsellAmount(value);
  };

  const handleSellTokenChange = (value) => {
    setsellToken(value);
  };

  const handleBuyTokenChange = (value) => {
    setbuyToken(value);
  };
  console.log(sellToken);
  console.log(buyToken);
  console.log(sellAmount);
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
          <TokenInput
            accent={accent}
            onChange={handleSellTokenChange}
            amtChange={handleAmountChange}
            data={data}
          />
          <Box position="relative" padding="4" bg={primary}>
            <AbsoluteCenter px="4">
              <MdOutlineSwapCalls size={35} />
            </AbsoluteCenter>
          </Box>
          <TokenInput
            accent={accent}
            onChange={handleBuyTokenChange}
            buyAmount={buyAmount}
            data={data}
          />
        </VStack>
        <Text mt={10} mb={4} fontSize="lg">
          Estimated Gas: {swapInfo.gas}
        </Text>
        <Button
          isDisabled={isDisabled}
          bg={accent}
          w="100%"
          h={50}
          borderRadius="3xl"
          onClick={() => setreviewSwap(true)}
        >
          Review Swap
        </Button>
      </Box>
    </Flex>
  );
}
