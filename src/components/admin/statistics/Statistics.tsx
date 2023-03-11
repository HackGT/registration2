import React from "react";
import {
  Accordion,
  Box,
  Heading,
  Stack,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
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
          <AccordionSection name="Overall Users">
            <Tbody>
              <Tr>
                <Td maxW="500px" w="500px">
                  Total Users
                </Td>
                <Td>{userStatistics.totalUsers}</Td>
              </Tr>
              <Tr>
                <Td maxW="500px" w="500px">
                  Applied Users
                </Td>
                <Td>{userStatistics.appliedUsers}</Td>
              </Tr>
              <Tr>
                <Td maxW="500px" w="500px">
                  Accepted Users
                </Td>
                <Td>{userStatistics.acceptedUsers}</Td>
              </Tr>
              <Tr>
                <Td maxW="500px" w="500px">
                  Confirmed Users
                </Td>
                <Td>{userStatistics.confirmedUsers}</Td>
              </Tr>
              <Tr>
                <Td maxW="500px" w="500px">
                  Checked-in Users
                </Td>
                <Td>{userStatistics.checkedinUsers}</Td>
              </Tr>
              <Tr>
                <Td maxW="500px" w="500px">
                  Denied Users
                </Td>
                <Td>{userStatistics.deniedUsers}</Td>
              </Tr>
            </Tbody>
          </AccordionSection>
          <AccordionSection name="Application Type">
            <Thead>
              <Th>Branch</Th>
              <Th>Draft</Th>
              <Th>Applied</Th>
              <Th>Total</Th>
              <Th>Accepted</Th>
              <Th>Waitlisted</Th>
              <Th>Denied</Th>
              <Th>Decision Pending</Th>
            </Thead>
            <Tbody>
              {Object.entries(applicationStatistics).map(([key, branchData]: [string, any]) => (
                <Tr>
                  <Td>{key}</Td>
                  <Td>{branchData.draft}</Td>
                  <Td>{branchData.applied}</Td>
                  <Td fontWeight="bold">{branchData.total}</Td>
                  <Td>{branchData.accepted}</Td>
                  <Td>{branchData.waitlisted}</Td>
                  <Td>{branchData.denied}</Td>
                  <Td>{branchData.decisionPending}</Td>
                </Tr>
              ))}
            </Tbody>
          </AccordionSection>
          <AccordionSection name="Confirmation Type">
            <Thead>
              <Th>Branch</Th>
              <Th>Confirmed</Th>
              <Th>Not Attending</Th>
              <Th>Total</Th>
            </Thead>
            <Tbody>
              {Object.entries(confirmationStatistics).map(([key, branchData]: [string, any]) => (
                <Tr>
                  <Td>{key}</Td>
                  <Td>{branchData.confirmed}</Td>
                  <Td>{branchData.notAttending}</Td>
                  <Td fontWeight="bold">{branchData.total}</Td>
                </Tr>
              ))}
            </Tbody>
          </AccordionSection>
          <GraphAccordionSection
            name="Users Detailed Stats & Graphs"
            data={applicationDataStatistics}
          />
        </Accordion>
      </Stack>
    </Box>
  );
};

export default Statistics;
