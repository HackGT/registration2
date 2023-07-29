import React from "react";
import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service, useAuth } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";

import CreateTeamSection from "./CreateTeamSection";
import OnTeamSection from "./OnTeamSection";

const TeamDashboard: React.FC = () => {
  const { user } = useAuth();
  const { hexathonId } = useParams();

  const [{ data: team, loading, error }] = useAxios(
    {
      url: apiUrl(Service.USERS, `/teams/user/${user?.uid}`),
      method: "GET",
      params: {
        hexathon: hexathonId,
      },
    },
    { useCache: false }
  );

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) return <ErrorScreen error={error} />;

  return (
    <Box paddingX={{ base: "16px", md: "32px" }} paddingY="15px">
      <Flex
        direction={["column", "row"]}
        justifyContent="center"
        alignItems="center"
        gap="20px"
        marginBottom="5px"
      >
        <Heading size="lg" lineHeight="inherit">
          Team Management Portal
        </Heading>
      </Flex>
      <Text textAlign="center">
        Welcome! Here, you can create teams and add members. If someone else has made a team, have
        them add you by the email you applied with. Teams can have up to 4 members.
        <br />
        <br />
        If you don't have a team yet, we'll have a team formation tool you can use to meet new
        people soon!
      </Text>
      <Center>
        <Box
          width={{ base: "90vw", md: "70vw" }}
          marginTop="40px"
          borderRadius="2px"
          boxShadow={{
            base: "rgba(0, 0, 0, 0.15) 0px 0px 6px 1px",
          }}
          paddingBottom="30px"
        >
          <Center flexDir="column">
            {Object.keys(team).length > 0 ? <OnTeamSection team={team} /> : <CreateTeamSection />}
          </Center>
        </Box>
      </Center>
    </Box>
  );
};

export default TeamDashboard;
