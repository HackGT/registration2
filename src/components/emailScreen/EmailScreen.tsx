import React from "react";
import { Box, Heading, Text, Button, Tabs, Input } from "@chakra-ui/react";

const EmailScreen: React.FC = () => (
  <Box
    color="Black"
    paddingY={{ base: "32px", md: "32px" }}
    paddingLeft={{ base: "16px", md: "64px" }}
    paddingRight={{ base: "16px", md: "0" }}
  >
    <Heading size="2xl">Email Screen</Heading>
    <Text fontSize="lg">test text</Text>
  </Box>
);

export default EmailScreen;
