import React, { useState } from "react";
import { Box, Text, Button, Input } from "@chakra-ui/react";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

interface Props {
  hexathonId: string | undefined;
}

const CreateTeam: React.FC<Props> = props => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");

  const changeTeamName = (e: any) => {
    setTeamName(e.target.value);
  };

  const changeDescription = (e: any) => {
    setDescription(e.target.value);
  };

  const createTeam = async () => {
    await axios.post(apiUrl(Service.USERS, "/teams/"), {
      name: teamName,
      hexathon: props.hexathonId,
      description,
      publicTeam: true,
    });
    window.location.reload();
  };

  return (
    <Box>
      <Text>Create a team or have your teammate add you to their team by email.</Text>
      <Input value={teamName} onChange={changeTeamName} placeholder="Type in your team name" />
      <Input
        value={description}
        onChange={changeDescription}
        placeholder="Type in a description for your team"
      />
      <Button onClick={createTeam}>Create team</Button>
    </Box>
  );
};

export default CreateTeam;
