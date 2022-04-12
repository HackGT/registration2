import React, { useState } from "react";
import { Box, Flex, SimpleGrid, Heading, Text } from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";

const Widget = ({ title }: { title: string }) => (
  <Box
    boxShadow={{
      base: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    }}
    padding="20px 32px"
    borderRadius="4px"
  >
    <Heading fontWeight={500} marginBottom="10px" size="md" color="#212121">
      {title}
    </Heading>
    <Text color="#858585" fontSize="sm" fontWeight={400}>
      Short Description of Title
    </Text>
  </Box>
);

const Admin = () => (
  <Flex flexDir="column" padding={{ base: "0 0 8px 0", md: "32px 48px" }} gap="15px">
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
        <Heading size="2xl">Welcome Back Noah!</Heading>
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
        marginY={{ md: "20px" }}
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
          size={140}
          bgColor="#b4c0fa"
        />
      </Box>
    </Flex>
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 8 }}>
      <Widget title="Autoranker" />
      <Widget title="Statistics" />
      <Widget title="Applicants" />
      <Widget title="Emailing" />
      <Widget title="Internal Settings" />
    </SimpleGrid>
  </Flex>
);

export default Admin;
