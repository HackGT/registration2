import { LoadingScreen, ErrorScreen, apiUrl, Service, Footer } from "@hex-labs/core";
import useAxios from "axios-hooks";
import React from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import Navigation from "./Navigation";
import { CurrentHexathonProvider } from "../../contexts/CurrentHexathonContext";
import HelpScoutBeacon from "./HelpScoutBeacon";

const AppOutline: React.FC = () => {
  const [{ data: hexathons, loading, error }] = useAxios(apiUrl(Service.HEXATHONS, "/hexathons"));
  const { hexathonId } = useParams();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const currentHexathon = hexathons.find((hexathon: any) => hexathon.id === hexathonId);

  return (
    <CurrentHexathonProvider hexathons={hexathons}>
      <Navigation />
      {!currentHexathon && location.pathname !== "/" ? <Navigate to="/" /> : <Outlet />}
      <HelpScoutBeacon />
      <Box backgroundColor="white">
        <Footer />
      </Box>
    </CurrentHexathonProvider>
  );
};

export default AppOutline;
