import React from "react";
import { Box, Heading, HStack, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Props {
  name: string;
  id: string;
  description?: string;
  image?: string;
}

const EventCard: React.FC<Props> = props => {
  const navigate = useNavigate();
  const imageURL = `/events/${props.id}.jpeg`; // this is relative to public
  return (
    <Box
      position="relative"
      marginBottom={3}
      bg="white"
      w="90%"
      p={4}
      color="black"
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      shadow="sm"
      h="150px"
      cursor="pointer"
      transition=".5s"
      _hover={{
        shadow: "md",
      }}
      onClick={() => {
        window.sessionStorage.setItem("hexathonId", props.id);
        navigate(`/${props.id}`);
      }}
    >
      <HStack>
        <Heading>{props.name}</Heading>
        <Image
          position="absolute"
          right="0px"
          top="0px"
          height="148px"
          src={imageURL}
          alt="event image"
        />
      </HStack>
    </Box>
  );
};

export default EventCard;
