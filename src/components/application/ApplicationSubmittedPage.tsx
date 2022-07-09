import React from "react";
import { Flex, Text } from "@chakra-ui/react";

const ApplicationSubmittedPage = () => (
  <Flex
    align="center"
    justify="center"
    direction="column"
    fontFamily="verdana"
    width="100%"
    height="100vh"
    bgGradient="linear(to-t, blue.400, purple.500)"
  >
    <Text fontSize="4xl">Thank you for applying! You’ll hear from us soon! :))</Text>
  </Flex>
);

export default ApplicationSubmittedPage;
