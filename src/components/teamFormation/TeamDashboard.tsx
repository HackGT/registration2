import React, { useEffect, useMemo, useState } from "react";
import { Box, Flex, Heading, Text, Divider, Link } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service, useAuth } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";

import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";
import CreateTeam from "./CreateTeam";
import OnTeam from "./OnTeam";

const TeamDashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentHexathon } = useCurrentHexathon();
  const { hexathonId } = useParams();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const updateDimensions = () => {
    setScreenWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const [{ data: applications, loading: applicationsLoading, error: applicationsError }] = useAxios(
    {
      url: apiUrl(Service.REGISTRATION, "/applications"),
      method: "GET",
      params: {
        hexathon: hexathonId,
        userId: user?.uid,
      },
    },
    { useCache: false }
  );

  const [{ data: teams, loading: teamLoading, error: teamError }] = useAxios(
    {
      url: apiUrl(Service.USERS, `/teams/user/${user?.uid}`),
      method: "GET",
      params: {
        hexathon: hexathonId,
      },
    },
    { useCache: false }
  );

  if (teamLoading || applicationsLoading) {
    return <LoadingScreen />;
  }

  if (applicationsError) return <ErrorScreen error={applicationsError} />;
  if (teamError) return <ErrorScreen error={teamError} />;

  const team = teams[0];

  return (
    <Box>
      <Box paddingX={{ base: "16px", md: "32px" }} paddingY="15px">
        <Flex
          direction={["column", "row"]}
          justifyContent="center"
          alignItems="center"
          gap="20px"
          marginBottom="5px"
        >
          <Heading size="lg" lineHeight="inherit">
            Team Formation Portal
          </Heading>
        </Flex>
        <Text textAlign="center">
          Welcome to the team formation portal for {currentHexathon.name}. Here you can create teams
          and add members. If someone else has made a team, have them add you by the email you
          applied with.
        </Text>
        {team && <OnTeam hexathonId={hexathonId} team={team} />}
        {!team && <CreateTeam hexathonId={hexathonId} />}
      </Box>
    </Box>
  );
};

export default TeamDashboard;
