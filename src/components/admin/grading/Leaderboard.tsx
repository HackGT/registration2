import React, { useEffect, useState } from "react";
import { Text, Box, Center, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { apiUrl, LoadingScreen, Service } from "@hex-labs/core";
import axios from "axios";
import { useParams } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";

interface leaderboardEntry {
  rank?: number;
  name: string;
  numGraded: number;
}

const Leaderboard: React.FC = () => {
  const { hexathonId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [leaderboardData, setLeaderboardData] = useState<leaderboardEntry[]>([]);
  let offset = 0;
  let rank = 1;
  const [numApps, setNumApps] = useState(0);
  useEffect(() => {
    const retrieveLeaderboardData = async () => {
      const response = await axios.get(apiUrl(Service.REGISTRATION, "/grading/leaderboard"), {
        params: {
          hexathon: hexathonId,
        },
      });
      let i = 0;
      setLeaderboardData(response.data.leaderboard.slice(0, 10));
      let count = 0;
      for (i = 0; i < response.data.leaderboard.length; i ++) {
        count += response.data.leaderboard[i].numGraded;

      }
      setNumApps(count);
      setLoading(false);
    };

    retrieveLeaderboardData();
  }, [user]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box>
      <Box m = {2} >
        <Center>
          <Text variant="simple" fontSize='xl' as ='u'>Total Applications Graded: {numApps}</Text>
        </Center>
      </Box>
    <TableContainer
      margin="auto"
      width={{ base: "90%", md: "70%" }}
      maxWidth={{ base: "540px", md: "700px" }}
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Name</Th>
            <Th>Graded</Th>
          </Tr>
        </Thead>
        <Tbody>
          {leaderboardData.map(
            (entry: leaderboardEntry, index: number, entries: leaderboardEntry[]) => {
              if (index === 0 || entry.numGraded === entries[index - 1].numGraded) {
                offset += 1;
              } else {
                rank += offset;
                offset = 1;
              }
              return (
                <Tr
                  key={entry.name + entry.numGraded}
                  fontWeight={entry.name === user?.displayName ? "bold" : "normal"}
                >
                  <Td>{rank}</Td>
                  <Td>{entry.name}</Td>
                  <Td>{entry.numGraded}</Td>
                </Tr>
              );
            }
          )}
        </Tbody>
      </Table>
    </TableContainer>
  </Box>
  );
};

export default Leaderboard;
