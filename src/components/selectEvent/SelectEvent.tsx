import { Center, Flex } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";
import React from "react";
import { useNavigate } from "react-router-dom";

import EventCard from "./EventCard";

const SelectEvent: React.FC = () => {
  const navigate = useNavigate();
  const [{ data, loading, error }] = useAxios(apiUrl(Service.HEXATHONS, "/hexathons"));

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error} />;
  }

  const { hexathonId, expires } = JSON.parse(window.localStorage.getItem("hexathonId") ?? "{}");

  if (expires && new Date(expires) < new Date()) {
    window.localStorage.removeItem("hexathonId");
  } else if (
    hexathonId &&
    Array.isArray(data) &&
    data.findIndex(hexathon => hexathon.id === hexathonId) >= 0
  ) {
    navigate(`/${hexathonId}`, { replace: true });

    return <LoadingScreen />;
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
