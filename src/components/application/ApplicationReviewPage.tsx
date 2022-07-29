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

import CommonForm from "../commonForm/CommonForm";
import { AxiosRefetch } from "../../types/helper";

interface Props {
  defaultFormData: any;
  branch: any;
  applicationId?: string;
  prevPage: () => void;
  refetch: AxiosRefetch;
}

const ApplicationReviewPage: React.FC<Props> = props => {
  const toast = useToast();
  const [isDesktop] = useMediaQuery("(min-width: 600px)");

  const handleSubmit = async () => {
    try {
      await axios.post(
        `https://registration.api.hexlabs.org/applications/${props.applicationId}/actions/submit-application`
      );
      props.refetch();
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

  const handlePreviousClicked = async () => {
    props.prevPage();
  };

  return (
    <Box marginX="15px">
      <Heading mb="10px">Review Your Submission</Heading>
      <Alert status="warning" mb="10px">
        <AlertIcon />
        Please review your application data before submission. After you submit, you will not be
        able to change any information.
      </Alert>
      {props.branch.formPages.map((formPage: any) => (
        <CommonForm
          schema={formPage.jsonSchema}
          uiSchema={formPage.uiSchema}
          commonDefinitionsSchema={props.branch.commonDefinitionsSchema}
          formData={props.defaultFormData}
          key={formPage._id}
          disabled
          readonly
        >
          <div />
        </CommonForm>
      ))}
      <HStack justify="space-evenly">
        <Button colorScheme="purple" onClick={handlePreviousClicked} variant="outline">
          <ArrowBackIcon />
          {isDesktop && <Text marginLeft="2">Back</Text>}
        </Button>
        <Button colorScheme="purple" onClick={handleSubmit}>
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
