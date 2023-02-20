import React from "react";
import {Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, FormControl, FormLabel, Input, Checkbox, VStack} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

const HexathonModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { register, handleSubmit } = useForm();
  const onSubmit = async (data: any) => {
    await axios.post(
      apiUrl(Service.HEXATHONS, `/hexathons`),
      {
          name: data.name,
          shortCode: data.shortCode,
          isActive: data.isActive,
          startDate: `${data.startDate}T00:16:30.934Z`,
          endDate: `${data.endDate}T00:16:30.934Z`,
          emailHeaderImage: data.emailHeaderImage,
          coverImage: data.coverImage
      }
    );

    onClose();
  }

  return (
    <>
      <Button onClick={onOpen}>Create Hexathon</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Hexathon</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={3}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input {...register("name")} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Short Code</FormLabel>
                  <Input {...register("shortCode")} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Start Date</FormLabel>
                  <Input type="date" {...register("startDate")} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>End Date</FormLabel>
                  <Input type="date" {...register("endDate")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Email Header Image</FormLabel>
                  <Input {...register("emailHeaderImage")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Cover Image</FormLabel>
                  <Input {...register("coverImage")} />
                </FormControl>
                <Checkbox {...register("isActive")}>Active</Checkbox>

                <Button colorScheme="green" type="submit">Submit</Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
};

export default HexathonModal;
