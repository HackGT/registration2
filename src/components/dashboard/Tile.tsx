import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

interface Props {
  title: string;
  description: string;
  image?: string;
}

const Tile: React.FC<Props> = props => (
  <Box borderRadius="4px" boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px">
    <Box
      bgGradient={props.image ? "" : "linear(to-l, #33c2ff, #7b69ec)"}
      height="150px"
    />
    <Box padding="20px 32px">
      <Heading fontSize="18px" fontWeight="semibold" marginBottom="10px" color="#212121">
        {props.title}
      </Heading>
      <Text fontSize="sm" color="#858585">
        {props.description}
      </Text>
    </Box>
  </Box>
);

export default Tile;
