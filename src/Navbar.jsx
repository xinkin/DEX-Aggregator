// import { useState } from 'react'
import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
function Navbar() {
  return (
    <>
      <Box display="flex" bg="#161712" p={4} justifyContent="space-between">
        <Heading color="white">DEX Swap</Heading>
        <Button bg="#b7f01a">Connect Wallet</Button>
      </Box>
    </>
  );
}

export default Navbar;
