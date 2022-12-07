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
} from "@chakra-ui/react";
import { ErrorScreen, LoadingScreen, apiUrl, Service, handleAxiosError } from "@hex-labs/core";
import axios from "axios";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CopyIcon } from "@chakra-ui/icons";
import { QRCodeSVG } from "qrcode.react";
import { DateTime } from "luxon";

import ApplicationStatusTag, { applicationStatusOptions } from "../../../util/ApplicationStatusTag";
import { parseDateString } from "../../../util/util";
import { Branch, BranchType } from "../branchSettings/BranchSettings";
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
            ? values.applicationDeadline || null
            : null,
          confirmationExtendedDeadline: values.extendedDeadlines.enabled
            ? values.confirmationDeadline || null
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
                    alignSelf="start"
                    disabled={data.status !== "CONFIRMED"}
                  >
                    View Check-In QR Code
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
                <Text style={{ fontWeight: "bold" }}>Contact Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={3}>
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
              <Text>
                <Text color="gray" fontSize="sm">
                  School Email
                </Text>
                {data.applicationData.schoolEmail}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  GTID
                </Text>
                {data.applicationData.school === "Georgia Institute of Technology" ? (
                  <RetrieveGTIDModal data={data} />
                ) : (
                  <Text>N/A</Text>
                )}
              </Text>
            </Stack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text style={{ fontWeight: "bold" }}>General Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Stack>
              <Text>
                <Text color="gray" fontSize="sm">
                  University
                </Text>
                {data.applicationData.school}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Level of Study
                </Text>
                {data.applicationData.levelOfStudy === ""
                  ? data.applicationData.levelOfStudy
                  : "N/A"}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  School Year
                </Text>
                {data.applicationData.schoolYear}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Major
                </Text>
                {data.applicationData.major}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Is 18 years old?
                </Text>
                {data.applicationData.adult ? "Yes" : "No"}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Date of Birth
                </Text>
                {data.applicationData.dateOfBirth
                  ? DateTime.fromISO(data.applicationData.dateOfBirth).toLocaleString()
                  : "N/A"}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Address
                </Text>
                {data.applicationData.address.line1
                  ? `${data.applicationData.address.line1}  ${data.applicationData.address.city}, ${data.applicationData.address.state} ${data.applicationData.address.zip}, ${data.applicationData.address.country}`
                  : "N/A"}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Country of Residence
                </Text>
                {data.applicationData.countryOfResidence !== ""
                  ? data.applicationData.countryOfResidence
                  : "N/A"}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Dietary Restrictions
                </Text>
                {data.applicationData.dietaryRestrictions
                  ? data.applicationData.dietaryRestrictions.join(", ")
                  : "None"}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Allergies
                </Text>
                {data.applicationData.allergies || "None"}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  T-Shirt Size
                </Text>
                {data.applicationData.shirtSize}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Found us through
                </Text>
                {data.applicationData.marketing}
              </Text>
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
                <Text style={{ fontWeight: "bold" }}>Personal Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Stack>
              <Text>
                <Text color="gray" fontSize="sm">
                  Resume
                </Text>
                {data.applicationData.resume?.id ? (
                  <Link
                    href={apiUrl(Service.FILES, `/files/${data.applicationData.resume?.id}/view`)}
                    target="_blank"
                    color="teal.500"
                  >
                    Click to View
                  </Link>
                ) : (
                  <Text>No Resume Uploaded</Text>
                )}
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  LinkedIn
                </Text>
                <Link href={data.applicationData.linkedin} target="_blank">
                  {data.applicationData.linkedin}
                </Link>
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Personal Website/GitHub
                </Text>
                <Link href={data.applicationData.website} target="_blank">
                  {data.applicationData.website}
                </Link>
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Travel Assistance
                </Text>
                <Text>
                  {data.applicationData.travelAssistance === ""
                    ? data.applicationData.travelAssistance
                    : "N/A"}
                </Text>
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Past Experience
                </Text>
                <Text>
                  {data.applicationData.pastExperience === ""
                    ? data.applicationData.pastExperience
                    : "N/A"}
                </Text>
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Skills
                </Text>
                <Text>
                  {data.applicationData.skills ? "N/A" : data.applicationData.skills.join(", ")}
                </Text>
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Number of Hackathons
                </Text>
                <Text>
                  {data.applicationData.travelAssistance === ""
                    ? data.applicationData.travelAssistance
                    : "N/A"}
                </Text>
              </Text>
              <Text>
                <Text color="gray" fontSize="sm">
                  Extra Info
                </Text>
                <Text>{data.applicationData.extraInfo}</Text>
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
                  </Checkbox>
                </FormControl>
                {extendedDeadlines && (
                  <FormControl>
                    <FormLabel>Application Extended Deadline</FormLabel>
                    <Input
                      id="applicationDeadline"
                      {...register("applicationDeadline")}
                      placeholder="mm/dd/yyyy, hh:mm"
                      defaultValue={parseDateString(data.applicationExtendedDeadline) || ""}
                    />
                  </FormControl>
                )}
                {["CONFIRMED", "ACCEPTED", "NOT_ATTENDING"].includes(status) &&
                  extendedDeadlines && (
                    <FormControl>
                      <FormLabel>Application Confirmation Deadline</FormLabel>
                      <Input
                        id="confirmationDeadline"
                        {...register("confirmationDeadline")}
                        placeholder="mm/dd/yyyy, hh:mm"
                        defaultValue={parseDateString(data.confirmationExtendedDeadline) || ""}
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
