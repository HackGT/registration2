import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";
import { EditIcon } from "@chakra-ui/icons";

interface Props {
  action: "CREATE" | "EDIT";
  hexathon: any;
}

const HexathonModal: React.FC<Props> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { register, handleSubmit } = useForm();

  const uploadFile = async (fileData: FileList) => {
    const file = fileData[0];
    const multipartFormData = new FormData();
    multipartFormData.append("file", file, file.name);
    const response = await axios.post(
      apiUrl(Service.FILES, "/files/upload-cdn"),
      multipartFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.storageId;
  };

  const onSubmit = async (data: any) => {
    const emailHeaderImageID = await uploadFile(data.emailHeaderImage);
    const coverImageID = props.action == "CREATE" && (await uploadFile(data.coverImage));
    const cdnUrl = "https://storage.googleapis.com/hexlabs-public-cdn/";

    const createOrEdit =
      props.action == "CREATE"
        ? await axios.post(apiUrl(Service.HEXATHONS, `/hexathons`), {
            name: data.name,
            shortCode: data.shortCode,
            isActive: data.isActive,
            startDate: `${data.startDate}T00:16:30.934Z`,
            endDate: `${data.endDate}T00:16:30.934Z`,
            emailHeaderImage: cdnUrl + emailHeaderImageID,
            coverImage: cdnUrl + coverImageID,
          })
        : await axios.put(apiUrl(Service.HEXATHONS, `/hexathons/${props.hexathon.id}`), {
            name: data.name,
            shortCode: data.shortCode,
            isActive: data.isActive,
            startDate: `${data.startDate}T00:16:30.934Z`,
            endDate: `${data.endDate}T00:16:30.934Z`,
            emailHeaderImage: cdnUrl + emailHeaderImageID,
          });

    onClose();
  };

  const button =
    props.action === "CREATE" ? (
      <Button onClick={onOpen}>Create Hexathon</Button>
    ) : (
      <Button onClick={onOpen} height="148px">
        <EditIcon />
      </Button>
    );

  return (
    <>
      {button}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {props.action == "CREATE" ? "Create Hexathon" : "Edit Hexathon"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={3}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input defaultValue={props.hexathon?.name} {...register("name")} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Short Code</FormLabel>
                  <Input defaultValue={props.hexathon?.shortCode} {...register("shortCode")} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    defaultValue={props.hexathon?.startDate.split("T")[0]}
                    type="date"
                    {...register("startDate")}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>End Date</FormLabel>
                  <Input
                    defaultValue={props.hexathon?.endDate.split("T")[0]}
                    type="date"
                    {...register("endDate")}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email Header Image</FormLabel>
                  <Input type="file" {...register("emailHeaderImage")} />
                </FormControl>
                {props.action == "CREATE" && (
                  <FormControl>
                    <FormLabel>Cover Image</FormLabel>
                    <Input type="file" {...register("coverImage")} />
                  </FormControl>
                )}
                <Checkbox defaultChecked {...register("isActive")}>
                  Active
                </Checkbox>

                <Button colorScheme="green" type="submit">
                  Submit
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HexathonModal;
