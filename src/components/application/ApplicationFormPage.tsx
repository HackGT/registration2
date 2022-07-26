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
  lastPage: boolean;
  hasPrevPage: boolean;
  prevPage: () => void;
  nextPage: () => void;
  submitApplication: () => void;
}

const ApplicationFormPage: React.FC<Props> = props => {
  const [formData, setFormData] = useState(props.defaultFormData);
  const toast = useToast();
  const [isDesktop] = useMediaQuery("(min-width: 600px)");

  const handleSaveData = async () => {
    try {
      const combinedFormData = { ...formData };

      // Add special handling for files
      for (const [key, value] of Object.entries(formData)) {
        if (value instanceof File) {
          const multipartFormData = new FormData();
          multipartFormData.append("type", key);
          multipartFormData.append("file", value, value.name);
          // eslint-disable-next-line no-await-in-loop
          const response = await axios.post(
            "https://files.api.hexlabs.org/files/upload",
            multipartFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          combinedFormData[key] = response.data.id;
        }
      }

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
    } catch (error: any) {
      console.log(error.message);
      toast({
        title: "Error",
        description: "Application data was unable to be saved. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePreviousClicked = async () => {
    await handleSaveData();
    props.prevPage();
  };

  const handleNextClicked = async () => {
    await handleSaveData();
    props.nextPage();
  };

  return (
    <Box marginX="10px">
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
          <Button colorScheme="purple" onClick={handleSaveData}>
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
