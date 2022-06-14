import React from "react";
import { Box, Heading, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";

interface Props {
  title: string;
  description: string;
  image?: string;
}

const Tile: React.FC<Props> = props => (
  <LinkBox borderRadius="4px" boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px">
    <Box
      bgGradient={props.image ? "" : "linear(to-l, #33c2ff, #7b69ec)"}
      borderTopRadius="4px"
      height="150px"
      onClick={() => console.log("Clicked!")}
    />
    <Box padding="20px 32px">
      <Heading fontSize="18px" fontWeight="semibold" marginBottom="10px" color="#212121">
        <LinkOverlay href="#">
          {props.title}
        </LinkOverlay>
      </Heading>
      <Text fontSize="sm" color="#858585">
        {props.description}
      </Text>
    </Box>
  </LinkBox>
);

export default Tile;
