import React, { useState } from "react";
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";

const Widget = ({ title }: { title: string }) => (
  <Box boxShadow="lg" padding="24px 32px">
    <Heading fontWeight={500} marginBottom="10px" fontSize="24px" color="#212121">
      {title}
    </Heading>
    <Text color="#858585" fontSize="16px" fontWeight={400}>
      Short Description of Title
    </Text>
  </Box>
);

const Admin = () => (
  <Flex flexDir="column" padding="48px 72px" gap="20px">
    <Flex
      flexDir="row"
      bgGradient="linear(to-r, #33c2ff, #7b69ec)"
      boxShadow="md"
      alignItems="center"
      justifyContent="space-around"
    >
      <Box color="white" paddingY="64px" paddingLeft="64px">
        <Heading fontSize="64px">Welcome Back Noah!</Heading>
        <Text fontSize="38px">
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
        margin="40px"
        marginRight="94px"
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
