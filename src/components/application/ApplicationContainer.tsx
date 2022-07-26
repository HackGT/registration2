import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { ErrorScreen, Loading } from "@hex-labs/core";
import axios from "axios";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";

import ApplicationFormPage from "./ApplicationFormPage";
import ApplicationSubmittedPage from "./ApplicationSubmittedPage";

/** Manually modify essays to fit frontend data display */
export const getFrontendFormattedFormData = (data: any) => {
  const defaultFormDataEssays: any = {};
  data.applicationData.essays.forEach((essay: any) => {
    defaultFormDataEssays[essay.criteria] = essay.answer;
  });

  return {
    ...data.applicationData,
    essays: defaultFormDataEssays,
  };
};

const ApplicationContainer = () => {
  const { applicationId } = useParams();
  const [formPageNumber, setFormPageNumber] = useState(0);

  const [{ data, loading, error }] = useAxios(
    `https://registration.api.hexlabs.org/applications/${applicationId}`
  );
  const [branch, setBranch] = useState<any>(undefined);

  useEffect(() => {
    if (data?.applicationBranch) {
      setBranch(data.applicationBranch);
    }
  }, [data]);

  if (loading || !branch) return <Loading />;

  if (error) return <ErrorScreen error={error} />;

  const submitApplication = async () => {
    const response = await axios.post(
      `https://registration.api.hexlabs.org/applications/${applicationId}/actions/submit-application`
    );
    setFormPageNumber(branch.formPages.length);
  };

  const prevPage = () => {
    if (formPageNumber > 0) {
      setFormPageNumber(formPageNumber - 1);
    }
  };

  const nextPage = () => {
    if (formPageNumber < branch.formPages.length) {
      setFormPageNumber(formPageNumber + 1);
    }
  };

  const defaultFormData = getFrontendFormattedFormData(data);

  return (
    <Box>
      {formPageNumber < branch.formPages.length ? (
        <Box maxWidth="700px" margin="auto">
          <ApplicationFormPage
            defaultFormData={defaultFormData}
            formPage={branch.formPages[formPageNumber]}
            formPageNumber={formPageNumber}
            commonDefinitionsSchema={branch.commonDefinitionsSchema}
            applicationId={applicationId}
            lastPage={formPageNumber === branch.formPages.length - 1}
            submitApplication={submitApplication}
            hasPrevPage={formPageNumber > 0}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        </Box>
      ) : (
        <ApplicationSubmittedPage />
      )}
    </Box>
  );
};

export default ApplicationContainer;
