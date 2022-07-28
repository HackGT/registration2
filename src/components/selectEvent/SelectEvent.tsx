import { Center, Flex } from "@chakra-ui/react";
import { ErrorScreen, Loading } from "@hex-labs/core";
import useAxios from "axios-hooks";
import React from "react";

import EventCard from "./EventCard";

const SelectEvent: React.FC = () => {
  const [{ data, loading, error }] = useAxios("https://hexathons.api.hexlabs.org/hexathons");

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <Flex paddingY={{ base: "32px", md: "32px" }} direction="column" justify="center">
      {data.map((hexathon: any) => (
        <Center key={hexathon._id}>
          <EventCard name={hexathon.name} id={hexathon._id} />
        </Center>
      ))}
    </Flex>
  );
};

export default SelectEvent;
