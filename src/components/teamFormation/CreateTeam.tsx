import React, { useState } from "react";
import { Box, Text, Button, Input, Heading, VStack, Center } from "@chakra-ui/react";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

interface Props {
  hexathonId: string | undefined;
}

const CreateTeam: React.FC<Props> = props => {
  const [teamName, setTeamName] = useState("");

  const changeTeamName = (e: any) => {
    setTeamName(e.target.value);
  };

  const createTeam = async () => {
    await axios.post(apiUrl(Service.USERS, "/teams/"), {
      name: teamName,
      hexathon: props.hexathonId,
      description: "This is a team.",
      publicTeam: true,
    });
    window.location.reload();
  };

  return (
    <Box>
      <Center>
        <VStack>
          <Heading paddingTop="20px" paddingBottom="10px" size="md" lineHeight="inherit">
            You are not currently on a team.
          </Heading>
          <Text>Create a team or have your teammate add you to their team by email.</Text>
        </VStack>
      </Center>
      <VStack spacing="20px">
        <Heading paddingTop="20px" size="md" lineHeight="inherit">
          Create a team
        </Heading>
        <Input
          width="40vw"
          value={teamName}
          onChange={changeTeamName}
          placeholder="BeardellBears"
        />
        <Button onClick={createTeam}>Create team</Button>
      </VStack>
    </Box>
  );
};

export default CreateTeam;
