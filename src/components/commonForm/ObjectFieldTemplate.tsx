import React from "react";
import { Box, Text, Heading } from "@chakra-ui/react";
import { ObjectFieldTemplateProps } from "@rjsf/core";

import RenderMarkdown from "./RenderMarkdown";

const ObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = props => (
  <Box width="100%">
    <Heading fontSize="30px" marginBottom="5px">
      {props.title}
    </Heading>
    <Text marginBottom="20px">
      <RenderMarkdown>{props.description}</RenderMarkdown>
    </Text>
    {props.properties.map((element: any) => (
      <Box key={element.content.key} marginBottom="15px">
        {element.content}
      </Box>
    ))}
    <Box height="10px" />
  </Box>
);

export default ObjectFieldTemplate;
