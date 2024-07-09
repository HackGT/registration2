import React, { useState } from "react";
import { Box, Button, HStack, useMediaQuery, useToast, Text } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";
import { useParams } from "react-router-dom";

import CommonForm from "../commonForm/CommonForm";
import { getFrontendFormattedFormData } from "./ApplicationContainer";

interface Props {
  defaultFormData: any;
  branch: any;
  formPageNumber: number;
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
  const {hexathonId} = useParams();

  const handleSaveData = async (validateData: boolean) => {
    try {
      setSaveDataLoading(true);
      const combinedFormData = { ...formData };

      const response = await axios.post(
        apiUrl(
          Service.REGISTRATION,
          `/applications/${props.applicationId}/actions/save-application-data`
        ),
        {
          applicationData: combinedFormData,
          branchType: props.branch.type,
          branchFormPage: props.formPageNumber,
          validateData,
        }
      );
      setFormData(getFrontendFormattedFormData(response.data));
      // console.log(props.branch.hexathon) gets the hexathonId for the branch
      console.log(hexathonId)
      toast({
        title: "Success",
        description: "Application data successfully saved.",
        status: "success",
        duration: 3000,
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
        duration: 3000,
        isClosable: true,
      });
      setSaveDataLoading(false);
      return false;
    }
  };

  const handlePreviousClicked = async () => {
    if (await handleSaveData(false)) {
      props.prevPage();
    }
  };

  const handleNextClicked = async () => {
    if (await handleSaveData(true)) {
      props.nextPage();
    }
  };

  const formPage = props.branch.formPages[props.formPageNumber];

  return (
    <Box marginX="15px">
      <CommonForm
        schema={formPage.jsonSchema}
        uiSchema={formPage.uiSchema}
        commonDefinitionsSchema={props.branch.commonDefinitionsSchema}
        formData={formData}
        hexathonId={props.branch.hexathon}
        onChange={({ formData: updatedFormData }, e) => {
          setFormData(updatedFormData);
        }}
        onSubmit={({ formData: submittedFormData }, e) => {
          // console.log(submittedFormData);
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
          <Button
            colorScheme="purple"
            onClick={() => handleSaveData(false)}
            isLoading={saveDataLoading}
          >
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
