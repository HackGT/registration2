import React from "react";
import { Flex, Box, Text, Image, Heading, Center } from "@chakra-ui/react";
import Logo from "../../assets/hexlabs.svg";

const ApplicationSubmittedPage = () => (
  <Flex
    align="center"
    justify="center"
    direction={{ lg: "row", md: "column", base: "column" }}
    fontFamily="verdana"
    width="100vw"
    height="100vh"
    bgGradient="linear(90deg, #33C2FF, #7B69EC)"
  >
    <Box padding={{ md: "50px", base: "10px" }}>
      <Center>
        <Heading
          fontSize={{ md: "6xl", base: "4xl" }}
          color="white"
          padding={1}
          marginBottom={{ base: "30px" }}
          width={{ md: "600px", base: "90%" }}
          textAlign={{ lg: "left", md: "center", base: "center" }}
        >
          Thank you for applying! You’ll hear from us soon! :))
        </Heading>
      </Center>
    </Box>

    <Box boxSize={{ base: "200px", md: "300px" }}>
      <Image src={Logo} />
    </Box>
  </Flex>
);

export default ApplicationSubmittedPage;
