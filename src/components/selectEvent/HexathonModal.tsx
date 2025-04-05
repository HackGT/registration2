import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  VStack,
  Link,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";
import { DateTime } from "luxon";

import { parseDateString } from "../../util/util";
import { AxiosRefetch } from "../../util/types";
import { QuestionIcon } from "@chakra-ui/icons";

enum FormModalType {
  Create = "CREATE",
  Edit = "EDIT",
}

interface Props {
  defaultValues: any;
  isOpen: boolean;
  onClose: () => void;
  refetch: AxiosRefetch;
}

const HexathonModal: React.FC<Props> = props => {
  const toast = useToast();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    // Manually parse start/end date into human readable formats
    const startDate = parseDateString(props.defaultValues?.startDate);
    const endDate = parseDateString(props.defaultValues?.endDate);
    reset({
      ...props.defaultValues,
      startDate,
      endDate,
    });
  }, [props.defaultValues, reset]);

  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  const type = useMemo(
    () => (props.defaultValues ? FormModalType.Edit : FormModalType.Create),
    [props.defaultValues]
  );

  const uploadCDNFile = async (file: File) => {
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
    setFormSubmitLoading(true);
    const formData = {
      ...data,
      startDate: DateTime.fromFormat(data.startDate, "yyyy-MM-dd'T'HH:mm").toISO(),
      endDate: DateTime.fromFormat(data.endDate, "yyyy-MM-dd'T'HH:mm").toISO(),
    };

    // Manually upload images to CDN and add base url
    const CDN_BASE_URL = "https://storage.googleapis.com/hexlabs-public-cdn/";

    if (data.emailHeaderImage?.length > 0 && data.emailHeaderImage[0] instanceof File) {
      formData.emailHeaderImage = CDN_BASE_URL + (await uploadCDNFile(data.emailHeaderImage[0]));
    } else {
      delete formData.emailHeaderImage;
    }
    if (data.coverImage?.length > 0 && data.coverImage[0] instanceof File) {
      formData.coverImage = CDN_BASE_URL + (await uploadCDNFile(data.coverImage[0]));
    } else {
      delete formData.coverImage;
    }

    try {
      if (type === FormModalType.Create) {
        await axios.post(apiUrl(Service.HEXATHONS, "/hexathons"), formData);
        toast({
          title: "Success!",
          description: "Hexathon successfully created.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await axios.put(
          apiUrl(Service.HEXATHONS, `/hexathons/${props.defaultValues.id}`),
          formData
        );
        toast({
          title: "Success!",
          description: "Hexathon successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e: any) {
      handleAxiosError(e);
    } finally {
      setFormSubmitLoading(false);
      props.refetch();
      props.onClose();
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {type === FormModalType.Create ? "Create Hexathon" : "Edit Hexathon"}
        </ModalHeader>
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
                <Input type="datetime-local" {...register("startDate")} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>End Date</FormLabel>
                <Input type="datetime-local" {...register("endDate")} />
              </FormControl>
              <FormControl>
                <FormLabel>
                  Email Header Image
                  <Tooltip
                    label="This image is used to brand the event and will be displayed at the top of all emails sent to users for this event."
                    placement="auto-start"
                    hasArrow
                  >
                    <QuestionIcon ml="1" mb="1" />
                  </Tooltip>{" "}
                  {props.defaultValues?.emailHeaderImage && (
                    <Link href={props.defaultValues?.emailHeaderImage} isExternal color="teal">
                      (View Current Image)
                    </Link>
                  )}
                </FormLabel>
                <Input type="file" {...register("emailHeaderImage")} padding="4px" />
              </FormControl>
              <FormControl>
                <FormLabel>
                  Cover Image
                  <Tooltip
                    label="This is the square image that will be displayed on the select event page. Also, it's displayed as a circlular image in the top right corner of the navbar."
                    placement="auto-start"
                    hasArrow
                  >
                    <QuestionIcon ml="1" mb="1" />
                  </Tooltip>{" "}
                  {props.defaultValues?.coverImage && (
                    <Link href={props.defaultValues?.coverImage} isExternal color="teal">
                      (View Current Image)
                    </Link>
                  )}
                </FormLabel>
                <Input type="file" {...register("coverImage")} padding="4px" />
              </FormControl>
              <FormControl>
                <Checkbox {...register("isActive")}>
                  Active
                  <Tooltip
                    label="Only hexathons selected as active will be displayed publicly to all users. HexLabs members can always access all hexathons."
                    placement="auto-start"
                    hasArrow
                  >
                    <QuestionIcon ml="1" mb="1" />
                  </Tooltip>
                </Checkbox>
              </FormControl>
              <FormControl>
                <Checkbox {...register("isTeamBased")}>
                  Team Based
                  <Tooltip
                    label="Select if this hexathon is team based. This will enable team management features in registration and other applications."
                    placement="auto-start"
                    hasArrow
                  >
                    <QuestionIcon ml="1" mb="1" />
                  </Tooltip>
                </Checkbox>
              </FormControl>
              <FormControl>
                <Checkbox {...register("isDev")}>
                  Is Dev
                  <Tooltip
                    label="Select if this hexathon is a dev hexathon. This will make the hexathon only available to Hexlabs members."
                    placement="auto-start"
                    hasArrow
                  >
                    <QuestionIcon ml="1" mb="1" />
                  </Tooltip>
                </Checkbox>
              </FormControl>
              <Button type="submit" isLoading={formSubmitLoading}>
                Submit
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HexathonModal;
