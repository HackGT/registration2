import React from "react";
import { Box } from "@chakra-ui/react";
import { ObjectFieldTemplateProps } from "@rjsf/core";

const ObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = props => (
  <Box width="100%">
    <Box fontSize="30px" marginBottom="20px">
      <b>{props.title}</b>
    </Box>
    {props.properties.map((element: any) => (
      <Box key={element.content.key} marginBottom="15px">
        {element.content}
      </Box>
    ))}
    <Box height="10px" />
  </Box>
);

export default ObjectFieldTemplate;
