import { Center, Flex } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";
import React from "react";

import EventCard from "./EventCard";

const SelectEvent: React.FC = () => {
  const [{ data, loading, error }] = useAxios(apiUrl(Service.HEXATHONS, "/hexathons"));

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <Flex paddingY={{ base: "32px", md: "32px" }} direction="column" justify="center">
      {data.map((hexathon: any) => (
        <Center key={hexathon.id}>
          <EventCard name={hexathon.name} id={hexathon.id} />
        </Center>
      ))}
    </Flex>
  );
};

export default SelectEvent;
