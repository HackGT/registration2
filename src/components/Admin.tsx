import React, { useState } from "react";
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";

const Widget = ({ title }: { title: string }) => (
  <Box boxShadow="lg" padding="24px 32px">
    <Heading fontWeight={500} marginBottom="10px" size="lg" color="#212121">
      {title}
    </Heading>
    <Text color="#858585" fontSize="sm" fontWeight={400}>
      Short Description of Title
    </Text>
  </Box>
);

const Admin = () => (
  <Flex flexDir="column" padding={{ base: "0", md: "48px 72px" }} gap="20px">
    <Flex
      flexDir={{ base: "column", md: "row" }}
      bgGradient={{ base: "linear(to-b, #33c2ff, #7b69ec)", md: "linear(to-r, #33c2ff, #7b69ec)" }}
      boxShadow="lg"
      alignItems="center"
      justifyContent="space-around"
    >
      <Box
        color="white"
        paddingY={{ base: "32px", md: "64px" }}
        paddingLeft={{ base: "16px", md: "64px" }}
        paddingRight={{ base: "16px", md: "0" }}
      >
        <Heading size="3xl">Welcome Back Noah!</Heading>
        <Text fontSize="lg">
          We're happy to see that you're an{" "}
          <Text as="span" color="#4569e9">
            attending staff member.
          </Text>{" "}
          Make sure to scan the QR here while you're checking in!
        </Text>
      </Box>
      <Box
        border="8px"
        borderStyle="solid"
        borderColor="white"
        borderRadius="3xl"
        padding="10px"
        bgColor="#b4c0fa"
        marginY={{ md: "40px" }}
        marginBottom={{ base: "40px" }}
        marginX={{ base: "auto", md: "64px" }}
      >
        <QRCodeSVG
          value={JSON.stringify({
            uid: "test",
            name: {
              first: "First",
              last: "Last",
            },
            email: "test@hexlabs.org",
          })}
          size={200}
          bgColor="#b4c0fa"
        />
      </Box>
    </Flex>
    <Widget title="Autoranker" />
    <Widget title="Statistics" />
    <Widget title="Applicants" />
    <Widget title="Emailing" />
    <Widget title="Internal Settings" />
  </Flex>
);

export default Admin;
