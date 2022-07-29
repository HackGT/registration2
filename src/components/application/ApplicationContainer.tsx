import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { ErrorScreen, LoadingScreen } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";

import ApplicationFormPage from "./ApplicationFormPage";
import ApplicationSubmittedPage from "./ApplicationSubmittedPage";
import ApplicationReviewPage from "./ApplicationReviewPage";

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

  const [{ data, loading, error }, refetch] = useAxios(
    `https://registration.api.hexlabs.org/applications/${applicationId}`,
    { useCache: false }
  );
  const [branch, setBranch] = useState<any>(undefined);

  useEffect(() => {
    if (data?.applicationBranch) {
      setBranch(data.applicationBranch);
    }
  }, [data]);

  if (loading || !branch) return <LoadingScreen />;

  if (error) return <ErrorScreen error={error} />;

  if (data.status === "APPLIED") {
    return <ApplicationSubmittedPage />;
  }

  const prevPage = async () => {
    if (formPageNumber > 0) {
      setFormPageNumber(formPageNumber - 1);
    }
  };

  const nextPage = async () => {
    // If last page, refetch data before review page
    if (formPageNumber === branch.formPages.length - 1) {
      await refetch();
    }
    if (formPageNumber < branch.formPages.length) {
      setFormPageNumber(formPageNumber + 1);
    }
  };

  const defaultFormData = getFrontendFormattedFormData(data);

  return (
    <Box maxWidth="700px" marginX="auto" marginTop="15px">
      {formPageNumber < branch.formPages.length ? (
        <ApplicationFormPage
          defaultFormData={defaultFormData}
          formPage={branch.formPages[formPageNumber]}
          formPageNumber={formPageNumber}
          commonDefinitionsSchema={branch.commonDefinitionsSchema}
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
          prevPage={prevPage}
          refetch={refetch}
        />
      )}
    </Box>
  );
};

export default ApplicationContainer;
