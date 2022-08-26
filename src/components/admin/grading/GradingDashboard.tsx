import React from "react";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";

const GradingDashboard: React.FC = (props) => {
  const { hexathonId } = useParams();

  return (
    <Stack
      margin="auto"
      paddingY="30px"
      width={{"base": "80%", "md": "65%"}}
      direction={{"base": "column", "md": "row"}}
      spacing="20px"
      alignContent="center"
    >
      <Box width={{"base": "100%", "md": "50%"}}>
        <Link to={`/${hexathonId}/grading/question`}>
          <Box
            borderRadius="5px"
            textAlign="center"
            boxShadow="rgba(0, 0, 0, 0.15) 0px 0px 6px 1px"
            _hover={{
              boxShadow: "rgba(0, 0, 0, 0.20) 0px 0px 8px 2px",
              color: "white",
              bg: "#7b69ec"
            }}
            transition="background 0.25s ease-in-out"
          >
            <Box paddingX="48px" paddingY="40px">
              <Heading fontSize="20px" fontWeight="semibold" marginBottom="5px">
                Grade a Question
              </Heading>
              <Text>
                Score a random applicant's question and score their answer based on the provided rubric!
              </Text>
            </Box>
          </Box>
        </Link>
      </Box>
      <Box width={{"base": "100%", "md": "50%"}}>
        <Link to={`/${hexathonId}/grading/leaderboard`}>
          <Box
            borderRadius="5px"
            textAlign="center"
            boxShadow="rgba(0, 0, 0, 0.15) 0px 0px 6px 1px"
            _hover={{
              boxShadow: "rgba(0, 0, 0, 0.20) 0px 0px 8px 2px",
              color: "white",
              bg: "#7b69ec"
            }}
            transition="background 0.25s ease-in-out"
          >
            <Box paddingX="48px" paddingY="40px">
              <Heading fontSize="20px" fontWeight="semibold" marginBottom="5px">
                Leaderboard
              </Heading>
              <Text>
                See how you rank compared to other graders! Grade more applications to climb the leaderboard!
              </Text>
            </Box>
          </Box>
        </Link>
      </Box>
    </Stack>
  );
}

export default GradingDashboard;