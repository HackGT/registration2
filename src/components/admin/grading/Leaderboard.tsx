import React, { useEffect, useState } from "react";
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
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

  useEffect(() => {
    const retrieveLeaderboardData = async () => {
      const response = await axios.get(apiUrl(Service.REGISTRATION, "/grading/leaderboard"), {
        params: {
          hexathon: hexathonId,
        },
      });

      setLeaderboardData(response.data.leaderboard);
      setLoading(false);
    };

    retrieveLeaderboardData();
  }, [user]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
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
  );
};

export default Leaderboard;
