import React from "react";
import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { CalendarIcon } from "@chakra-ui/icons";

interface Props {
  name: string;
  id: string;
  description?: string;
  image?: string;
}

export const CARD_HEIGHT = "12rem";
export const CARD_HEIGHT_SM = "min(25vw, 6rem)";

const EventCard: React.FC<Props> = props => {
  const navigate = useNavigate();

  const [{ data, loading, error }] = useAxios(apiUrl(Service.HEXATHONS, `/hexathons/${props.id}`));
  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error} />;
  }

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
      bg="white"
      w="100%"
      color="black"
      border="1px"
      borderColor="gray.200"
      borderRadius={6}
      overflow="hidden"
      shadow="sm"
      height={{base: CARD_HEIGHT_SM, lg: CARD_HEIGHT}}
      cursor="pointer"
      transition=".1s"
      _hover={{
        shadow: "lg",
      }}
      onClick={handleClick}
    >
      <Flex w="full">
        <Box flexGrow={1} padding={{base: 3, lg: 5}}> 

          {/* I HATE RESPONSIVE DESIGN WHY DOES EVERYONE HAVE DIFFERENT SCREEN SIZES
          these font sizes are scuffed but they work (tested on 500% browser zoom + iphone 12)
          theres nothing else we can do about long titles cuz of the image on the right...
          this WILL break if name.length is big so PLEASE DONT LET THAT HAPPEN */}
          <Heading fontSize={{base: `min(1.4rem, ${6-props.name.length/20}vw)`, lg: '4xl'}} fontFamily="DM Sans, system-ui">
            {props.name}
          </Heading>

          <Box fontSize={{base: `min(0.7rem, ${3-props.name.length/40}vw)`, lg: 'md'}} opacity={0.6}> 
            <CalendarIcon verticalAlign="-0.1em" />&nbsp;&nbsp;
            <Text display="inline" fontFamily="DM Sans, system-ui">
              {new Date(data.startDate).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric"
              })}
            </Text>
          </Box>
        </Box>
        <Image
          height={{base: CARD_HEIGHT_SM, lg: CARD_HEIGHT}}
          width={{base: CARD_HEIGHT_SM, lg: CARD_HEIGHT}}
          objectFit="cover"
          src={data.coverImage ?? "/events/default-event-logo.jpeg"}
          onError={(e: any) => {
            // add fallback if no logo exists
            e.target.onError = null;
            e.target.src = "/events/default-event-logo.jpeg";
          }}
          alt={`${props.name} event logo`}
        />
      </Flex>
    </Box>
  );
};

export default EventCard;
