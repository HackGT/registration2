import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service, useAuth } from "@hex-labs/core";
import useAxios from "axios-hooks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditIcon } from "@chakra-ui/icons";

import EventCard from "./EventCard";
import HexathonModal from "./HexathonModal";

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
      <Flex paddingY={{ base: "32px", md: "32px" }} direction="column" justify="center">
        {data.map((hexathon: any) => (
          <Flex key={hexathon.id} justifyContent="space-around">
            <EventCard name={hexathon.name} id={hexathon.id} />
            {role.admin && (
              <Button onClick={() => handleModalOpen(hexathon)} h="150px">
                <EditIcon />
              </Button>
            )}
          </Flex>
        ))}
        {role.admin && (
          <Button onClick={() => handleModalOpen(null)} alignSelf="center" mt="4">
            Create Hexathon
          </Button>
        )}
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
