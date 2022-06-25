import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Select,
  Input,
  InputGroup,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";

import { FormModalType } from "./AccordionSection";

const FormModal: React.FC<FormModalType> = props => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="purple" size="sm" width="80px" onClick={onOpen}>
        {props.buttonName}
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.functionName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(props.function)}>
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
              <HStack margin={5}>
                <Button
                  colorScheme="green"
                  size="sm"
                  width="80px"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  {props.buttonName === "Edit" ? "Save" : "Create"}
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
              </HStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default FormModal;
