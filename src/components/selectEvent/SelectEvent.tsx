import { Center, Flex } from "@chakra-ui/react";
import React from "react";

import EventCard from "./EventCard";

interface Props {
  hexathons: any[];
}

const SelectEvent: React.FC<Props> = props => (
  <Flex paddingY={{ base: "32px", md: "32px" }} direction="column" justify="center">
    {props.hexathons.map((hexathon: any) => (
      <Center key={hexathon._id}>
        <EventCard name={hexathon.name} id={hexathon._id} />
      </Center>
    ))}
  </Flex>
);

export default SelectEvent;
