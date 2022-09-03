/* eslint-disable no-underscore-dangle */
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  VStack,
  useToast,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AxiosRefetch } from "../../../types/helper";


enum FormModalType {
  Add = "ADD",
  Edit = "EDIT",
}

interface Props {
  defaultValues: any;
  type: string;
  branchId: any;
  formPageIndex: number;
  isOpen: boolean;
  onClose: () => void;
  refetch: AxiosRefetch;
}

const FormPageModal: React.FC<Props> = props => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm();

  const toast = useToast();

  const handleFormSubmit = async (values: any) => {
    try {
      let pageData = "";
      if (props.type === FormModalType.Add) {
        props.defaultValues.formPages.push({"title": values.title, "jsonSchema": "{}", "uiSchema": "{}"});
        pageData = props.defaultValues.formPages;
        await axios.patch(`https://registration.api.hexlabs.org/branches/${props.branchId}`, {
            formPages: pageData,
          });
        toast({
          title: "Success!",
          description: "The form page has successfully been added.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        await props.refetch();
      } else {
        props.defaultValues.formPages[props.formPageIndex].title = values.title;
        pageData = props.defaultValues.formPages;
        await axios.patch(
          `https://registration.api.hexlabs.org/branches/${props.branchId}`, {
            formPages: pageData,
          }
        );
        toast({
          title: "Success!",
          description: "The form page has successfully been edited.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        await props.refetch();
      }
    } catch (e: any) {
      console.log(e);
      toast({
        title: "Error!",
        description: "One or more entries are invalid. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      props.onClose();
    }
  };

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${props.type == FormModalType.Edit ? "Edit" : "Add"} Form Page`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack spacing={4} alignItems="normal">
              <FormControl isRequired>
                <FormLabel>Form Title</FormLabel>
                <Input {...register("title")} />
              </FormControl>
              <Button colorScheme="purple" isLoading={isSubmitting} type="submit">
                {props.type == FormModalType.Edit ? "Save" : "Add"}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default FormPageModal;
