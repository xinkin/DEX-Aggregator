import { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        {selectedItem || "Select an item"}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select an item</ModalHeader>
          <ModalBody>
            <Menu>
              <MenuButton>{selectedItem || "Select an item"}</MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleSelect("Item 1")}>
                  Item 1
                </MenuItem>
                <MenuItem onClick={() => handleSelect("Item 2")}>
                  Item 2
                </MenuItem>
                <MenuItem onClick={() => handleSelect("Item 3")}>
                  Item 3
                </MenuItem>
              </MenuList>
            </Menu>
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
