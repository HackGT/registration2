import React from "react";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { useNavigate, useParams } from "react-router-dom";

const StartApplication = () => {
  const { hexathonId, branchId } = useParams();

  const navigate = useNavigate();

  const [{ data: response, loading, error }] = useAxios({
    method: "POST",
    url: apiUrl(Service.REGISTRATION, "/applications/actions/choose-application-branch"),
    data: {
      hexathon: hexathonId,
      applicationBranch: branchId,
    },
  });

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  navigate(`/${hexathonId}/application/${response.data.id}`);

  return null;
};

export default StartApplication;
