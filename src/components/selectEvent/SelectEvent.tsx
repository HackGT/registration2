import { VStack } from "@chakra-ui/react";
import React from "react";

import EventCard from "./EventCard";

interface Props {
  hexathons: any[];
}

const SelectEvent: React.FC<Props> = props => (
  <VStack paddingY={{ base: "32px", md: "32px" }}>
    {props.hexathons.map((hexathon: any) => (
      <EventCard name={hexathon.name} id={hexathon._id} key={hexathon._id} />
    ))}
  </VStack>
);

export default SelectEvent;
