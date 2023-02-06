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

  const handleClick = () => {
    // Set expiration time of one week
    window.localStorage.setItem(
      "hexathonId",
      JSON.stringify({ hexathonId: props.id, expires: Date.now() + 1000 * 60 * 60 * 24 * 7 })
    );

    navigate(`/${props.id}`);
  };

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
      onClick={handleClick}
    >
      <HStack>
        <Heading>{props.name}</Heading>
        <Image
          position="absolute"
          right="0px"
          top="0px"
          height="148px"
          src={`/events/${props.id}.jpeg`}
          onError={(e: any) => {
            // add fallback if no logo exists
            e.target.onError = null;
            e.target.src = "/events/default-event-logo.jpeg";
          }}
          alt="hexathon event logo"
        />
      </HStack>
    </Box>
  );
};

export default EventCard;
