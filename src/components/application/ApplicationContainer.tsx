import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { ErrorScreen, Loading } from "@hex-labs/core";
import axios from "axios";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";

import ApplicationFormPage from "./ApplicationFormPage";
import ApplicationSubmittedPage from "./ApplicationSubmittedPage";

const Application = () => {
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

  const defaultFormData = data.applicationData;

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

  return (
    <Box maxWidth="700px" margin="auto">
      {formPageNumber < branch.formPages.length ? (
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
      ) : (
        <ApplicationSubmittedPage />
      )}
    </Box>
  );
};

export default Application;
