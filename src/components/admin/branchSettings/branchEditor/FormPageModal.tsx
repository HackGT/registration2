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
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";

import { AxiosRefetch } from "../../../../util/types";

enum FormModalType {
  Add = "ADD",
  Edit = "EDIT",
}

interface Props {
  defaultValues?: any;
  branchId: any;
  formPageIndex?: number;
  formPages: any[];
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

  const type = useMemo(
    () =>
      props.defaultValues && props.formPageIndex !== undefined
        ? FormModalType.Edit
        : FormModalType.Add,
    [props.defaultValues, props.formPageIndex]
  );

  useEffect(() => {
    reset(props.defaultValues ?? {});
  }, [props.defaultValues, reset]);

  const toast = useToast();

  const handleFormSubmit = async (values: any) => {
    const updatedFormPages: any[] = [...props.formPages];

    try {
      if (type === FormModalType.Add) {
        updatedFormPages.push({
          title: values.title,
          jsonSchema: '{\n  "title": "Form",\n  "type": "object",\n  "properties": {\n    \n  }\n}',
          uiSchema: "{}",
        });
        await axios.patch(apiUrl(Service.REGISTRATION, `/branches/${props.branchId}`), {
          formPages: updatedFormPages,
        });
        toast({
          title: "Success!",
          description: "The form page has successfully been added.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        updatedFormPages[props.formPageIndex!].title = values.title;
        await axios.patch(apiUrl(Service.REGISTRATION, `/branches/${props.branchId}`), {
          formPages: updatedFormPages,
        });
        toast({
          title: "Success!",
          description: "The form page has successfully been edited.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      await props.refetch();
    } catch (e: any) {
      handleAxiosError(e);
    } finally {
      props.onClose();
    }
  };

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${type === FormModalType.Edit ? "Edit" : "Add"} Form Page`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack spacing={4} alignItems="normal">
              <FormControl isRequired>
                <FormLabel>Form Title</FormLabel>
                <Input {...register("title")} />
              </FormControl>
              <Button colorScheme="purple" isLoading={isSubmitting} type="submit">
                {type === FormModalType.Edit ? "Save" : "Add"}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default FormPageModal;
