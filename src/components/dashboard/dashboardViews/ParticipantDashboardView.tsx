import React from "react";
import { Box, Flex, Stack, Heading, Text, Button, HStack, SimpleGrid, Divider } from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";

import { useAuth } from "../../../contexts/AuthContext";
import Tile from "../Tile";
import Timeline from "../Timeline";

interface Props {
  profile: any;
  hexathons: any;
}

const ParticipantDashboard: React.FC<Props> = (props: any) => {
  const { user } = useAuth();

  return (
    <Flex flexDir="column" padding={{ base: "0 0 16px", md: "32px 48px" }} margin="auto" maxWidth="1000px">
      <Flex
        flexDir={{ base: "column", md: "row" }}
        bgGradient={{ base: "linear(to-b, #33c2ff, #7b69ec)", md: "linear(to-r, #33c2ff, #7b69ec)" }}
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
        alignItems="center"
        justifyContent="space-around"
      >
        <Box
          color="white"
          paddingY="32px"
          paddingLeft={{ base: "16px", md: "32px" }}
          paddingRight={{ base: "16px", md: "0px" }}
        >
          <Heading
            size="xl"
            marginBottom="15px"
          >
            Welcome Back {props.profile.name?.first}!
          </Heading>
          <Text>
            We’re happy to see you here! We’re currently running our HackGT 8 and we’d love to see you there!
          </Text>
          <HStack
            maxWidth={{ base: "500px", md: "400px" }}
            justifyContent="space-around"
            marginTop={{base: 4, md: 8}}
            spacing={4}
          >
            <Button width="45%" color="#7B69EC" borderWidth="1px" borderColor="#7B69EC">Apply</Button>
            <Button width="45%" bgColor="#7B69EC">Details</Button>
          </HStack>
        </Box>
        <Box
          border="8px"
          borderStyle="solid"
          borderColor="white"
          borderRadius="3xl"
          padding="10px"
          bgColor="#b4c0fa"
          marginY={{ md: "20px" }}
          marginBottom={{ base: "40px" }}
          marginX={{ base: "auto", md: "64px" }}
        >
          <QRCodeSVG
            value={JSON.stringify({
              uid: user?.uid,
              name: {
                first: props.profile.name?.first,
                last: props.profile.name?.last,
              },
              email: user?.email,
            })}
            bgColor="#b4c0fa"
            size={140}
          />
        </Box>
      </Flex>
      <Stack margin={{base: "20px", md: 0}} marginBottom={{base: 0, md: "15px"}}>
        <Box margin="35px 25px 15px 25px">
          <Heading fontSize="36px" fontWeight="semibold" marginBottom="10px">Tracks</Heading>
          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa varius pharetra eget purus id viverra sagittis ac lorem. Duis turpis donec sed eu aliquam fringilla ut. Libero, purus, aenean vitae facilisi semper purus vitae odio. Non et nunc ullamcorper nec turpis sit ultricies massa.</Text>
        </Box>
        <SimpleGrid columns={{base: 1, md: 2}} spacing={4}>
            <Tile title="Title goes here" description="Body goes here Lorem ipsum blah blah blah"/>
            <Tile title="Title goes here" description="Body goes here Lorem ipsum blah blah blah"/>
            <Tile title="Title goes here" description="Body goes here Lorem ipsum blah blah blah"/>
            <Tile title="Title goes here" description="Body goes here Lorem ipsum blah blah blah"/>
        </SimpleGrid>
      </Stack>
      <Divider marginY={{ base: "30px", md: "40px" }} alignSelf="center" width="95%"/>
      <Stack marginX={{ base: "20px", md: 0 }}>
        <Heading
          fontSize="36px"
          fontWeight="semibold"
          marginBottom="10px"
          alignSelf="center"
        >
          Future Events
        </Heading>
        <Text>
          If you can’t make HackGT 8, don’t worry! We’re having more events coming up in the next year, so be on the look out :) Follow us on social media to stay in the loop
        </Text>
        <Box
          paddingX="30px"
        >
          <Timeline
            events={[
              "HackGT 9",
              "Prototypical",
              "Catalyst"
            ]}
          />
        </Box>
      </Stack>
    </Flex>
  );
}

export default ParticipantDashboard;