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
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { QuestionIcon } from "@chakra-ui/icons";

import { Branch, BranchType } from "./BranchSettingsPage";
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
  const branchType = watch("type");
  const secret = watch("secret");
  const gradingEnabled = watch("grading.enabled");
  const automaticConfirmationEnabled = watch("automaticConfirmation.enabled");

  const type = useMemo(
    () => (props.defaultValues ? FormModalType.Edit : FormModalType.Create),
    [props.defaultValues]
  );

  useEffect(() => {
    setEmails(
      props.defaultValues?.automaticConfirmation?.emails
        ? props.defaultValues?.automaticConfirmation?.emails.join(", ")
        : ""
    );
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
    <Modal
      onClose={props.onClose}
      isOpen={props.isOpen}
      isCentered
      scrollBehavior="inside"
      size="lg"
    >
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
                <FormLabel>
                  Open Time
                  <Tooltip
                    label="The application form will not be available to users until this time."
                    placement="auto-start"
                    hasArrow
                  >
                    <QuestionIcon ml="1" mb="1" />
                  </Tooltip>
                </FormLabel>
                <Input {...register("settings.open")} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>
                  Close Time
                  <Tooltip
                    label="After this time, new submissions will not be allowed unless an applicant has an individual extended deadline."
                    placement="auto-start"
                    hasArrow
                  >
                    <QuestionIcon ml="1" mb="1" />
                  </Tooltip>
                </FormLabel>
                <Input {...register("settings.close")} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>
                  Description
                  <Tooltip
                    label="The short description that will be displayed on the application dashboard page."
                    placement="auto-start"
                    hasArrow
                  >
                    <QuestionIcon ml="1" mb="1" />
                  </Tooltip>
                </FormLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Add information about who should apply for this branch..."
                />
              </FormControl>
              {branchType === "APPLICATION" && (
                <FormControl>
                  <Checkbox {...register("secret")}>
                    Secret
                    <Tooltip
                      label="If selected, this branch will be hidden from the application dashboard. The only way to start this application is through either the QR code or copy link below. This feature is intended for uses like sponsor/staff applications that shouldn't be public."
                      placement="auto-start"
                      hasArrow
                    >
                      <QuestionIcon ml="1" mb="1" />
                    </Tooltip>
                  </Checkbox>
                </FormControl>
              )}
              {branchType === "APPLICATION" && secret && props.defaultValues && (
                <HStack display="flex" justifyContent="center">
                  <Popover>
                    <PopoverTrigger>
                      <Button>View QR Code</Button>
                    </PopoverTrigger>
                    <PopoverContent borderWidth="3px" borderColor="darkgray">
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader display="flex" justifyContent="center">
                        QR Code
                      </PopoverHeader>
                      <PopoverBody display="flex" justifyContent="center">
                        <QRCodeSVG
                          value={`${window.location.origin}/${hexathonId}/start-application/${props.defaultValues.id}`}
                          size={200}
                        />
                      </PopoverBody>
                      <PopoverFooter>
                        <Text fontSize="sm">
                          Ask users to scan this code to be directed to the application page for
                          this branch.
                        </Text>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/${hexathonId}/start-application/${props.defaultValues.id}`
                      );
                      toast({
                        description: "Application link copied",
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
                    <Tooltip
                      label="If selected, applicants will automatically be confirmed when they submit if their email matches below. This should be used for sponsor/staff branches based on sponsor domains/admin domains to reduce manual confirmation need."
                      placement="auto-start"
                      hasArrow
                    >
                      <QuestionIcon ml="1" mb="1" />
                    </Tooltip>
                  </Checkbox>
                </FormControl>
              )}
              {branchType === "APPLICATION" && automaticConfirmationEnabled && (
                <>
                  <FormControl isRequired>
                    <FormLabel>
                      Confirmation Branch
                      <Tooltip
                        label="The confirmation branch to place the user on. Every confirmed user must be on a confirmation branch."
                        placement="auto-start"
                        hasArrow
                      >
                        <QuestionIcon ml="1" mb="1" />
                      </Tooltip>
                    </FormLabel>
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
                      <Tooltip
                        label="Separate each email by a comma. Enter '*' to autoconfirm all emails and use an email domain to confirm all emails with that domain (ex. @hexlabs.org)."
                        placement="auto-start"
                        hasArrow
                      >
                        <QuestionIcon ml="1" mb="1" />
                      </Tooltip>
                    </FormLabel>
                    <Input value={emails} onChange={handleEmailInput} />
                  </FormControl>
                </>
              )}
              {branchType === "APPLICATION" && (
                <FormControl>
                  <Checkbox {...register("grading.enabled")}>
                    Enable Grading?
                    <Tooltip
                      label="If selected, this branch will be enabled for grading by HexLabs members. Manual configuration for each hexathon still needs to be added in code for grading to work properly. Only used for participant branches."
                      placement="auto-start"
                      hasArrow
                    >
                      <QuestionIcon ml="1" mb="1" />
                    </Tooltip>
                  </Checkbox>
                </FormControl>
              )}
              {branchType === "APPLICATION" && gradingEnabled && (
                <FormControl isRequired>
                  <FormLabel>
                    Grading Group
                    <Tooltip
                      label="Specify which group this branch belongs to for grading."
                      placement="auto-start"
                      hasArrow
                    >
                      <QuestionIcon ml="1" mb="1" />
                    </Tooltip>
                  </FormLabel>
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
