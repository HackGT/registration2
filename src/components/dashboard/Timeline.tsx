import React from "react";
import { Stack, Box } from "@chakra-ui/react";
import { ErrorScreen, LoadingScreen } from "@hex-labs/core";
import useAxios from "axios-hooks";

import Hex from "./hex";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";
import { apiUrl, Service } from "../../util/apiUrl";

const Timeline: React.FC = () => {
  const [{ data: hexathons, loading, error }] = useAxios(apiUrl(Service.HEXATHONS, "/hexathons"));
  const { currentHexathon } = useCurrentHexathon();

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const currentHexathonIndex = hexathons.findIndex(
    (hexathon: any) => hexathon.id === currentHexathon.id
  );
  const filteredHexathons = hexathons.slice(currentHexathonIndex, currentHexathonIndex + 3);

  return (
    <Stack
      margin="auto"
      direction={{ base: "column", md: "row" }}
      width={{ base: "300px", md: `${(filteredHexathons.length + 1) * 25}%` }}
      height={{ base: `${filteredHexathons.length * 150 + 120}px`, md: "220px" }}
      spacing="0"
      paddingY={{ base: "30px", md: 0 }}
    >
      {filteredHexathons.map((hexathon: any) => (
        <React.Fragment key={hexathon.name}>
          <Box
            display="flex"
            flexDirection={{ base: "row", md: "column" }}
            maxWidth={{ base: "100%", md: "55px" }}
            maxHeight={76}
            paddingTop={{ base: 0, md: "60px" }}
            paddingLeft={{ base: "8.5px", md: "0px" }}
          >
            <Hex
              rotation={90}
              className="hex"
              size={30}
              borderSize={6}
              borderColor={hexathon === currentHexathon ? "#7B69EC" : "#E0E0E0"}
              color={hexathon === currentHexathon ? "#7B69EC" : "white"}
            />
            <Box
              width={{ base: "100%", md: "160%" }}
              margin="auto"
              marginTop={{ md: "15px" }}
              marginLeft={{ base: "50px", md: "-30%" }}
              marginRight={{ base: "0", md: "-30%" }}
              textAlign="center"
              color={hexathon === currentHexathon ? "#7B69EC" : "#E0E0E0"}
              fontSize="20px"
              fontWeight={500}
            >
              {hexathon.name}
            </Box>
          </Box>
          <Box
            width="100%"
            height="100%"
            paddingTop={{ base: 0, md: "88px" }}
            paddingLeft={{ base: "31.641", md: 0 }}
          >
            <Box
              width={{ base: "6px", md: "100%" }}
              height={{ base: "100%", md: "6px" }}
              bg={hexathon === currentHexathon ? "" : "#E0E0E0"}
              bgGradient={
                hexathon === currentHexathon
                  ? {
                      base: "linear(to-b, #7B69EC 50%, #E0E0E0 50%)",
                      md: "linear(to-r, #7B69EC 50%, #E0E0E0 50%)",
                    }
                  : ""
              }
              verticalAlign="center"
            />
          </Box>
        </React.Fragment>
      ))}
      <Box
        display="flex"
        flexDirection={{ base: "row", md: "column" }}
        maxWidth={{ base: "100%", md: "55px" }}
        maxHeight={76}
        paddingTop={{ base: 0, md: "60px" }}
        marginX={filteredHexathons.length === 0 ? "auto" : "0px"}
        paddingLeft={{ base: "8.5px", md: "0px" }}
      >
        <Hex rotation={90} size={30} borderSize={6} borderColor="#E0E0E0" color="white" />
        <Box
          width={{ base: "100%", md: "200%" }}
          margin="auto"
          marginTop={{ md: "15px" }}
          marginLeft={{ base: "50px", md: "-50%" }}
          marginRight={{ base: "0", md: "-50%" }}
          textAlign="center"
          color="#E0E0E0"
          fontSize="20px"
          fontWeight={500}
        >
          Coming soon...
        </Box>
      </Box>
    </Stack>
  );
};

export default Timeline;
