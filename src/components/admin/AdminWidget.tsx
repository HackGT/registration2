import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

interface Props {
  title: string;
  description: string;
}

const AdminWidget: React.FC<Props> = props => (
  <Box
    boxShadow={{
      base: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    }}
    padding="20px 32px"
    borderRadius="4px"
  >
    <Heading fontWeight={500} marginBottom="10px" size="md" color="#212121">
      {props.title}
    </Heading>
    <Text color="#858585" fontSize="sm" fontWeight={400}>
      {props.description}
    </Text>
  </Box>
);

export default AdminWidget;
