import React from "react";
import { Box, Divider, Flex } from "@chakra-ui/react";

const ExtraInfoTemplate = (props: any) => (
  // <Flex align="center" justify="center" direction="column">
  <Box>
    <Box fontSize="24px" marginY="5px" textAlign="center">
      {props.title}
    </Box>
    <Divider />
    <Box fontSize="10px" marginY="15px">
      {props.description}
    </Box>
    <Box>
      {props.extraInfo}
    </Box>
    {props.properties.map((element: any) => (
      <Box key={element.content.key} marginBottom="15px">
        {element.content}
      </Box>
    ))}
    <Box height="10px" />
  </Box>
);

export default ExtraInfoTemplate;
