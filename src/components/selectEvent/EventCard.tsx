import React from "react";

import { Box, Heading, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface Props {
  name: string;
  id: string;
  description?: string;
  image?: string;
}

const EventCard: React.FC<Props> = props => (
  <LinkBox
    bg="white"
    w="90%"
    p={4}
    color="black"
    border="1px"
    borderColor="gray.200"
    borderRadius="md"
    shadow="sm"
    h="150px"
    transition=".5s"
    marginBottom="10px"
    _hover={{
      shadow: "md",
    }}
  >
    <Box>
      <LinkOverlay href={`/${props.id}`}>
        <Heading>{props.name}</Heading>
      </LinkOverlay>
    </Box>
  </LinkBox>
);

export default EventCard;
