import React, { useState } from "react";
import { Box, Heading, Text, Input, Button } from "@chakra-ui/react";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

interface Props {
  team: any;
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
      <Heading size="md" lineHeight="inherit">
        Welcome to team {name}.
      </Heading>
      <Text>Current members: No one oh no</Text>
      {props.team.members.length >= 4 && <Text>Y'all are at max capacity</Text>}

      {props.team.members.length < 4 && (
        <Box>
          <Input
            value={email}
            onChange={changeEmail}
            placeholder="Type in the email of someone you want to add"
          />
          <Button onClick={addMember}>Add team member</Button>
        </Box>
      )}
      <Box>
        <Button onClick={removeSelf}>Leave team</Button>
      </Box>
    </Box>
  );
};

export default OnTeam;
