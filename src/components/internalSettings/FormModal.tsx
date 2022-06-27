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
  Text,
  Input,
  InputGroup,
  HStack,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { DateTime } from "luxon";

import { FormModalType } from "./AccordionSection";

const FormModal: React.FC<FormModalType> = props => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const openTime = DateTime.fromISO(props.settings.open, {
    zone: "utc",
  }).toLocaleString(DateTime.DATETIME_SHORT);
  const closeTime = DateTime.fromISO(props.settings.close, {
    zone: "utc",
  }).toLocaleString(DateTime.DATETIME_SHORT);
  const invalidParseCase = "Invalid DateTime";

  return (
    <>
      <Button colorScheme="purple" size="sm" width="80px" onClick={onOpen}>
        {props.buttonName}
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${props.buttonName} Branch`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(props.updateBranch)}>
              <HStack>
                <Text>Name:</Text>
                <Box flex="1" textAlign="left">
                  <Input defaultValue={props.name} {...register("name")} isRequired />
                </Box>
              </HStack>
              <HStack>
                <Text>Type:</Text>
                {props.type ? (
                  <Select defaultValue={props.type} {...register("type")}>
                    <option value="APPLICATION">Application</option>
                    <option value="CONFIRMATION">Confirmation</option>
                  </Select>
                ) : (
                  <Select defaultValue={props.type} {...register("type")}>
                    <option value="">Select branch type</option>
                    <option value="APPLICATION">Application</option>
                    <option value="CONFIRMATION">Confirmation</option>
                  </Select>
                )}
              </HStack>
              <InputGroup>
                <VStack>
                  <HStack>
                    <Text>Open Time:</Text>
                    <Input
                      width="15rem"
                      defaultValue={openTime === invalidParseCase ? "" : openTime}
                      size="sm"
                      {...register("settings.open")}
                      isRequired
                    />
                  </HStack>
                  <HStack>
                    <Text>Close Time:</Text>
                    <Input
                      width="15rem"
                      defaultValue={closeTime === invalidParseCase ? "" : closeTime}
                      size="sm"
                      {...register("settings.close")}
                      isRequired
                    />
                  </HStack>
                </VStack>
              </InputGroup>
              <Button
                colorScheme="green"
                size="sm"
                width="80px"
                isLoading={isSubmitting}
                type="submit"
              >
                {props.buttonName === "Edit" ? "Save" : "Create"}
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default FormModal;
