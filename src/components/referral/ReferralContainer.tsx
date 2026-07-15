import React, { useEffect, useState } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { Navigate, useParams } from "react-router-dom";
import {
  apiUrl,
  ErrorScreen,
  LoadingScreen,
  Service,
} from "@hex-labs/core";
import useAxios from "axios-hooks";

import ReferralFormPage, { ReferralFormData } from "./ReferralFormPage";
import ReferralReviewPage from "./ReferralReviewPage";
import ReferralSubmittedPage from "./ReferralSubmittedPage";

const defaultReferralFormData: ReferralFormData = {
  firstName: "",
  lastName: "",
  email: "",
  school: "",
  resume: {},
  referForEarlyApplication: false,
  referForReimbursement: false,
  essay: "",
};

const ReferralContainer: React.FC = () => {
  const { hexathonId, referralId } = useParams();
  const [stepNumber, setStepNumber] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestedReferral, setRequestedReferral] = useState(false);
  const [formData, setFormData] = useState<ReferralFormData>(defaultReferralFormData);
  const [isEditing, setIsEditing] = useState<boolean | null>(null);

  const [{ data: branches, loading: branchLoading, error: branchError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/branches"),
    params: {
      hexathon: hexathonId,
    },
  });
  const [
    { data: referral, loading: referralLoading, error: referralError },
    refetchReferral,
  ] = useAxios(
    {
      method: "GET",
      url: apiUrl(Service.REGISTRATION, `/referrals/${referralId}`),
    },
    { useCache: false, manual: true }
  );

  useEffect(() => {
    if (!referralId) return;
    setRequestedReferral(true);
    refetchReferral();
  }, [referralId, refetchReferral]);

  useEffect(() => {
    if (!referral) return;

    setIsEditing(current => (current === null ? referral.status === "SUBMITTED" : current));

    if (referral.referralData) {
      setFormData({
        ...defaultReferralFormData,
        ...referral.referralData,
        resume: referral.referralData.resume || {},
      });
    }
  }, [referral]);

  if (!referralId) {
    return <Navigate to={`/${hexathonId}`} replace />;
  }

  if (branchError) return <ErrorScreen error={branchError} />;
  if (referralError) return <ErrorScreen error={referralError} />;
  if (branchLoading || referralLoading || !requestedReferral || isEditing === null) {
    return <LoadingScreen />;
  }

  if (!referral) {
    return <Navigate to={`/${hexathonId}`} replace />;
  }

  const applicationBranch = branches?.find((branch: any) => branch.type === "APPLICATION");
  const commonDefinitionsSchema = applicationBranch?.commonDefinitionsSchema || "{}";

  const stepTitles = ["Referral Form", "Review Submission"];
  const activeStep = Math.min(stepNumber, stepTitles.length - 1);
  const progressWidth = `${80 / stepTitles.length}%`;

  const prevPage = () => {
    if (stepNumber > 0) {
      window.scrollTo(0, 0);
      setStepNumber(stepNumber - 1);
    }
  };

  const nextPage = () => {
    window.scrollTo(0, 0);
    setStepNumber(stepNumber + 1);
  };

  const handleSubmitReferral = async () => {
    await refetchReferral();
    setIsSubmitted(true);
    nextPage();
  };

  if (stepNumber >= stepTitles.length) {
    return isEditing ? (
      <Navigate to={`/${hexathonId}`} replace />
    ) : (
      <ReferralSubmittedPage />
    );
  }

  return (
    <Flex flexDir="column" width="100%">
      <Flex alignItems="center" justifyContent="center" width="100%" my="20px">
        {stepTitles.map((title, index) => (
          <Flex
            key={title}
            flexDir="column"
            justifyContent="start"
            width={progressWidth}
            marginX="1%"
          >
            <Box
              sx={{
                bg: `${index <= activeStep ? "purple.500" : "purple.100"}`,
                h: "8px",
                rounded: "md",
              }}
            />
            <Text>{title}</Text>
          </Flex>
        ))}
      </Flex>
      <Box maxWidth="700px" marginX="auto" marginTop="15px" width="100%">
        {stepNumber === 0 ? (
          <ReferralFormPage
            defaultFormData={formData}
            setFormData={setFormData}
            referralId={referralId}
            hexathonId={hexathonId}
            commonDefinitionsSchema={commonDefinitionsSchema}
            hasPrevPage={false}
            prevPage={prevPage}
            nextPage={nextPage}
            refetchReferral={refetchReferral}
          />
        ) : (
          <ReferralReviewPage
            formData={formData}
            commonDefinitionsSchema={commonDefinitionsSchema}
            hexathonId={hexathonId}
            referralId={referralId}
            hasPrevPage
            prevPage={prevPage}
            onSubmit={handleSubmitReferral}
            isSubmitted={isSubmitted}
            isEditing={isEditing}
          />
        )}
      </Box>
    </Flex>
  );
};

export default ReferralContainer;
