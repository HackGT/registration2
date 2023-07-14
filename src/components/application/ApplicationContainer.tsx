import React, { useEffect, useState } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { Navigate, useParams } from "react-router-dom";

import ApplicationFormPage from "./ApplicationFormPage";
import ApplicationSubmittedPage from "./ApplicationSubmittedPage";
import ApplicationReviewPage from "./ApplicationReviewPage";
import { Branch } from "../admin/branchSettings/BranchSettings";

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
  const { hexathonId, applicationId } = useParams();
  const [formPageNumber, setFormPageNumber] = useState(0);

  const [{ data: application, loading, error }, refetch] = useAxios(
    apiUrl(Service.REGISTRATION, `/applications/${applicationId}`),
    { useCache: false }
  );
  const [branch, setBranch] = useState<Branch>();

  useEffect(() => {
    if (application?.confirmationBranch && application.status === "ACCEPTED") {
      setBranch(application.confirmationBranch);
    } else if (application?.applicationBranch) {
      setBranch(application.applicationBranch);
    }
  }, [application]);

  if (loading || !branch) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const setPage = async (pageNumber: number) => {
      window.scrollTo(0, 0);
      setFormPageNumber(pageNumber);
  };

  const prevPage = async () => {
    if (formPageNumber > 0) {
      window.scrollTo(0, 0);
      setFormPageNumber(formPageNumber - 1);
    }
  };

  const nextPage = async () => {
    // If last page, refetch data before review page
    if (formPageNumber === branch.formPages.length - 1) {
      await refetch();
    }
    if (formPageNumber <= branch.formPages.length) {
      window.scrollTo(0, 0);
      setFormPageNumber(formPageNumber + 1);
    }
  };

  const defaultFormData = getFrontendFormattedFormData(application);

  if (application.status === "NOT_ATTENDING" || application.status === "CONFIRMED") {
    return <Navigate to={`/${hexathonId}`} />;
  }

  if (formPageNumber <= branch.formPages.length) {
    const flexWidth = `${60 / branch.formPages.length}%`;
    return (
      <Flex flexDir="column" width="100%">
        <Flex alignItems="center" justifyContent="center" width="100%" my="20px">
          {branch.formPages.map((title, index) => (
            <Flex flexDir="column" justifyContent="start" width={flexWidth} marginX="1%">
              <Box sx={{bg: `${(index <= formPageNumber) ? "purple.500" : "purple.100"}`, h: "8px", rounded: "md"}} />
              <Text>{JSON.parse(branch.formPages[index].jsonSchema).title}</Text>
            </Flex>
          ))}
          <Flex flexDir="column" justifyContent="start" width={flexWidth} marginX="1%">
            <Box sx={{bg: `${(formPageNumber === branch.formPages.length) ? "purple.500" : "purple.100"}`, h: "8px", rounded: "md"}} />
            <Text>Review Submission</Text>
          </Flex>
        </Flex>
        {formPageNumber < branch.formPages.length ?
          <Box maxWidth="700px" marginX="auto" marginTop="15px">
            <ApplicationFormPage
              defaultFormData={defaultFormData}
              branch={branch}
              formPageNumber={formPageNumber}
              applicationId={applicationId}
              hasPrevPage={formPageNumber > 0}
              prevPage={prevPage}
              nextPage={nextPage}
            />
          </Box> : 
          <Box maxWidth="700px" marginX="auto" marginTop="15px">
            <ApplicationReviewPage
              defaultFormData={defaultFormData}
              branch={branch}
              applicationId={applicationId}
              hasPrevPage={formPageNumber > 0}
              prevPage={prevPage}
              nextPage={nextPage}
              setPage={setPage}
              refetch={refetch}
            />
          </Box>
        }
      </Flex>
    );
  }
  return <ApplicationSubmittedPage />;
};

export default ApplicationContainer;
