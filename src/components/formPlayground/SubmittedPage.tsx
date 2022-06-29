import React, { useState } from "react";
import { Box, Stack, Text, Flex } from "@chakra-ui/react";
import Form from "@rjsf/chakra-ui";
import { JSONSchema7 } from "json-schema";

import SchemaInput from "./SchemaInput";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";
import axios from "axios";

const SubmittedPage = () => (
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

export default SubmittedPage;
