import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import axios from "axios";

import CommonForm from "../commonForm/CommonForm";

interface FormPage {
  title: string;
  jsonSchema: string;
  uiSchema: string;
}

interface Props {
  defaultFormData: any;
  formPage: FormPage;
  formPageNumber: number;
  applicationId?: string;
  lastPage: boolean;
  hasPrevPage: boolean;
  prevPage: () => void;
  nextPage: () => void;
  submitApplication: () => void;
}

const ApplicationFormPage: React.FC<Props> = props => {
  console.log(props.defaultFormData);
  const [formData, setFormData] = useState(props.defaultFormData);

  const handleSaveData = async () => {
    try {
      console.log(formData);
      const response = await axios.post(
        `https://registration.api.hexlabs.org/applications/${props.applicationId}/actions/save-application-data`,
        {
          applicationData: formData,
          branchFormPage: props.formPageNumber,
        }
      );
      setFormData(response.data.applicationData);
    } catch (error) {
      console.log(error);
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
    <CommonForm
      schema={JSON.parse(props.formPage.jsonSchema)}
      uiSchema={JSON.parse(props.formPage.uiSchema)}
      formData={formData}
      onChange={({ formData: updatedFormData }, e) => {
        setFormData(updatedFormData);
      }}
      onSubmit={({ formData: submittedFormData }, e) => {
        console.log(submittedFormData);
        handleNextClicked();
      }}
    >
      <Button
        colorScheme="purple"
        onClick={handlePreviousClicked}
        width="100%"
        disabled={!props.hasPrevPage}
      >
        Previous
      </Button>
      <Button colorScheme="purple" onClick={handleSaveData} width="100%">
        Save
      </Button>
      <Button colorScheme="purple" type="submit" width="100%">
        Next
      </Button>
    </CommonForm>
  );
};

export default ApplicationFormPage;
