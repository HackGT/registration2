import { VStack } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

import { useHexathons } from "../../contexts/HexathonsContext";
import EventCard from "./EventCard";

const SelectEvent: React.FC = () => {
  const { hexathons } = useHexathons();

  return (
    <VStack paddingY={{ base: "32px", md: "32px" }}>
      {hexathons.map((hexathon: any) => (
        <EventCard name={hexathon.name} id={hexathon._id} />
      ))}
    </VStack>
  );
};

export default SelectEvent;
