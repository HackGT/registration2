import React, { useEffect, useState } from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
 } from "@chakra-ui/react";
import { LoadingScreen } from "@hex-labs/core";
import axios from "axios";

import { apiUrl, Service } from "../../../util/apiUrl";
import { useAuth } from "../../../contexts/AuthContext";

interface leaderboardEntry {
  name: string
  numGraded: number
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [leaderboardData, setLeaderboardData] = useState<{rank: number, entry: leaderboardEntry}[]>([]);
  const [userRank, setUserRank] = useState<{rank: number, entry: leaderboardEntry}>({
    rank: -1,
    entry: {
      name: "",
      numGraded: 0
    }
  });

  useEffect(() => {
    const retrieveLeaderboardData = async () => {
      const response = await axios.get(
        apiUrl(
          Service.REGISTRATION,
          "/grading/leaderboard"
        )
      );

      response.data.leaderboard.sort((a: leaderboardEntry, b: leaderboardEntry) => {
        if (a.numGraded < b.numGraded) {
          return 1;
        }
        if (a.numGraded > b.numGraded) {
          return -1;
        }
        return 0;
      })

      let offset = 0;
      let rank = 1;
      const leaderboardList: {rank: number, entry: leaderboardEntry}[] = []
      response.data.leaderboard.forEach((entry: leaderboardEntry, index: number, entries: leaderboardEntry[]) => {
        if (index === 0 || entry.numGraded === entries[index - 1].numGraded) {
          leaderboardList.push({rank, entry});
          offset += 1;
        } else {
          rank += offset
          leaderboardList.push({rank, entry});
          offset = 0;
        }
        if (user?.displayName === entry.name) {
          setUserRank({rank, entry});
        }
      })

      setLeaderboardData(leaderboardList);
      setLoading(false);
    }
    
    retrieveLeaderboardData();
  }, [user]);

  if (loading) {
    return <LoadingScreen />
  }

  return(
    <TableContainer
      margin="auto"
      width={{"base": "90%", "md": "70%"}}
      maxWidth={{"base": "540px", "md": "700px"}}
    >
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th isNumeric>Rank</Th>
            <Th>Name</Th>
            <Th isNumeric>Graded</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            (userRank) ? (
              <>
                <Tr>
                  <Td width="15px">{userRank.rank}</Td>
                  <Td>{userRank.entry.name}</Td>
                  <Td isNumeric>{userRank.entry.numGraded}</Td>
                </Tr>
                <Tr>
                  <Td/>
                  <Td/>
                  <Td/>
                </Tr>
              </>
            ) : (
              null
            )
          }
          {
            leaderboardData.map((grader: {rank: number, entry: leaderboardEntry}) => (
              <Tr key={grader.entry.name + grader.entry.numGraded}>
                <Td>{grader.rank}</Td>
                <Td>{grader.entry.name}</Td>
                <Td isNumeric>{grader.entry.numGraded}</Td>
              </Tr>
            ))
          }
        </Tbody>
      </Table>
    </TableContainer>
  )
};

export default Leaderboard;