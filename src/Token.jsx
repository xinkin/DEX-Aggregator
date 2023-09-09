import React from "react";
import { useState, useEffect } from "react";

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

export default function Token({ onChange, data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedURI, setSelectedURI] = useState("");

  const tokens = data.map((token) => {
    return (
      <div key={token.address}>
        <Box
          display="flex"
          onClick={() =>
            handleSelect(token.logoURI, token.symbol, token.symbol)
          }
        >
          <Image src={token.logoURI} boxSize="30px" />
          <ListItem ml={5}>{token.symbol}</ListItem>
        </Box>
        <Divider my={2} />
      </div>
    );
  });

  const handleSelect = (URI, item, taddress) => {
    setSelectedItem(item);
    onChange(taddress);
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
