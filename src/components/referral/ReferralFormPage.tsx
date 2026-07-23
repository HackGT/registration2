import React from "react";
import { Box, Button, HStack, Text, useMediaQuery, useToast } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";

import CommonForm from "../commonForm/CommonForm";
import { AxiosRefetch } from "../../util/types";

export interface ReferralFormData {
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  resume: Record<string, any>;
  referForEarlyApplication: boolean;
  referForReimbursement: boolean;
  essay: string;
}

interface Props {
  defaultFormData: ReferralFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReferralFormData>>;
  referralId?: string;
  hexathonId?: string;
  commonDefinitionsSchema: string;
  hasPrevPage: boolean;
  prevPage: () => void;
  nextPage: () => void;
  refetchReferral: AxiosRefetch;
}

export const referralSchema = JSON.stringify({
  title: "Referral Form",
  type: "object",
  required: [
    "firstName",
    "lastName",
    "email",
    "school",
    "resume",
    "referForEarlyApplication",
    "referForReimbursement",
    "essay",
  ],
  properties: {
    firstName: {
      type: "string",
      title: "First Name",
    },
    lastName: {
      type: "string",
      title: "Last Name",
    },
    email: {
      type: "string",
      title: "Email",
      format: "email",
    },
    school: {
      type: "string",
      title: "University",
      default: "",
      $ref: "#/definitions/university",
    },
    resume: {
      type: "object",
      title: "Resume",
      required: ["name"],
      properties: {
        name: {
          type: "string",
          title: "File Name",
        },
      },
    },
    referForEarlyApplication: {
      type: "boolean",
      title: "Refer For Early Application",
    },
    referForReimbursement: {
      type: "boolean",
      title: "Refer For Travel Reimbursement",
    },
    essay: {
      type: "string",
      title: "Why Would They Make a Good Candidate?",
      minLength: 10,
    },
  },
});

export const referralUiSchema = JSON.stringify({
  resume: {
    "ui:field": "file",
  },
  referForEarlyApplication: {
    "ui:widget": "checkbox",
  },
  referForReimbursement: {
    "ui:widget": "checkbox",  
  },
  essay: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 8,
    },
  },
});

const ReferralFormPage: React.FC<Props> = props => {
  const [isDesktop] = useMediaQuery("(min-width: 600px)");
  const toast = useToast();
  const [saveDataLoading, setSaveDataLoading] = React.useState(false);

  const handleSaveData = async () => {
    try {
      setSaveDataLoading(true);
      const response = await axios.post(
        apiUrl(Service.REGISTRATION, `/referrals/${props.referralId}/actions/save-referral-data`),
        {
          referralData: props.defaultFormData,
        }
      );
      props.setFormData(response.data.referralData as ReferralFormData);
      toast({
        title: "Success",
        description: "Referral data successfully saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error: any) {
      handleAxiosError(error);
      toast({
        title: "Error",
        description: "Referral data was unable to be saved. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setSaveDataLoading(false);
    }
  };

  const handlePreviousClicked = async () => {
    if (await handleSaveData()) {
      props.prevPage();
    }
  };

  const handleNextClicked = async () => {
    if (await handleSaveData()) {
      await props.refetchReferral();
      props.nextPage();
    }
  };

  return (
    <Box marginX="15px">
      <CommonForm
        schema={referralSchema}
        uiSchema={referralUiSchema}
        commonDefinitionsSchema={props.commonDefinitionsSchema}
        formData={props.defaultFormData}
        hexathonId={props.hexathonId}
        onChange={({ formData }) => {
          props.setFormData(formData as ReferralFormData);
        }}
        onSubmit={() => {
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

export default ReferralFormPage;
