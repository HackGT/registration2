import React, { useState } from "react";
import { Box, Text, Button, Input, Heading, VStack, Center, useToast } from "@chakra-ui/react";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";

interface Props {
  hexathonId: string | undefined;
}

const CreateTeam: React.FC<Props> = props => {
  const [teamName, setTeamName] = useState("");
  const toast = useToast();

  const changeTeamName = (e: any) => {
    setTeamName(e.target.value);
  };

  const handleCreateTeam = async () => {
    try {
      await axios.post(apiUrl(Service.USERS, "/teams/"), {
        name: teamName,
        hexathon: props.hexathonId,
        description: "This is a team.",
        publicTeam: true,
      });
      window.location.reload();
    } catch (err: any) {
      handleAxiosError(err);
    }
  };

  return (
    <Center>
      <Box
        marginTop="40px"
        width="70vw"
        borderRadius="2px"
        boxShadow={{
          base: "rgba(0, 0, 0, 0.15) 0px 0px 6px 1px",
        }}
        paddingBottom="30px"
      >
        <Center paddingBottom="50px">
          <VStack>
            <Heading paddingTop="20px" paddingBottom="10px" size="md" lineHeight="inherit">
              You are not currently on a team.
            </Heading>
            <Text>Create a team or have your teammate add you to their team by email.</Text>
          </VStack>
        </Center>
        <Center>
          <VStack spacing="20px" paddingBottom="30px">
            <Heading paddingTop="20px" size="md" lineHeight="inherit">
              Create a team
            </Heading>
            <Input
              width="40vw"
              value={teamName}
              onChange={changeTeamName}
              placeholder="BeardellBears"
            />
            <Button onClick={handleCreateTeam}>Create team</Button>
          </VStack>
        </Center>
      </Box>
    </Center>
  );
};

export default CreateTeam;
