import React from "react";
import {
  Box,
  Button,
  HStack,
  useMediaQuery,
  useToast,
  Text,
  Heading,
  AlertIcon,
  Alert,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

import CommonForm from "../commonForm/CommonForm";
import { AxiosRefetch } from "../../util/types";
import { ApplicationFormStatus } from "../dashboard/CurrentApplicationTile";

interface Props {
  defaultFormData: any;
  branch: any;
  applicationId?: string;
  formStatus: ApplicationFormStatus;
  hasPrevPage: boolean;
  prevPage: () => void;
  nextPage: () => void;
  setPage: (pageNumber: number) => void;
  refetch: AxiosRefetch;
}

const ApplicationReviewPage: React.FC<Props> = props => {
  const toast = useToast();
  const [isDesktop] = useMediaQuery("(min-width: 600px)");

  const handleSubmit = async () => {
    try {
      await axios.post(
        apiUrl(
          Service.REGISTRATION,
          `/applications/${props.applicationId}/actions/submit-application`
        ),
        {
          branchType: props.branch.type,
        }
      );
      props.refetch();
      props.nextPage();
    } catch (error: any) {
      console.log(error.message);
      toast({
        title: "Error",
        description: "Application was unable to be submitted. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async () => {
    toast({
      title: "Success",
      description: "Application has been successfully edited.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    props.refetch();
    props.nextPage();
  };

  const handlePreviousClicked = async () => {
    props.prevPage();
  };

  return (
    <Box marginX="15px">
      <Heading mb="10px">Review Your Submission</Heading>
      {props.branch.type === "APPLICATION" && (
        <Alert status="info" mb="10px">
          <AlertIcon />
          Please review your application before you submit. Don't worry, you'll still be able to
          edit your submission until the deadline.
        </Alert>
      )}
      {props.branch.type === "CONFIRMATION" && (
        <Alert status="info" mb="10px">
          <AlertIcon />
          Please review your confirmation before you submit. You will not be confirmed until you
          submit below.
        </Alert>
      )}
      {props.branch.formPages.map((formPage: any, index: number) => (
        <CommonForm
          schema={formPage.jsonSchema}
          uiSchema={formPage.uiSchema}
          commonDefinitionsSchema={props.branch.commonDefinitionsSchema}
          formData={props.defaultFormData}
          hexathonId={props.branch.hexathon}
          key={formPage.id}
          disabled
          readonly
        >
          <Button onClick={() => props.setPage(index)} marginBottom="30px">
            Edit Response
          </Button>
        </CommonForm>
      ))}
      <HStack justify="space-evenly">
        <Button
          colorScheme="purple"
          onClick={handlePreviousClicked}
          variant="outline"
          visibility={props.hasPrevPage ? "inherit" : "hidden"}
        >
          <ArrowBackIcon />
          {isDesktop && <Text marginLeft="2">Back</Text>}
        </Button>
        <Button
          colorScheme="purple"
          onClick={props.formStatus === ApplicationFormStatus.CONTINUE ? handleSubmit : handleEdit}
        >
          Submit!
        </Button>
        <Button colorScheme="purple" variant="outline" visibility="hidden">
          {isDesktop && <Text marginRight="2">Next</Text>}
          <ArrowForwardIcon />
        </Button>
      </HStack>
    </Box>
  );
};

export default ApplicationReviewPage;
