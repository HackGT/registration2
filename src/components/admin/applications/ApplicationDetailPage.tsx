import React, { useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  Stack,
  Link,
  Tag,
  TagLabel,
  TagRightIcon,
  useToast,
  Button,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Checkbox,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import { ErrorScreen, LoadingScreen, apiUrl, Service, handleAxiosError } from "@hex-labs/core";
import axios from "axios";
import useAxios from "axios-hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CopyIcon, QuestionIcon } from "@chakra-ui/icons";
import { QRCodeSVG } from "qrcode.react";

import ApplicationStatusTag, { applicationStatusOptions } from "../../../util/ApplicationStatusTag";
import { dateToServerFormat, parseDateTimeForm } from "../../../util/util";
import { Branch, BranchType } from "../branchSettings/BranchSettingsPage";
import RetrieveGTIDModal from "./RetrieveGTIDModal";

const ApplicationDetailPage: React.FC = () => {
  const { applicationId } = useParams();
  const [{ data, loading, error }] = useAxios(
    apiUrl(Service.REGISTRATION, `/applications/${applicationId}`)
  );
  const [{ data: branches, loading: branchesLoading }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/branches"),
    params: {
      hexathon: data?.hexathon,
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const extendedDeadlines = watch("extendedDeadlines.enabled");
  const status = watch("status");
  const navigate = useNavigate();

  const addHttpsIfNeed = (url: string) => {
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      return `https://${url}`;
    }

    return url;
  };

  useEffect(() => {
    reset();
  }, [data, reset]);

  useEffect(() => {
    if (!["CONFIRMED", "ACCEPTED", "NOT_ATTENDING"].includes(status)) {
      setValue("confirmationBranch", null);
    } else {
      setValue("confirmationBranch", data.confirmationBranch ? data.confirmationBranch.id : "");
    }
  }, [status]);

  if (loading || branchesLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const onSubmit = async (values: any) => {
    try {
      await axios.post(
        apiUrl(Service.REGISTRATION, `/applications/${applicationId}/actions/update-application`),
        {
          applicationBranch: values.applicationBranch || null,
          confirmationBranch: values.confirmationBranch || null,
          status: values.status,
          applicationExtendedDeadline: values.extendedDeadlines.enabled
            ? dateToServerFormat(values.applicationDeadline) || null
            : null,
          confirmationExtendedDeadline: values.extendedDeadlines.enabled
            ? dateToServerFormat(values.confirmationDeadline) || null
            : null,
        }
      );

      toast({
        title: "Success",
        description: "Applicant settings saved successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: any) {
      handleAxiosError(e);
    }
  };

  const handleDeleteApp = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Are you sure you want to delete ${data.name} (${data.email})'s application?`)) {
      try {
        await axios.delete(apiUrl(Service.REGISTRATION, `/applications/${applicationId}`));
        toast({
          title: "Success",
          description: "Application deleted successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate(`/${data.hexathon}/admin/applications`);
          window.location.reload();
        }, 1000);
      } catch (e: any) {
        handleAxiosError(e);
      }
    }
  };

  return (
    <Box paddingX={{ base: "10px", sm: "30px" }} paddingTop="20px">
      <VStack spacing="1px" align="left" paddingBottom="10px">
        <Stack flexDirection={{ base: "column", sm: "row" }} gap="1.5">
          <ApplicationStatusTag status={data.status} includeColor alignSelf="start" />
          <Tag alignSelf="start" margin="0 !important">
            <TagLabel>{`ID: ${data.id}`}</TagLabel>
            <TagRightIcon
              as={CopyIcon}
              cursor="pointer"
              onClick={() => {
                navigator.clipboard.writeText(data.id);
                if (!toast.isActive("application-id-copy")) {
                  toast({
                    id: "application-id-copy",
                    description: "Application ID copied to clipboard",
                    duration: 3000,
                    position: "top",
                  });
                }
              }}
              _hover={{
                color: "purple",
              }}
            />
          </Tag>
        </Stack>
        <Stack justifyContent="space-between" flexDirection={{ base: "column", md: "row" }}>
          <Box>
            <Heading as="h1" size="xl" fontWeight={700} flex={8}>
              {data.name}
            </Heading>
          </Box>
          <Box>
            <Flex gap="4px" flexDirection={{ base: "column", md: "row" }}>
              <Button onClick={onOpen} size="sm" colorScheme="blue" alignSelf="start">
                Edit Applicant Settings
              </Button>
              <Popover>
                <PopoverTrigger>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    disabled={!(data.status === "CONFIRMED" || data.status === "CHECKED_IN")}
                  >
                    View Participant QR Code
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody display="flex" justifyContent="center">
                    <QRCodeSVG
                      value={JSON.stringify({
                        uid: data?.userId,
                      })}
                      style={{ alignSelf: "center" }}
                    />
                  </PopoverBody>
                  <PopoverFooter>
                    <Text fontSize="12px">
                      Use this QR code to scan & check-in users when needed in an emergency.
                    </Text>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
              <Button colorScheme="red" size="sm" onClick={handleDeleteApp}>
                Delete
              </Button>
            </Flex>
          </Box>
        </Stack>
        <Heading as="h2" size="s" fontWeight={500} color="gray">
          Application Branch: {data.applicationBranch.name}
        </Heading>
        {data.confirmationBranch && (
          <Heading as="h2" size="s" fontWeight={500} color="gray">
            Confirmation Branch: {data.confirmationBranch.name}
          </Heading>
        )}
      </VStack>
      <Accordion defaultIndex={[0, 1, 2, 3, 4]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text style={{ fontWeight: "bold" }}>Personal Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={0}>
            <Stack>
              <Text>
                <Text color="gray" fontSize="sm">
                  Email
                </Text>
                {data.email}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Phone Number
                </Text>
                {data.applicationData.phoneNumber}
              </Text>
              {(data.applicationData.email || data.applicationData.schoolEmail) && (
                <Text>
                  <Text color="gray" fontSize="sm">
                    Email
                  </Text>
                  {data.applicationData.email || data.applicationData.schoolEmail}
                </Text>
              )}
              {data.applicationData.school === "Georgia Institute of Technology" && (
                <Text>
                  <Text color="gray" fontSize="sm">
                    GTID
                  </Text>
                  <RetrieveGTIDModal data={data} />
                </Text>
              )}
              <Text>
                <Text color="gray" fontSize="sm">
                  Is 18 years old?
                </Text>
                {data.applicationData.adult ? "Yes" : "No"}
              </Text>
              {data.applicationData.linkedin && (
                <Text>
                  <Text color="gray" fontSize="sm">
                    LinkedIn
                  </Text>
                  <Link href={addHttpsIfNeed(data.applicationData.linkedin)} target="_blank">
                    {data.applicationData.linkedin}
                  </Link>
                </Text>
              )}
              {data.applicationData.website && (
                <Text>
                  <Text color="gray" fontSize="sm">
                    Website
                  </Text>
                  <Link href={addHttpsIfNeed(data.applicationData.website)} target="_blank">
                    {data.applicationData.website}
                  </Link>
                </Text>
              )}
            </Stack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text style={{ fontWeight: "bold" }}>Application Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Stack>
              {Object.keys(data.applicationData).map(key => {
                let output = <></>;
                let formattedKey: string | undefined = key;
                if (key != null) {
                  formattedKey = key
                    .match(/([A-Z]?[^A-Z]*)/g)
                    ?.slice(0, -1)
                    .join(" ");
                  formattedKey = formattedKey!.charAt(0).toUpperCase() + formattedKey!.slice(1);
                }
                if (
                  ![
                    "schoolEmail",
                    "gender",
                    "ethnicity",
                    "phoneNumber",
                    "confirmChecks",
                    "essays",
                    "resume",
                    "website",
                    "adult",
                    "linkedin",
                    "customData",
                  ].includes(key)
                ) {
                  if (data.applicationData[key] != null && data.applicationData[key].length > 0) {
                    output = (
                      <Text>
                        <Text color="gray" fontSize="sm">
                          {formattedKey}
                        </Text>
                        {typeof data.applicationData[key] !== "object"
                          ? data.applicationData[key]
                          : data.applicationData[key].map((e: any, index: any) => {
                              let output = "";
                              if (index == data.applicationData[key].length - 1) {
                                output = String(e);
                              } else {
                                output = String(e).concat(", ");
                              }
                              return output;
                            })}
                      </Text>
                    );
                  } else if (data.applicationData[key] != null) {
                    output = (
                      <Text>
                        <Text color="gray" fontSize="sm">
                          {formattedKey}
                        </Text>
                        <Tag colorScheme="red">None</Tag>
                      </Text>
                    );
                  }
                }
                return output;
              })}
              {data.applicationData.customData &&
                Object.keys(data.applicationData.customData).map(key => {
                  let output = <></>;
                  let formattedKey: string | undefined = key;
                  if (key != null) {
                    formattedKey = key
                      .match(/([A-Z]?[^A-Z]*)/g)
                      ?.slice(0, -1)
                      .join(" ");
                    formattedKey = formattedKey!.charAt(0).toUpperCase() + formattedKey!.slice(1);
                  }

                  if (
                    data.applicationData.customData[key] != null &&
                    data.applicationData.customData[key].length > 0
                  ) {
                    output = (
                      <Text>
                        <Text color="gray" fontSize="sm">
                          {formattedKey}
                        </Text>
                        {typeof data.applicationData.customData[key] !== "object"
                          ? data.applicationData.customData[key]
                          : data.applicationData.customData[key].map((e: any, index: any) => {
                              let output = "";
                              if (index == data.applicationData.customData[key].length - 1) {
                                output = String(e);
                              } else {
                                output = String(e).concat(", ");
                              }
                              return output;
                            })}
                      </Text>
                    );
                  } else if (data.applicationData.customData[key] != null) {
                    <Text>
                      <Text color="gray" fontSize="sm">
                        {formattedKey}
                      </Text>
                      <Tag colorScheme="red">None</Tag>
                    </Text>;
                  }
                  return output;
                })}
            </Stack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text style={{ fontWeight: "bold" }}>Diversity Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Stack>
              <Text>
                <Text color="gray" fontSize="sm">
                  Identifies as
                </Text>
                {data.applicationData.gender}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Ethnicity
                </Text>
                {data.applicationData.ethnicity}
              </Text>
            </Stack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text style={{ fontWeight: "bold" }}>Application Questions</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Stack>
              {data.applicationData.essays.map((essay: any) => (
                <Text key={essay.id}>
                  <Text color="gray" fontSize="sm">
                    {essay.criteria}
                  </Text>
                  {essay.answer}
                </Text>
              ))}
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Edit Applicant Details</Heading>
            <ModalCloseButton />
          </ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <ModalBody>
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    id="status"
                    {...register("status", {
                      required: "Please enter a status",
                    })}
                    defaultValue={data.status}
                  >
                    {applicationStatusOptions.map((statusOption: any) => (
                      <option value={statusOption.value}>{statusOption.label}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Application Branch</FormLabel>
                  <Select
                    id="applicationBranch"
                    {...register("applicationBranch", {
                      required: "Please enter an application branch",
                    })}
                    defaultValue={data.applicationBranch.id}
                  >
                    <option value="">None</option>
                    {branches
                      .filter((branch: Branch) => branch.type === BranchType.APPLICATION)
                      .map((branch: any) => (
                        <option value={branch.id}>{branch.name}</option>
                      ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Confirmation Branch</FormLabel>
                  <Select
                    id="confirmationBranch"
                    {...register("confirmationBranch")}
                    defaultValue={data.confirmationBranch ? data.confirmationBranch.id : ""}
                  >
                    <option value="">None</option>
                    {branches
                      .filter((branch: Branch) => branch.type === BranchType.CONFIRMATION)
                      .map((branch: any) => (
                        <option value={branch.id}>{branch.name}</option>
                      ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <Checkbox
                    {...register("extendedDeadlines.enabled")}
                    value={data.applicationExtendedDeadline !== null || extendedDeadlines}
                  >
                    Enable Extended Deadlines?
                    <Tooltip
                      label="If selected, this user will have custom deadlines for their application that override the branch deadlines. This allows you to give certain users more time to apply or confirm their attendance. For example, use this if someone emails and is having trouble submitting right before a deadline."
                      placement="auto-start"
                      hasArrow
                    >
                      <QuestionIcon ml="1" mb="1" />
                    </Tooltip>
                  </Checkbox>
                </FormControl>
                {extendedDeadlines && (
                  <FormControl>
                    <FormLabel>Application Extended Deadline</FormLabel>
                    <Input
                      id="applicationDeadline"
                      type="datetime-local"
                      {...register("applicationDeadline")}
                      defaultValue={parseDateTimeForm(data.applicationExtendedDeadline) || ""}
                    />
                  </FormControl>
                )}
                {["CONFIRMED", "ACCEPTED", "NOT_ATTENDING"].includes(status) &&
                  extendedDeadlines && (
                    <FormControl>
                      <FormLabel>Application Confirmation Deadline</FormLabel>
                      <Input
                        id="confirmationDeadline"
                        type="datetime-local"
                        {...register("confirmationDeadline")}
                        defaultValue={parseDateTimeForm(data.confirmationExtendedDeadline) || ""}
                      />
                    </FormControl>
                  )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" isLoading={isSubmitting}>
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ApplicationDetailPage;
