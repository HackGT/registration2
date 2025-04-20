import { Box, Button, Flex, Grid, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service, useAuth } from "@hex-labs/core";
import useAxios from "axios-hooks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditIcon, ExternalLinkIcon, LinkIcon } from "@chakra-ui/icons";
import { FiArrowRight } from "react-icons/fi";

import EventCard from "./EventCard";
import HexathonModal from "./HexathonModal";
import EmptyEventCard from "./EmptyEventCard";
import "../../styles/selectEvent.css";

const SelectEvent: React.FC = () => {
  const { user } = useAuth();
  const [role, setRoles] = useState<any>({
    member: false,
    exec: false,
    admin: false,
  });

  useEffect(() => {
    const getRoles = async () => {
      if (user?.uid) {
        const response = await axios.get(apiUrl(Service.USERS, `/users/${user?.uid}`));
        setRoles({ ...response.data.roles });
      }
    };

    getRoles();
  }, [user?.uid]);

  const navigate = useNavigate();
  const [{ data, loading, error }, refetch] = useAxios(apiUrl(Service.HEXATHONS, "/hexathons"));
  const {
    isOpen: isEditHexathonOpen,
    onOpen: onEditHexathonOpen,
    onClose: onEditHexathonClose,
  } = useDisclosure();
  const [currentHexathonData, setCurrentHexathonData] = useState<any>(null);

  const handleModalOpen = (defaultValues: any) => {
    setCurrentHexathonData(defaultValues);
    onEditHexathonOpen();
  };

  const handleModalClose = () => {
    setCurrentHexathonData(null);
    onEditHexathonClose();
  };

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
    <>
      <div className="registration-bg" />

      <Flex direction="column" justify="center">
        <div className="registration-list-container">
          <Box textAlign={{base: "center", lg: "left"}} >
            <Heading 
            fontSize={{base: '3rem', lg: '5rem'}}
            className="h1">
              Hexlabs Registration
            </Heading>
            <Text 
            mt={2}
            fontSize={{base: '1rem', lg: '1.25rem'}} 
            className="p">
              All events currently accepting applications are listed below. We hope to see you there!
            </Text>
          </Box>

          <Flex direction={{base: "column", md: "row"}} alignItems="center" justifyContent={{base: "center", lg: "left"}} gap={4}>
            <a target="_blank" rel="noreferrer" href="https://hexlabs.org/events">
              <Button variant="outline" _hover={{backgroundColor: 'white', color: "black"}}>Events Page&nbsp;&nbsp;<ExternalLinkIcon /></Button>
            </a>
            <a target="_blank" rel="noreferrer" href="https://archive.hack.gt/">
              <Button variant="outline" _hover={{backgroundColor: 'white', color: "black"}}>Past Events&nbsp;&nbsp;<ExternalLinkIcon /></Button>
            </a>
          </Flex>

          <hr />

          {data.length > 0? 
            <Grid templateColumns={{base: "1fr", xl: "1fr 1fr"}} gap={4}>
              {data.map((hexathon: any) => (
                <Flex key={hexathon.id}>
                  <EventCard name={hexathon.name} id={hexathon.id} />
                  {role.admin && (
                    <Button onClick={() => handleModalOpen(hexathon)} h="150px">
                      <EditIcon />
                    </Button>
                  )}
                </Flex>
              ))}
              <EmptyEventCard />
            </Grid>
            :
            <EmptyEventCard noEvents />
          }
          {role.admin && (
            <Button onClick={() => handleModalOpen(null)} alignSelf="center" mt="4">
              Create Hexathon
            </Button>
          )}
        </div>
      </Flex>

      <HexathonModal
        defaultValues={currentHexathonData}
        isOpen={isEditHexathonOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </>
  );
};

export default SelectEvent;
