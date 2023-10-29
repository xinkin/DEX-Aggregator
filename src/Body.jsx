import React, { useEffect } from "react";
import { useState } from "react";
import TokenInput from "./TokenInput";
import axios from "axios";
import { useSendTransaction, usePrepareSendTransaction } from "wagmi";
import { useAccount } from "wagmi";
import qs from "qs";
import { MdOutlineSwapCalls } from "react-icons/md";
import { Box, Heading, VStack, Text, Button, Flex } from "@chakra-ui/react";
import { Divider, AbsoluteCenter } from "@chakra-ui/react";
import { parseEther } from "viem";

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

  const { address, isConnected } = useAccount();
  const [sellToken, setsellToken] = useState("");
  const [buyToken, setbuyToken] = useState("");
  const [sellAmount, setsellAmount] = useState(0);
  const [buyAmount, setbuyAmount] = useState(0);
  const [swapInfo, setswapInfo] = useState({});
  const [reviewSwap, setreviewSwap] = useState(false);

  useEffect(() => {
    async function getSwapInfo() {
      const params = {
        buyToken: buyToken,
        sellToken: sellToken,
        sellAmount: sellAmount * 1e18,
        // takerAddress: address,
      };
      const headers = {
        "0x-api-key": "63efa87d-8185-4d60-a2d0-c8ccde5b2ee8",
      };
      if (reviewSwap) {
        try {
          const response = await axios.get(
            `https://polygon.api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
            { headers },
          );
          setswapInfo(response.data);
          setbuyAmount(response.data.price);
        } catch (error) {
          console.log(error);
        }
      }
    }
    console.log("reviewSwap", reviewSwap);
    getSwapInfo();
    console.log(swapInfo);
  }, [reviewSwap]);

  const handleAmountChange = (value) => {
    setsellAmount(value);
  };

  const handleSellTokenChange = (value) => {
    setsellToken(value);
  };

  const handleBuyTokenChange = (value) => {
    setbuyToken(value);
  };

  const { config } = usePrepareSendTransaction({
    to: swapInfo.to,
    value: swapInfo.value,
    data: swapInfo.data,
    gasPrice: swapInfo.gasPrice,
  });

  const { sendTransaction } = useSendTransaction(config);

  console.log(sellAmount);
  console.log(buyToken);
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
        <Text mt={10} mb={1} fontSize="lg">
          Estimated Gas: {swapInfo.gasPrice} wei
        </Text>
        <Text mb={4} fontSize="lg">
          Route:
          {swapInfo.sources
            ? ` ${swapInfo.sources
                .find((source) => source.proportion === "1")
                .name.replace("_", " ")}`
            : null}
        </Text>
        <Button
          // isDisabled={isDisabled}
          bg={accent}
          w="100%"
          h={50}
          borderRadius="3xl"
          onClick={() => setreviewSwap(true)}
        >
          Review Swap
        </Button>
        <Button
          mt={4}
          bg={accent}
          w="100%"
          h={50}
          borderRadius="3xl"
          onClick={() => sendTransaction?.()}
        >
          Swap
        </Button>
      </Box>
    </Flex>
  );
}
