import { LoadingScreen, ErrorScreen } from "@hex-labs/core";
import useAxios from "axios-hooks";
import React from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

import { CurrentHexathonProvider } from "../contexts/CurrentHexathonContext";
import { apiUrl, Service } from "./apiUrl";

const CheckValidHexathon: React.FC = () => {
  const [{ data: hexathons, loading, error }] = useAxios(apiUrl(Service.HEXATHONS, "/hexathons"));
  const { hexathonId } = useParams();

  if (loading) return <LoadingScreen />;

  if (error) return <ErrorScreen error={error} />;

  const currentHexathon = hexathons.find((hexathon: any) => hexathon.id === hexathonId);

  if (!currentHexathon) {
    return <Navigate to="/" />;
  }
  return (
    <CurrentHexathonProvider hexathons={hexathons}>
      <Outlet />
    </CurrentHexathonProvider>
  );
};

export default CheckValidHexathon;
