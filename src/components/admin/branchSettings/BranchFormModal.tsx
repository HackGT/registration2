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
  Tooltip,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  PopoverFooter,
  Text,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import { Branch, BranchType } from "./BranchSettings";
import { AxiosRefetch } from "../../../util/types";
import { dateToServerFormat, parseDateString } from "../../../util/util";
import { InfoIcon } from "@chakra-ui/icons";

enum FormModalType {
  Create = "CREATE",
  Edit = "EDIT",
}

interface Props {
  defaultValues: Partial<Branch>;
  isOpen: boolean;
  onClose: () => void;
  refetch: AxiosRefetch;
  branches: any;
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

  const [emails, setEmails] = useState<any>("");
  const emailHelpMessage =
    "Separate each email by a comma. Enter '*' to autoconfirm all emails and don't forget the '@' for domains, ex: @hexlabs.org";
  const branchType = watch("type");
  const secret = watch("secret");
  const gradingEnabled = watch("grading.enabled");
  const automaticConfirmationEnabled = watch("automaticConfirmation.enabled");

  const type = useMemo(
    () => (props.defaultValues ? FormModalType.Edit : FormModalType.Create),
    [props.defaultValues]
  );

  useEffect(() => {
    // Manually parse open/close time into human readable formats
    const openTime = parseDateString(props.defaultValues?.settings?.open);
    const closeTime = parseDateString(props.defaultValues?.settings?.close);
    setEmails(
      props.defaultValues?.automaticConfirmation?.emails
        ? props.defaultValues?.automaticConfirmation?.emails.join(", ")
        : ""
    );
    reset({
      ...props.defaultValues,
      settings: {
        open: openTime,
        close: closeTime,
      },
    });
  }, [props.defaultValues, reset]);

  const handleEmailInput = (e: any) => setEmails(e.target.value);

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
      automaticConfirmation: {
        enabled: automaticConfirmationEnabled,
        confirmationBranch: automaticConfirmationEnabled
          ? values.automaticConfirmation.confirmationBranch
          : undefined,
        emails: automaticConfirmationEnabled ? emails.replace(/ /g, "").split(",") : undefined,
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
                  <Checkbox {...register("secret")}>Secret</Checkbox>
                </FormControl>
              )}
              {branchType === "APPLICATION" && secret && props.defaultValues && (
                <HStack display="flex" justifyContent="center">
                  <Popover>
                    <PopoverTrigger>
                      <Button>View QR Code</Button>
                    </PopoverTrigger>
                    <PopoverContent bg="#d1d1d1">
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader display="flex" justifyContent="center">
                        QR Code
                      </PopoverHeader>
                      <PopoverBody display="flex" justifyContent="center">
                        <QRCodeSVG
                          value={apiUrl(
                            Service.REGISTRATION,
                            `/${hexathonId}/start-application/${props.defaultValues.id}`
                          )}
                          size={256}
                        />
                      </PopoverBody>
                      <PopoverFooter>
                        <Text fontSize="12px">
                          Ask participants to scan this code to be directed to the application page
                          for this branch
                        </Text>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        apiUrl(
                          Service.REGISTRATION,
                          `/${hexathonId}/start-application/${props.defaultValues.id}`
                        )
                      );
                      toast({
                        title: "Success!",
                        description: "Link has been copied.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                    }}
                  >
                    Copy link
                  </Button>
                </HStack>
              )}
              {branchType === "APPLICATION" && (
                <FormControl>
                  <Checkbox {...register("automaticConfirmation.enabled")}>
                    Enable Auto-Confirmation?
                  </Checkbox>
                </FormControl>
              )}
              {branchType === "APPLICATION" && automaticConfirmationEnabled && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Confirmation Branch</FormLabel>
                    <Select
                      {...register("automaticConfirmation.confirmationBranch")}
                      placeholder="Select option"
                    >
                      {props.branches &&
                        props.branches
                          .filter((branch: Branch) => branch.type === BranchType.CONFIRMATION)
                          .map((branch: Branch) => (
                            <option value={branch.id}>{branch.name}</option>
                          ))}
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>
                      Emails
                      <Tooltip hasArrow label={emailHelpMessage} bg="#d4d4d4" placement="right">
                        <InfoIcon marginLeft="3.5px" marginBottom="2.5px" />
                      </Tooltip>
                    </FormLabel>
                    <Input value={emails} onChange={handleEmailInput} />
                  </FormControl>
                </>
              )}
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
