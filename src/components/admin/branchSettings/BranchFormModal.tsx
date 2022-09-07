import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Select,
  Input,
  VStack,
  useToast,
  FormControl,
  FormLabel,
  Checkbox,
} from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";
import { useParams } from "react-router-dom";

import { Branch } from "./BranchSettings";
import { AxiosRefetch } from "../../../util/types";
import { dateToServerFormat, parseDateString } from "../../../util/util";

enum FormModalType {
  Create = "CREATE",
  Edit = "EDIT",
}

interface Props {
  defaultValues: Partial<Branch>;
  isOpen: boolean;
  onClose: () => void;
  refetch: AxiosRefetch;
}

const BranchFormModal: React.FC<Props> = props => {
  const { hexathonId } = useParams();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
  } = useForm();

  const branchType = watch("type");
  const gradingEnabled = watch("grading.enabled");

  const type = useMemo(
    () => (props.defaultValues ? FormModalType.Edit : FormModalType.Create),
    [props.defaultValues]
  );

  useEffect(() => {
    // Manually parse open/close time into human readable formats
    const openTime = parseDateString(props.defaultValues?.settings?.open);
    const closeTime = parseDateString(props.defaultValues?.settings?.close);

    reset({
      ...props.defaultValues,
      settings: {
        open: openTime,
        close: closeTime,
      },
    });
  }, [props.defaultValues, reset]);

  const handleFormSubmit = async (values: any) => {
    const formData = {
      ...(type === FormModalType.Create && { hexathon: hexathonId }),
      ...values,
      settings: {
        open: dateToServerFormat(values.settings.open),
        close: dateToServerFormat(values.settings.close),
      },
      grading: {
        enabled: gradingEnabled,
        group: gradingEnabled ? values.grading.group : undefined,
      },
    };

    try {
      if (type === FormModalType.Create) {
        await axios.post(apiUrl(Service.REGISTRATION, "/branches"), formData);
        toast({
          title: "Success!",
          description: "The branch has successfully been created.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await axios.patch(
          apiUrl(Service.REGISTRATION, `/branches/${props.defaultValues.id}`),
          formData
        );
      }
      await props.refetch();
      toast({
        title: "Success!",
        description: "The branch has successfully been edited.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
        <ModalHeader>{`${type === FormModalType.Edit ? "Edit" : "Create"} Branch`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack spacing={4} alignItems="normal">
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input {...register("name")} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Type</FormLabel>
                <Select {...register("type")} placeholder="Select option">
                  <option value="APPLICATION">Application</option>
                  <option value="CONFIRMATION">Confirmation</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Application Group</FormLabel>
                <Select {...register("applicationGroup")} placeholder="Select option">
                  <option value="PARTICIPANT">Participant</option>
                  <option value="JUDGE">Judge</option>
                  <option value="MENTOR">Mentor</option>
                  <option value="VOLUNTEER">Volunteer</option>
                  <option value="SPONSOR">Sponsor</option>
                  <option value="PARTNER">Partner</option>
                  <option value="STAFF">Staff</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Open Time</FormLabel>
                <Input {...register("settings.open")} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Close Time</FormLabel>
                <Input {...register("settings.close")} />
              </FormControl>
              {branchType === "APPLICATION" && (
                <FormControl>
                  <Checkbox {...register("grading.enabled")}>Enable Grading?</Checkbox>
                </FormControl>
              )}
              {branchType === "APPLICATION" && gradingEnabled && (
                <FormControl isRequired>
                  <FormLabel>Grading Group</FormLabel>
                  <Select {...register("grading.group")} placeholder="Select option">
                    <option value="generalGroup">General Group</option>
                    <option value="emergingGroup">Emerging Group</option>
                  </Select>
                </FormControl>
              )}
              <Button colorScheme="purple" isLoading={isSubmitting} type="submit">
                {type === FormModalType.Edit ? "Save" : "Create"}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default BranchFormModal;
