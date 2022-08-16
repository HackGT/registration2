import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { ErrorScreen, LoadingScreen } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { Navigate, useParams } from "react-router-dom";

import ApplicationFormPage from "./ApplicationFormPage";
import ApplicationSubmittedPage from "./ApplicationSubmittedPage";
import ApplicationReviewPage from "./ApplicationReviewPage";
import { apiUrl, Service } from "../../util/apiUrl";

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
  const [branch, setBranch] = useState<any>(undefined);

  useEffect(() => {
    if (application?.confirmationBranch && application.status === "ACCEPTED") {
      setBranch(application.confirmationBranch);
    } else if (application?.applicationBranch) {
      setBranch(application.applicationBranch);
    }
  }, [application]);

  if (loading || !branch) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  if (application.status === "CONFIRMED") {
    return <Navigate to={`/${hexathonId}`} />;
  }

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
    if (formPageNumber < branch.formPages.length) {
      window.scrollTo(0, 0);
      setFormPageNumber(formPageNumber + 1);
    }
  };

  const defaultFormData = getFrontendFormattedFormData(application);

  return (
    <Box maxWidth="700px" marginX="auto" marginTop="15px">
      {formPageNumber < branch.formPages.length ? (
        <ApplicationFormPage
          defaultFormData={defaultFormData}
          branch={branch}
          formPageNumber={formPageNumber}
          applicationId={applicationId}
          hasPrevPage={formPageNumber > 0}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      ) : (
        <ApplicationReviewPage
          defaultFormData={defaultFormData}
          branch={branch}
          applicationId={applicationId}
          hasPrevPage={formPageNumber > 0}
          prevPage={prevPage}
          refetch={refetch}
        />
      )}
    </Box>
  );
};

export default ApplicationContainer;
