import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  List,
  ListItem,
  Image,
  Box,
  Divider,
} from "@chakra-ui/react";

export default function Token({ accent }) {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedURI, setSelectedURI] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://tokens.coingecko.com/uniswap/all.json",
        );
        const first50 = response.data.tokens.slice(0, 50);
        setData(first50);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const tokens = data.map((token) => {
    return (
      <div key={token.address}>
        <Box
          display="flex"
          onClick={() => handleSelect(token.logoURI, token.symbol)}
        >
          <Image src={token.logoURI} />
          <ListItem ml={5}>{token.symbol}</ListItem>
        </Box>
        <Divider my={2} />
      </div>
    );
  });

  console.log(data);

  const handleSelect = (URI, item) => {
    setSelectedItem(item);
    setSelectedURI(URI);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        leftIcon={
          selectedItem ? <img src={selectedURI} width="20" height="20" /> : null
        }
        colorScheme="whiteAlpha"
        onClick={() => setIsOpen(true)}
      >
        {selectedItem || "Select Token"}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select a token</ModalHeader>
          <ModalBody>
            <List spacing={2}>{tokens}</List>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
