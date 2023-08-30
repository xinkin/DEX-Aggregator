// import { useState } from 'react'
import React from 'react'
import { Box, Heading } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
function Navbar() {

  return (
    <>
      <Box display='flex' bg='gray' p={4} justifyContent='space-between'>
        <Heading>DEX Swap</Heading>
        <Button>
          Metamask
        </Button>
      </Box>
    </>
  )
}

export default Navbar
