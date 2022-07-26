import React from "react";
import { Box, Flex, Stack, Heading, Text, Button, HStack, Divider } from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import Timeline from "./Timeline";
import Loading from "../../util/Loading";
import Branches from "./Branches";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";

interface Props {
  hexathons: any[];
}

const Dashboard: React.FC<Props> = props => {
  const { user } = useAuth();
  const { currentHexathon } = useCurrentHexathon();
  const { hexathonId } = useParams();

  const [{ data: profile, loading: profileLoading, error: profileError }] = useAxios(
    `https://users.api.hexlabs.org/users/${user?.uid}`
  );
  const [{ data: application, loading: applicationLoading, error: applicationError }] = useAxios({
    url: "https://registration.api.hexlabs.org/applications/",
    method: "GET",
    params: {
      hexathon: hexathonId,
      userId: user?.uid,
    },
  });

  if (profileLoading || profileError || applicationLoading || applicationError) {
    return <Loading />;
  }

  return (
    <Flex
      flexDir="column"
      padding={{ base: "0 0 16px", md: "32px 48px" }}
      margin="auto"
      maxWidth="1200px"
    >
      <Flex
        flexDir={{ base: "column", md: "row" }}
        bgGradient={{
          base: "linear(to-b, #33c2ff, #7b69ec)",
          md: "linear(to-r, #33c2ff, #7b69ec)",
        }}
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
        alignItems="center"
        justifyContent="space-around"
      >
        <Box
          color="white"
          paddingY="32px"
          paddingLeft={{ base: "16px", md: "32px" }}
          paddingRight={{ base: "16px", md: (application.status === "CONFIRMED") ? "0px" : "32px" }}
        >
          <Heading size="xl" marginBottom="15px">
            Welcome Back {profile.name?.first}!
          </Heading>
          <Text>
            We're happy to see you here! We're currently running our {currentHexathon.name} and we'd
            love to see you there!
          </Text>
          <HStack
            maxWidth={{ base: "500px", md: "400px" }}
            justifyContent="space-around"
            marginTop={{ base: 4, md: 8 }}
            spacing={4}
          >
            <Button width="45%" color="#7B69EC" borderWidth="1px" borderColor="#7B69EC">
              Apply
            </Button>
            <Button width="45%" bgColor="#7B69EC">
              Details
            </Button>
          </HStack>
        </Box>
        {application.status === "CONFIRMED" ? (
          <Box
            border="8px"
            borderStyle="solid"
            borderColor="white"
            borderRadius="3xl"
            padding="10px"
            bgColor="#b4c0fa"
            marginY={{ md: "20px" }}
            marginBottom={{ base: "40px" }}
            marginX={{ base: "auto", md: "64px" }}
          >
            <QRCodeSVG
              value={JSON.stringify({
                uid: user?.uid,
                name: {
                  first: profile.name?.first,
                  last: profile.name?.last,
                },
                email: user?.email,
              })}
              bgColor="#b4c0fa"
              size={140}
            />
          </Box>
        ) : null}
      </Flex>
      <Stack margin={{ base: "20px", md: 0 }} marginBottom={{ base: 0, md: "15px" }}>
        <Box margin="35px 25px 15px 25px">
          <Heading fontSize="36px" fontWeight="semibold" marginBottom="10px">
            Current Application
          </Heading>
          <Text>Finish your application for {currentHexathon.name} below.</Text>
        </Box>
        <Branches currentApplication />
      </Stack>
      <Stack margin={{ base: "20px", md: 0 }} marginBottom={{ base: 0, md: "15px" }}>
        <Box margin="35px 25px 15px 25px">
          <Heading fontSize="36px" fontWeight="semibold" marginBottom="10px">
            Application Paths
          </Heading>
          <Text>Select one of the tracks from below to apply to {currentHexathon.name}.</Text>
        </Box>
        <Branches currentApplication={false} />
      </Stack>
      <Divider marginY={{ base: "30px", md: "40px" }} alignSelf="center" width="95%" />
      <Stack marginX={{ base: "20px", md: 0 }}>
        <Heading fontSize="36px" fontWeight="semibold" marginBottom="10px" alignSelf="center">
          Future Events
        </Heading>
        <Text>
          If you can't make it to {currentHexathon.name}, don't worry! We have more events planned
          for the next year, so be on the look out :). Follow us on social media to stay in the
          loop!
        </Text>
        <Box paddingX="30px">
          <Timeline hexathons={props.hexathons} />
        </Box>
      </Stack>
    </Flex>
  );
};

export default Dashboard;
