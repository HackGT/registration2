/* eslint-disable no-underscore-dangle */
import React from "react";
import { Accordion, Heading, Stack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";

import Loading from "../../util/Loading";
import AccordionSection from "./AccordionSection";

const Statistics: React.FC = () => {
  const { hexathonId } = useParams();
  const [{ data, loading, error }] = useAxios(
    `https://registration.api.hexlabs.org/statistics/?hexathon=${hexathonId}`
  );

  console.log(data);
  if (error) console.log(error.message);

  const {
    userStatistics,
    applicationStatistics,
    confirmationStatistics,
    rejectionStatistics,
    aggregatedApplicationData,
    branchMap,
  } = data;

  if (loading) return <Loading />;

  return (
    <Stack>
      <Heading as="h1">Statistics</Heading>
      <Heading as="h3" size="xs">
        All of the data crunched into this page from all of the applications we recieved.
      </Heading>
      <Accordion allowToggle>
        <AccordionSection name="Users" data={userStatistics}/>
        <AccordionSection name="Applications" data={applicationStatistics}/>
        <AccordionSection name="Confirmations" data={confirmationStatistics}/>
      </Accordion>
    </Stack>
  );
};

export default Statistics;
