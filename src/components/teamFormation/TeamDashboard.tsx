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

  if (teamLoading) {
    return <LoadingScreen />;
  }
  if (teamError) return <ErrorScreen error={teamError} />;

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
        {teams.team && (
          <OnTeam hexathonId={hexathonId} team={teams.team} members={teams.profiles} />
        )}
        {!teams.team && <CreateTeam hexathonId={hexathonId} />}
      </Box>
    </Box>
  );
};

export default TeamDashboard;
