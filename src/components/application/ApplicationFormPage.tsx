import React, { useState } from "react";
import { Box, Button, HStack, useMediaQuery, useToast, Text } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import axios from "axios";

import CommonForm from "../commonForm/CommonForm";
import { getFrontendFormattedFormData } from "./ApplicationContainer";

interface FormPage {
  title: string;
  jsonSchema: string;
  uiSchema: string;
}

interface Props {
  defaultFormData: any;
  formPage: FormPage;
  formPageNumber: number;
  commonDefinitionsSchema: string;
  applicationId?: string;
  hasPrevPage: boolean;
  prevPage: () => void;
  nextPage: () => void;
}

const ApplicationFormPage: React.FC<Props> = props => {
  const [formData, setFormData] = useState(props.defaultFormData);
  const toast = useToast();
  const [isDesktop] = useMediaQuery("(min-width: 600px)");
  const [saveDataLoading, setSaveDataLoading] = useState(false);

  const handleSaveData = async () => {
    try {
      setSaveDataLoading(true);
      const combinedFormData = { ...formData };

      const response = await axios.post(
        `https://registration.api.hexlabs.org/applications/${props.applicationId}/actions/save-application-data`,
        {
          applicationData: combinedFormData,
          branchFormPage: props.formPageNumber,
        }
      );
      setFormData(getFrontendFormattedFormData(response.data));
      toast({
        title: "Success",
        description: "Application data successfully saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setSaveDataLoading(false);
      return true;
    } catch (error: any) {
      console.log(error.message);
      toast({
        title: "Error",
        description: "Application data was unable to be saved. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setSaveDataLoading(false);
      return false;
    }
  };

  const handlePreviousClicked = async () => {
    if (await handleSaveData()) {
      props.prevPage();
    }
  };

  const handleNextClicked = async () => {
    if (await handleSaveData()) {
      props.nextPage();
    }
  };

  return (
    <Box marginX="15px">
      <CommonForm
        schema={props.formPage.jsonSchema}
        uiSchema={props.formPage.uiSchema}
        commonDefinitionsSchema={props.commonDefinitionsSchema}
        formData={formData}
        onChange={({ formData: updatedFormData }, e) => {
          setFormData(updatedFormData);
        }}
        onSubmit={({ formData: submittedFormData }, e) => {
          console.log(submittedFormData);
          handleNextClicked();
        }}
      >
        <HStack justify="space-evenly">
          <Button
            colorScheme="purple"
            onClick={handlePreviousClicked}
            disabled={!props.hasPrevPage}
            variant="outline"
          >
            <ArrowBackIcon />
            {isDesktop && <Text marginLeft="2">Back</Text>}
          </Button>
          <Button colorScheme="purple" onClick={handleSaveData} isLoading={saveDataLoading}>
            Save
          </Button>
          <Button colorScheme="purple" type="submit" variant="outline">
            {isDesktop && <Text marginRight="2">Next</Text>}
            <ArrowForwardIcon />
          </Button>
        </HStack>
      </CommonForm>
    </Box>
  );
};

export default ApplicationFormPage;
