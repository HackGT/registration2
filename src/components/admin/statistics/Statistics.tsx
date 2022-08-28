import React from "react";
import { Accordion, Box, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";

import AccordionSection from "./AccordionSection";
import GraphAccordionSection from "./GraphAccordionSection";

const Statistics: React.FC = () => {
  const { hexathonId } = useParams();
  const [{ data, loading, error }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/statistics"),
    params: {
      hexathon: hexathonId,
    },
  });
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const {
    userStatistics,
    applicationStatistics,
    confirmationStatistics,
    rejectionStatistics,
    applicationDataStatistics,
  } = data;

  return (
    <Box w="100%" p={5}>
      <Stack>
        <VStack>
          <Heading as="h1">Statistics</Heading>
          <Text fontSize="lg" color="grey">
            All of the data crunched into this page from all of the applications we recieved.
          </Text>
        </VStack>
        <Accordion allowToggle allowMultiple defaultIndex={[0]}>
          <AccordionSection name="Overall Users" data={userStatistics} />
          <AccordionSection name="Application Type" data={applicationStatistics} />
          <AccordionSection name="Confirmation Type" data={confirmationStatistics} />
          <AccordionSection name="Rejections" data={rejectionStatistics} />
          <GraphAccordionSection name="Graphs" data={applicationDataStatistics} />
        </Accordion>
      </Stack>
    </Box>
  );
};

export default Statistics;
