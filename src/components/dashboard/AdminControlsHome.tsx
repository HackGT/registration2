import React from "react";
import { Box, Flex, Stack, Heading } from "@chakra-ui/react";
import Widget from "./Widget";

const AdminControlsHome: React.FC = () => (
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
          paddingY={{ base: "24px", md: "24px" }}
          paddingLeft={{ base: "16px", md: "64px" }}
          paddingRight={{ base: "16px", md: "64px" }}
        >
          <Heading size="2xl" marginBottom="9px">Admin Controls</Heading>
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

export default AdminControlsHome;