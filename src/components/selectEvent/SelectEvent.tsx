import React from "react";

import { useHexathons } from "../../contexts/HexathonsContext";
import EventCard from "./EventCard";

const SelectEvent: React.FC = () => {
  const { hexathons } = useHexathons();
  console.log(hexathons);
  return (
    <>
      <h2>Select an event</h2>
      {hexathons.map((hexathon: any) => (
        <EventCard name={hexathon.name} />
      ))}
    </>
  );
};

export default SelectEvent;
