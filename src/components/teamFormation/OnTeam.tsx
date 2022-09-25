import React, { useState } from "react";
import { Box, Heading, Text, Input, Button, VStack, HStack } from "@chakra-ui/react";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

interface Props {
  team: any;
  members: any;
  hexathonId: string | undefined;
}

const OnTeam: React.FC<Props> = props => {
  const { name } = props.team;
  const [email, setEmail] = useState("");

  const changeEmail = (e: any) => {
    setEmail(e.target.value);
  };

  const addMember = async () => {
    await axios.post(apiUrl(Service.USERS, "/teams/add"), {
      name,
      hexathon: props.hexathonId,
      email,
    });
    window.location.reload();
  };

  const removeSelf = async () => {
    await axios.post(apiUrl(Service.USERS, "/teams/leave"), {
      name,
      hexathon: props.hexathonId,
    });
    window.location.reload();
  };

  return (
    <Box>
      <VStack>
        <Heading paddingTop="20px" paddingBottom="10px" size="lg" lineHeight="inherit">
          Welcome to the {name}!
        </Heading>
        <Heading paddingTop="10px" paddingBottom="10px" size="sm" lineHeight="inherit">
          Current members
        </Heading>
        {props.members.map((member: any) => (
          <Text>
            {member.name.first} {member.name.last} - {member.email}
          </Text>
        ))}
        <Box paddingBottom="20vh">
          {props.team.members.length >= 4 && (
            <Heading paddingTop="10px" paddingBottom="10px" size="sm" lineHeight="inherit">
              You can have up to 4 members on a team.
            </Heading>
          )}
          {props.team.members.length < 4 && (
            <Box>
              <VStack>
                <Heading paddingTop="20px" paddingBottom="10px" size="sm" lineHeight="inherit">
                  Add more members to your team!
                </Heading>
                <HStack spacing="20px">
                  <Input
                    value={email}
                    width="40vw"
                    onChange={changeEmail}
                    placeholder="beardell@hackgt.com"
                  />
                  <Button onClick={addMember}>Add</Button>
                </HStack>
              </VStack>
            </Box>
          )}
        </Box>
        <Button onClick={removeSelf}>Leave team</Button>
      </VStack>
    </Box>
  );
};

export default OnTeam;
