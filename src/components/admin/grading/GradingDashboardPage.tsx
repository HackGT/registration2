import React from "react";
import {
  Box,
  Button,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { WarningIcon } from "@chakra-ui/icons";

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

const GradingDashboardPage: React.FC = () => {
  const { hexathonId } = useParams();
  const [{ data, loading, error }] = useAxios({
    url: apiUrl(Service.REGISTRATION, "/grading/grading-status"),
    params: {
      hexathon: hexathonId,
    },
  });

  const [{ data: branches, loading: branchesLoading }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/branches"),
    params: {
      hexathon: hexathonId,
    },
  });

  if (branchesLoading) {
    return <LoadingScreen />;
  }

  const gradingEnabled = branches?.map((branch: any) => branch.grading.enabled).includes(true);

  if (loading) return <LoadingScreen />;
  if (!gradingEnabled) {
    return (
      <Box p="5" borderWidth="1px">
        <Center>
          <Flex align="baseline" mt={5}>
            <WarningIcon w={375} h={175} />
          </Flex>
        </Center>
        <Center>
          <Text textAlign="center" fontSize="20px" fontWeight="bold">
            Grading is currently disabled for this hexathon.
          </Text>
        </Center>
      </Box>
    );
  }
  if (error) return <ErrorScreen error={error} />;

  const options = [
    {
      title: "Grade a Question",
      description:
        "Score a random applicant's question and score their answer based on the provided rubric!",
      endpoint: `/${hexathonId}/grading/question`,
      buttons: (
        <VStack>
          <CircularProgress value={data.generalGroup}>
            <CircularProgressLabel>{data.generalGroup}%</CircularProgressLabel>
          </CircularProgress>
          <Link to="generalGroup/question" style={{ width: "100%" }}>
            <Button w="100%">Start Grading</Button>
          </Link>
        </VStack>
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

export default GradingDashboardPage;
