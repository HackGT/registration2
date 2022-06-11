import React, { useState } from "react";
import { Box, Stack, Text } from "@chakra-ui/react";
import Form from "@rjsf/chakra-ui";
import { JSONSchema7 } from "json-schema";

import SchemaInput from "./SchemaInput"; 
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";
import axios from "axios";

axios.defaults.withCredentials = true;

const SubmittedPage = () => 
  
  (
    <Box margin="30px">
     <Text size="50">Thank you for applying! You’ll hear from us soon! :))</Text>
    </Box>
  );

export default SubmittedPage;
