import React from "react";
import { Box, Divider } from "@chakra-ui/react";

const FormFieldTemplate = (props: any) => (
  <Box>
    <Box fontSize="24px" marginY="5px">
      {props.title}
    </Box>
    <Divider />
    <Box fontSize="16px" marginY="15px">
      {props.description}
    </Box>
    {props.properties.map((element: any) => (
      <Box key={element.content.title} fontWeight="bold" marginBottom="15px">
        {element.content}
      </Box>
    ))}
    <Box height="10px" />
  </Box>
);

export default FormFieldTemplate;
