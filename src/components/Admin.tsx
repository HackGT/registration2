import React, { useState } from "react";
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";

const Widget = ({ title }: { title: string }) => (
  <Box boxShadow="md" padding="30px">
    <Heading fontWeight={500} marginBottom="10px" fontSize="28px">
      {title}
    </Heading>
    <Text color="gray.400" fontSize="16px">
      Short Description of Title
    </Text>
  </Box>
);

const Admin = () => (
  <Flex flexDir="column" padding="30px" gap="20px">
    <Flex
      flexDir="row"
      bgGradient="linear(to-r, cyan.400, purple.500)"
      boxShadow="md"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box color="white" paddingLeft="40px">
        <Heading size="3xl">Welcome Back Noah!</Heading>
        <Text fontSize="25px">
          We're happy to see that you're an{" "}
          <Text as="span" color="purple.500">
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
