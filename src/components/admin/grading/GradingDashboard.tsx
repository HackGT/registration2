import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";

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
    <Stack direction={{ base: "column", lg: "row" }} flexGrow="1" justifyContent="space-around">
      {props.buttons}
    </Stack>
  </Box>
);

const GradingDashboard: React.FC = () => {
  const { hexathonId } = useParams();
  const [{ data, loading, error }] = useAxios({
    url: apiUrl(Service.REGISTRATION, "/grading/grading-status"),
    params: {
      hexathon: hexathonId,
    },
  });

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const options = [
    {
      title: "Grade a Question",
      description:
        "Score a random applicant's question and score their answer based on the provided rubric! Select a group below to get started.",
      endpoint: `/${hexathonId}/grading/question`,
      buttons: (
        <>
          <VStack>
            <Text fontWeight="bold">General Group</Text>
            <CircularProgress value={data.generalGroup}>
              <CircularProgressLabel>{data.generalGroup}%</CircularProgressLabel>
            </CircularProgress>
            <Link to="generalGroup/question" style={{ width: "100%" }}>
              <Button w="100%">Grade General</Button>
            </Link>
          </VStack>
          <VStack>
            <Text fontWeight="bold">Emerging Group</Text>
            <CircularProgress value={data.emergingGroup}>
              <CircularProgressLabel>{data.emergingGroup}%</CircularProgressLabel>
            </CircularProgress>
            <Link to="emergingGroup/question" style={{ width: "100%" }}>
              <Button w="100%">Grade Emerging</Button>
            </Link>
          </VStack>
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
      flex={1}
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
