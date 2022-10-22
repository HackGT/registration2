import React from "react";
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
  HStack,
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
} from "@chakra-ui/react";
import { ErrorScreen, LoadingScreen, apiUrl, Service } from "@hex-labs/core";
import axios from "axios";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CopyIcon } from "@chakra-ui/icons";

import ApplicationStatusTag, { applicationStatusOptions } from "../../../util/ApplicationStatusTag";
import { QRCodeSVG } from "qrcode.react";

const ApplicationDetailPage: React.FC = () => {
  const { applicationId } = useParams();
  const [{ data, loading, error }] = useAxios(
    apiUrl(Service.REGISTRATION, `/applications/${applicationId}`)
  );
  const [{ data: branches }] = useAxios({
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
  } = useForm();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const onSubmit = async (values: any) => {
    try {
      console.log(values.applicationBranch);

      await axios.post(
        apiUrl(Service.REGISTRATION, `/${applicationId}/actions/update-application`),
        {
          applicationBranch: values.applicationBranch,
          confirmationBranch: values.confirmationBranch,
          status: values.status,
          applicationExtendedDeadline: values.applicationExtendedDeadline,
          confirmationExtendedDeadline: values.confirmationExtendedDeadline
            ? values.confirmationExtendedDeadline
            : "",
        }
      );

      toast({
        title: "Success",
        description: "Applicant settings saved successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box paddingX="30px" paddingTop="20px">
      <VStack spacing="6px" align="left" paddingBottom="10px">
        <HStack>
          <ApplicationStatusTag status={data.status} includeColor />
          <Tag>
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
        </HStack>
        <Flex>
          <Heading as="h1" size="xl" fontWeight={700} flex={8}>
            {data.name}
          </Heading>
          <Button
            onClick={onOpen}
            size="sm"
            colorScheme="messenger"
            flex={1}
            minWidth="-moz-initial"
          >
            Applicant Settings
          </Button>
        </Flex>
        <QRCodeSVG
          value={JSON.stringify({
            uid: data?.userId,
          })}
          style={{ alignSelf: "center" }}
        />
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
              <FormControl>
                <FormLabel>Application Branch</FormLabel>
                <Select
                  id="applicationBranch"
                  {...register("applicationBranch", {
                    required: "Please enter an application branch",
                  })}
                  defaultValue={data.applicationBranch.id}
                >
                  {branches.map(
                    (branch: any) =>
                      !branch.name.includes("Confirmation") &&
                      !branch.name.includes("Accepted") && (
                        <option value={branch.id}>{branch.name}</option>
                      )
                  )}
                  <option value={undefined}>None</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Confirmation Branch</FormLabel>
                <Select
                  id="confirmationBranch"
                  {...register("confirmationBranch", {
                    required: "Please enter an confirmation branch",
                  })}
                  defaultValue={data.confirmationBranch ? data.confirmationBranch.id : "None"}
                >
                  {branches.map(
                    (branch: any) =>
                      (branch.name.includes("Confirmation") ||
                        branch.name.includes("Accepted")) && (
                        <option value={branch.id}>{branch.name}</option>
                      )
                  )}
                  <option value={undefined}>None</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  id="status"
                  {...register("status", {
                    required: "Please enter a status",
                  })}
                  defaultValue={data.status}
                >
                  {applicationStatusOptions.map((status: any) => (
                    <option value={status.value}>{status.label}</option>
                  ))}
                  <option value={undefined}>None</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Application Extended Deadline</FormLabel>
                <Input
                  id="applicationDeadline"
                  {...register("applicationDeadline", {
                    required: "Please enter an application deadline",
                  })}
                  placeholder="mm/dd/yyyy"
                  type="date"
                  defaultValue={
                    data.applicationExtendedDeadline
                      ? new Date(data.applicationExtendedDeadline).toISOString().split("T")[0]
                      : new Date(data.applicationBranch.settings.close).toISOString().split("T")[0]
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Application Confirmation Deadline</FormLabel>
                <Input
                  id="confirmationDeadline"
                  {...register("confirmationDeadline")}
                  placeholder="mm/dd/yyyy"
                  type="date"
                  defaultValue={
                    data.confirmationBranch && data.confirmationExtendedDeadline
                      ? new Date(data.confirmationExtendedDeadline).toISOString().split("T")[0]
                      : ""
                  }
                />
              </FormControl>
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
