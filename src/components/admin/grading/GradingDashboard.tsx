import React from "react";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";

const GradingDashboardCard: React.FC<{
  title: string;
  description: string;
  buttons: JSX.Element;
}> = props => (
  <Box
    borderRadius="5px"
    textAlign="center"
    boxShadow="rgba(0, 0, 0, 0.15) 0px 0px 6px 1px"
    padding="30px"
  >
    <Heading fontSize="20px" fontWeight="semibold" marginBottom="5px">
      {props.title}
    </Heading>
    <Text mb="3">{props.description}</Text>
    <Stack direction={{ base: "column", lg: "row" }} flexGrow="1">
      {props.buttons}
    </Stack>
  </Box>
);

const GradingDashboard: React.FC = () => {
  const { hexathonId } = useParams();
  const options = [
    {
      title: "Grade a Question",
      description:
        "Score a random applicant's question and score their answer based on the provided rubric!",
      endpoint: `/${hexathonId}/grading/question`,
      buttons: (
        <>
          <Link to="generalGroup/question" style={{ width: "100%" }}>
            <Button w="100%">General Group</Button>
          </Link>
          <Link to="emergingGroup/question" style={{ width: "100%" }}>
            <Button w="100%">Emerging Group</Button>
          </Link>
        </>
      ),
    },
    {
      title: "Leaderboard",
      description:
        "See how you rank compared to other graders! Grade more applications to climb the leaderboard!",
      endpoint: `/${hexathonId}/grading/leaderboard`,
      buttons: (
        <Link to="leaderboard" style={{ width: "100%" }}>
          <Button w="100%">View Leaderboard</Button>
        </Link>
      ),
    },
  ];

  return (
    <Stack
      margin="auto"
      paddingY="30px"
      width={{ base: "90%", md: "75%" }}
      direction={{ base: "column", md: "row" }}
      spacing="20px"
      alignContent="center"
    >
      {options.map(option => (
        <GradingDashboardCard
          key={option.title}
          title={option.title}
          description={option.description}
          buttons={option.buttons}
        />
      ))}
    </Stack>
  );
};

export default GradingDashboard;
