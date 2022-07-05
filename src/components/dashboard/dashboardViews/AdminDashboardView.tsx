import React from "react";
import { Box, Flex, Stack, Heading, Text } from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";

import { useAuth } from "../../../contexts/AuthContext";
import Widget from "../Widget";

interface Props {
  profile: any;
}

const AdminDashboard: React.FC<Props> = (props: any) => {
  const { user } = useAuth();

  return (
    <Flex flexDir="column" padding={{ base: "0 0 8px 0", md: "32px 48px" }} margin="auto" maxWidth="1000px">
      <Flex
        flexDir={{ base: "column", md: "row" }}
        bgGradient={{ base: "linear(to-b, #33c2ff, #7b69ec)", md: "linear(to-r, #33c2ff, #7b69ec)" }}
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
        alignItems="center"
        justifyContent="space-around"
        marginBottom={{ base: "8px", md: "20px" }}
      >
        <Box
          color="white"
          paddingY={{ base: "32px", md: "32px" }}
          paddingLeft={{ base: "16px", md: "64px" }}
          paddingRight={{ base: "16px", md: "0" }}
        >
          <Heading size="2xl" marginBottom="15px">Welcome Back {props.profile.name?.first}!</Heading>
          <Text fontSize="lg">
            We're happy to see that you're an{" "}
            <Text as="span" color="#4569e9">
              attending staff member
            </Text>
            . Make sure to scan the QR here while you're checking in!
          </Text>
        </Box>
        <Box
          border="8px"
          borderStyle="solid"
          borderColor="white"
          borderRadius="3xl"
          padding="10px"
          bgColor="#ffffff"
          marginY={{ md: "20px" }}
          marginBottom={{ base: "40px" }}
          marginX={{ base: "auto", md: "64px" }}
        >
          <QRCodeSVG
            value={JSON.stringify({
              uid: user?.uid,
              name: {
                first: props.profile.name?.first,
                last: props.profile.name?.last,
              },
              email: user?.email,
            })}
            bgColor="#ffffff"
            size={140}
          />
        </Box>
      </Flex>
      <Stack spacing={4} marginX={{base: 4, md: 0}}>
        <Widget title="Autoranker" description="example description" />
        <Widget title="Statistics" description="example description" />
        <Widget title="Applicants" description="example description" />
        <Widget title="Emailing" description="example description" />
        <Widget title="Internal Settings" description="example description" />
      </Stack>
    </Flex>
  );
}

export default AdminDashboard;