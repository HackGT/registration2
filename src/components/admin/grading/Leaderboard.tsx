import React from "react";
import { Box, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service, useAuth } from "@hex-labs/core";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";

interface leaderboardEntry {
  rank?: number;
  name: string;
  numGraded: number;
}

const Leaderboard: React.FC = () => {
  const { hexathonId } = useParams();
  const { user } = useAuth();
  const [{ data, loading, error }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/grading/leaderboard"),
    params: {
      hexathon: hexathonId,
    },
  });

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error} />;
  }

  let offset = 0;
  let rank = 1;

  return (
    <Box mt="5">
      <Heading size="md" textAlign="center" mb="5">
        You've graded {data.currentNumGraded} essays.
      </Heading>
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
            {data.leaderboard.map(
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
