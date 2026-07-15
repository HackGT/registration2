import React from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  HStack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";

import CommonForm from "../commonForm/CommonForm";
import { ReferralFormData, referralSchema, referralUiSchema } from "./ReferralFormPage";

interface Props {
  formData: ReferralFormData;
  commonDefinitionsSchema: string;
  hexathonId?: string;
  referralId?: string;
  hasPrevPage: boolean;
  prevPage: () => void;
  onSubmit: () => Promise<void>;
  isSubmitted: boolean;
  isEditing: boolean;
}

const ReferralReviewPage: React.FC<Props> = props => {
  const [isDesktop] = useMediaQuery("(min-width: 600px)");
  const [submitLoading, setSubmitLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      await axios.post(
        apiUrl(Service.REGISTRATION, `/referrals/${props.referralId}/actions/submit-referral`)
      );
      await props.onSubmit();
    } catch (error: any) {
      handleAxiosError(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setSubmitLoading(true);
      await props.onSubmit();
    } catch (error: any) {
      handleAxiosError(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box marginX="15px">
      <Heading mb="10px">Review Your Referral</Heading>
      <Alert status="info" mb="10px">
        <AlertIcon />
        {props.isEditing
          ? "Please review your changes before saving."
          : "Please review your referral before you submit. You can edit or delete it later from your dashboard."}
      </Alert>
      <CommonForm
        schema={referralSchema}
        uiSchema={referralUiSchema}
        commonDefinitionsSchema={props.commonDefinitionsSchema}
        formData={props.formData}
        hexathonId={props.hexathonId}
        disabled
        readonly
      >
        <Button onClick={props.prevPage} marginBottom="30px">
          Edit Response
        </Button>
      </CommonForm>
      <HStack justify="space-evenly">
        <Button
          colorScheme="purple"
          onClick={props.prevPage}
          variant="outline"
          visibility={props.hasPrevPage ? "inherit" : "hidden"}
        >
          <ArrowBackIcon />
          {isDesktop && <Text marginLeft="2">Back</Text>}
        </Button>
        <Button
          colorScheme="purple"
          onClick={props.isEditing ? handleEdit : handleSubmit}
          isLoading={submitLoading || props.isSubmitted}
        >
          {props.isEditing ? "Save Changes" : "Submit"}
        </Button>
        <Button colorScheme="purple" variant="outline" visibility="hidden">
          {isDesktop && <Text marginRight="2">Next</Text>}
          <ArrowForwardIcon />
        </Button>
      </HStack>
    </Box>
  );
};

export default ReferralReviewPage;
