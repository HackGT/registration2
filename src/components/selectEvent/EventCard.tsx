import React from "react";

import { Box } from "@chakra-ui/react";

interface Props {
  name: string;
  description?: string;
  image?: string;
}

const EventCard: React.FC<Props> = props => (
  <Box bg="tomato" w="100%" p={4} color="white">
    {props.name}
  </Box>
);

export default EventCard;
