import React from "react";
import { Box, Heading, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";

interface Props {
  title: string;
  description: string;
  image?: string;
}

const Tile: React.FC<Props> = props => (
  <LinkBox
    borderRadius="4px"
    boxShadow={{
      base: "rgba(0, 0, 0, 0.15) 0px 0px 6px 1px",
    }}
    _hover={{
      boxShadow: "rgba(0, 0, 0, 0.20) 0px 0px 8px 2px",
    }}
    transition="box-shadow 0.2s ease-in-out"
  >
    <Box
      bgGradient={props.image ? "" : "linear(to-l, #33c2ff, #7b69ec)"}
      borderTopRadius="4px"
      height="150px"
      onClick={() => console.log("Clicked!")}
    />
    <Box padding="20px 32px">
      <Heading fontSize="18px" fontWeight="semibold" marginBottom="10px" color="#212121">
        <LinkOverlay href="#">{props.title}</LinkOverlay>
      </Heading>
      <Text fontSize="sm" color="#858585">
        {props.description}
      </Text>
    </Box>
  </LinkBox>
);

export default Tile;
