/* eslint-disable no-underscore-dangle */
import React from "react";
import { Accordion, Box, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { ErrorScreen, Loading } from "@hex-labs/core";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";

import AccordionSection from "./AccordionSection";
import GraphAccordionSection from "./GraphAccordionSection";

const Statistics: React.FC = () => {
  const { hexathonId } = useParams();
  const [{ data, loading, error }] = useAxios(
    `https://registration.api.hexlabs.org/statistics/?hexathon=${hexathonId}`
  );
  if (loading) return <Loading />;
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
        <Accordion allowToggle>
          <AccordionSection name="Users" data={userStatistics} />
          <AccordionSection name="Applications" data={applicationStatistics} />
          <AccordionSection name="Confirmations" data={confirmationStatistics} />
          <AccordionSection name="Rejections" data={rejectionStatistics} />
          <GraphAccordionSection name="Application Statistics" data={applicationDataStatistics} />
        </Accordion>
      </Stack>
    </Box>
  );
};

export default Statistics;
