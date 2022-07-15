import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  description: string;
  href: string;
}

const AdminWidget: React.FC<Props> = props => (
  <Link to={props.href}>
    <Box
      borderRadius="4px"
      boxShadow={{
        base: "rgba(0, 0, 0, 0.15) 0px 0px 6px 1px",
      }}
      _hover={{
        boxShadow: "rgba(0, 0, 0, 0.20) 0px 0px 8px 2px",
      }}
      transition="box-shadow 0.2s ease-in-out"
    >
      <Box padding="20px 32px">
        <Heading fontSize="18px" fontWeight="semibold" marginBottom="10px" color="#212121">
          {props.title}
        </Heading>
        <Text fontSize="sm" color="#858585">
          {props.description}
        </Text>
      </Box>
    </Box>
  </Link>
);

export default AdminWidget;
