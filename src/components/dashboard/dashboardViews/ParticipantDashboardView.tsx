import React, { useEffect, useState } from "react";
import { Box, Flex, Stack, Heading, Text, Button, HStack, SimpleGrid, Divider } from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

import { useAuth } from "../../../contexts/AuthContext";
import Tile from "../Tile";
import Timeline from "../Timeline";

interface Props {
  profile: any;
  curHexathon: any;
  hexathons: any;
}

const ParticipantDashboard: React.FC<Props> = (props: any) => {
  const { user } = useAuth();
  const [branches, setBranches] = useState<any>([]);

  useEffect(() => {
    const getBranches = async () => {
      if (props.hexathons.length > 0) {
        const res = await axios.get(
          `https://registration.api.hexlabs.org/branches/?hexathon=${props.hexathons[0].id}`
        );
        setBranches(res.data);
      }
    }
    getBranches();
  }, [branches, props.hexathons])

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
          
            {
              (() => {
                if (Object.keys(props.curHexathon).length !== 0) {
                  return(
                    <Text>
                      We’re happy to see you here! We’re currently running our {props.curHexathon.name} and we’d love to see you there!
                    </Text>
                  );
                }
                if (props.hexathons.length > 0) {
                  return (
                    <Text>
                      We're happy to see you here! We're still preparing for our {props.hexathons[0].name}, but we’d love to see you there! Check your email or our social media to see when you can begin applying to {props.hexathons[0].name}!
                    </Text>
                  )
                }
                return (
                  <Text>
                    We are currently in the middle of planning events! Check out our social media to stay up to date on when our next event will be held!
                  </Text>
                )
              })()
            }
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
          {
            (Object.keys(props.curHexathon).length === 0) ? (
              <Text>We are currently not running any events! Come back later or check out our Hexlabs social media accounts to keep up with any new information about our events!</Text>
            ) : (
              <Text>Select one of the tracks from below to apply to {props.curHexathon.name}.</Text>
            )
          }
        </Box>
        {
          (Object.keys(props.curHexathon).length === 0) ? (
            null
          ) : (
            <SimpleGrid columns={(branches.length === 0) ? 1 : {base: 1, md: 2}} spacing={4}>
              {
                branches.length === 0 ? (
                  <Text textAlign="center" fontStyle="italic">We are currently working hard to finalize the tracks for {props.curHexathon.name}! Please check back later!</Text>
                ) : branches.map((branch: any) => (
                  <Tile key={branch.name} title={branch.name} description={`${(new Date(branch.settings.open)).toDateString()} - ${(new Date(branch.settings.close)).toDateString()}`}/>
                ))
              }
            </SimpleGrid>
          )
        }
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
        {
          (() => {
            if (Object.keys(props.curHexathon).length !== 0) {
              return(
                <Text>
                  If you can’t make {props.curHexathon.name}, don’t worry! We’re having more events coming up in the next year, so be on the look out :). Follow us on social media to stay in the loop!
                </Text>
              );
            }
            if (props.hexathons.length > 0) {
              return (
                <Text>
                  We’re having more events coming up in the next year, so be on the look out :). Follow us on social media to stay in the loop!
                </Text>
              )
            }
            return (
              <Text>
                We have not yet finalized any plans for future events! Come back later or follow us on social media to be notified of any upcoming Hexlabs events!
              </Text>
            )
          })()
        }
        <Box
          paddingX="30px"
        >
          <Timeline
            hexathons={props.hexathons}
            curHexathon={props.curHexathon}
          />
        </Box>
      </Stack>
    </Flex>
  );
}

export default ParticipantDashboard;