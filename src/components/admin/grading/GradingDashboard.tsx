import React from "react";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";

const GradingDashboardCard: React.FC<{
  title: string,
  description: string,
  endpoint: string
}> = (props) => (
  <Box
    width={{"base": "100%", "md": "50%"}}
  >
    <Link to={props.endpoint}>
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
        paddingX="48px"
        paddingY="40px"
      >
        <Heading fontSize="20px" fontWeight="semibold" marginBottom="5px">
          {props.title}
        </Heading>
        <Text>
          {props.description}
        </Text>
      </Box>
    </Link>
  </Box>
)

const GradingDashboard: React.FC = () => {
  const { hexathonId } = useParams();
  const options = [
    {
      title: "Grade a Question",
      description: "Score a random applicant's question and score their answer based on the provided rubric!",
      endpoint: `/${hexathonId}/grading/question`
    },
    {
      title: "Leaderboard",
      description: "See how you rank compared to other graders! Grade more applications to climb the leaderboard!",
      endpoint: `/${hexathonId}/grading/leaderboard`
    }
  ]

  return (
    <Stack
      margin="auto"
      paddingY="30px"
      width={{"base": "80%", "md": "65%"}}
      direction={{"base": "column", "md": "row"}}
      spacing="20px"
      alignContent="center"
    >
      {
        options.map((option) => (
          <GradingDashboardCard
            key={option.title}
            title={option.title}
            description={option.description}
            endpoint={option.endpoint}
          />
        ))
      }
    </Stack>
  );
}

export default GradingDashboard;