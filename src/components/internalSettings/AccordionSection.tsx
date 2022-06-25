import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import React from "react";
import axios from "axios";

import { Branch } from "./InternalSettings";

const AccordionSection: React.FC<Branch> = props => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const saveBranch = async (values: Partial<Branch>) => {
    await axios.patch(`https://registration.api.hexlabs.org/branches/${props._id}`, { ...values });
  };

  return (
    <Box borderWidth={1} margin={10}>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              {props.name}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Box flex="1" textAlign="left" borderWidth={1} padding={1}>
            {props.type === "APPLICATION" ? "Application" : "Confirmation"}
          </Box>
          <InputGroup>
            <Box width="15rem" borderWidth={1} padding={1}>
              {props.settings.open}
            </Box>
            <Box width="15rem" borderWidth={1} padding={1}>
              {props.settings.close}
            </Box>
          </InputGroup>
          <Button colorScheme="purple" size="sm" width="80px" onClick={onOpen}>
            Edit
          </Button>

          <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleSubmit(saveBranch)}>
                  <Box flex="1" textAlign="left">
                    <Input defaultValue={props.name} {...register("name")} />
                  </Box>
                  <Select defaultValue={props.type} {...register("type")}>
                    <option value="APPLICATION">Application</option>
                    <option value="CONFIRMATION">Confirmation</option>
                  </Select>
                  <InputGroup>
                    <Input
                      width="15rem"
                      defaultValue={props.settings.open}
                      size="sm"
                      {...register("settings.open")}
                    />
                    <Input
                      width="15rem"
                      defaultValue={props.settings.close}
                      size="sm"
                      {...register("settings.close")}
                    />
                  </InputGroup>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="green"
                  size="sm"
                  width="80px"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  width="80px"
                  isLoading={isSubmitting}
                  onClick={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </AccordionPanel>
      </AccordionItem>
    </Box>
  );
};

export default AccordionSection;
