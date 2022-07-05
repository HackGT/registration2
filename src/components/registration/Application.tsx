import React, { useEffect, useState } from "react";
import { ChakraProvider, Flex, Spinner, theme } from "@chakra-ui/react";
import axios from "axios";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";

import { AuthProvider } from "../../contexts/AuthContext";
import ApplicationFormPage from "../formPlayground/ApplicationFormPage";
import SubmittedPage from "../formPlayground/SubmittedPage";

const Application = () => {
  const { applicationId } = useParams();
  const [formPageNumber, setFormPageNumber] = useState(0);

  const [{ data, loading, error }, refetch] = useAxios(
    `https://registration.api.hexlabs.org/applications/${applicationId}`
  );
  const [branch, setBranch] = useState<any>(undefined);

  useEffect(() => {
    if (data?.applicationBranch) {
      setBranch(data.applicationBranch);
    }
  }, [data]);

  if (loading || !branch) {
    return <Spinner />;
  }

  if (error) {
    return <Spinner />;
  }

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
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Flex align="center" justify="center" direction="column" fontFamily="verdana">
          {formPageNumber < branch.formPages.length ? (
            <ApplicationFormPage
              defaultFormData={defaultFormData}
              formPage={branch.formPages[formPageNumber]}
              formPageNumber={formPageNumber}
              applicationId={applicationId}
              lastPage={formPageNumber === branch.formPages.length - 1}
              submitApplication={submitApplication}
              hasPrevPage={formPageNumber > 0}
              prevPage={prevPage}
              nextPage={nextPage}
            />
          ) : (
            <SubmittedPage />
          )}
        </Flex>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default Application;
