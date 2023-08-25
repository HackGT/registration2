import React, { useState } from "react";
import { Box, Heading, Text, Input, Button, VStack, Wrap } from "@chakra-ui/react";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";
import { useParams } from "react-router-dom";

interface Props {
  team: any;
}

const OnTeamSection: React.FC<Props> = props => {
  const { hexathonId } = useParams();
  const { name } = props.team;
  const [email, setEmail] = useState("");

  const changeEmail = (e: any) => {
    setEmail(e.target.value);
  };

  const handleAddMember = async () => {
    try {
      await axios.post(apiUrl(Service.HEXATHONS, "/teams/add"), {
        hexathon: hexathonId,
        email,
      });
      window.location.reload();
    } catch (err: any) {
      handleAxiosError(err);
    }
  };

  const handleRemoveSelf = async () => {
    try {
      await axios.post(apiUrl(Service.HEXATHONS, "/teams/leave"), {
        name,
        hexathon: hexathonId,
      });
      window.location.reload();
    } catch (err: any) {
      handleAxiosError(err);
    }
  };

  return (
    <>
      <Heading
        textAlign="center"
        paddingTop="20px"
        paddingBottom="10px"
        size="lg"
        lineHeight="inherit"
      >
        Your Team: {name}
      </Heading>
      <Heading
        textAlign="center"
        paddingTop="10px"
        paddingBottom="10px"
        size="sm"
        lineHeight="inherit"
      >
        Current members
      </Heading>
      {props.team.members.map((member: any) => (
        <Text textAlign="center">
          {member.name.first} {member.name.last} - {member.email}
        </Text>
      ))}
      <Box paddingBottom="30px">
        {props.team.members.length >= 4 && (
          <Heading paddingY="10px" size="sm" lineHeight="inherit">
            You can have up to 4 members on a team.
          </Heading>
        )}
        {props.team.members.length < 4 && (
          <VStack>
            <Heading marginTop="20px" textAlign="center" size="sm" lineHeight="inherit">
              Add more members to your team!
            </Heading>
            <Wrap justify="center" spacing="20px">
              <Input
                value={email}
                width="220px"
                onChange={changeEmail}
                placeholder="beardell@hackgt.com"
              />
              <Button onClick={handleAddMember}>Add</Button>
            </Wrap>
          </VStack>
        )}
      </Box>
      <Button onClick={handleRemoveSelf}>Leave team</Button>
    </>
  );
};

export default OnTeamSection;
