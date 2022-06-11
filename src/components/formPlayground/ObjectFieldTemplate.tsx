import React from "react";
import { Box, Divider, Flex } from "@chakra-ui/react";

const ObjectFieldTemplate = (props: any) => (
  // <Flex align="center" justify="center" direction="column">
  <Box>
    <Box fontSize="36px" marginY="5px" >
      <b>{props.title}</b>
    </Box>
    <Divider />
    <Box fontSize="20px" marginY="15px">
      {props.description}
    </Box>
    {props.properties.map((element: any) => (
      <Box key={element.content.key} marginBottom="15px" fontSize="20px">
        {element.content}
      </Box>
    ))}
    <Box height="10px" />
  </Box>
);

export default ObjectFieldTemplate;
