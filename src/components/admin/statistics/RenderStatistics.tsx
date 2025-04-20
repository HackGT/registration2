import React from "react";
import {
  Text,
  Accordion,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
  Alert,
  AlertIcon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import AccordionSection from "./AccordionSection";
import GraphAccordionSection from "./GraphAccordionSection";
import TreeMapView from "./graphs/TreeMapView";

export const RenderStatistics = ({
  data,
  loading,
}: {
  data: {
    userStatistics: any;
    applicationStatistics: any;
    confirmationStatistics: any;
    applicationDataStatistics: any;
    eventInteractionStatistics: any;
  };
  loading: boolean;
}) => {
  if (loading)
    return (
      <Center>
        <Spinner mx="auto" />
      </Center>
    );

  const {
    userStatistics,
    applicationStatistics,
    confirmationStatistics,
    applicationDataStatistics,
    eventInteractionStatistics,
  } = data;

  return (
    <Accordion allowToggle allowMultiple defaultIndex={[0]}>
      <AccordionSection name="Overall Users" small="filterable by branch">
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
              Waitlisted Users
            </Td>
            <Td>{userStatistics.waitlistedUsers}</Td>
          </Tr>
          <Tr>
            <Td maxW="500px" w="500px">
              Withdrawn Users
            </Td>
            <Td>{userStatistics.withdrawnUsers}</Td>
          </Tr>
          <Tr>
            <Td maxW="500px" w="500px">
              Checked-in Users
              <Text fontSize="xs" color="grey">
                (not filtered)
              </Text>
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
      <AccordionSection
        name="Users Detailed Stats & Graphs"
        small="filterable by branch and status"
      >
        <GraphAccordionSection
          name="Users Detailed Stats & Graphs"
          data={applicationDataStatistics}
        />
      </AccordionSection>
      <AccordionSection name="Application Type" small="not filterable">
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
      <AccordionSection name="Confirmation Type" small="not filterable">
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
      <AccordionSection name="Event Interaction Stats" small="not filterable">
        <Alert status="info">
          <AlertIcon />
          Numbers displayed here are generally underestimates given issues with badge scanning, but
          can be used as a reference point.
        </Alert>
        <TreeMapView data={eventInteractionStatistics} />
      </AccordionSection>

      {/* <GraphAccordionSection
            name="Users Detailed Stats & Graphs"
            data={applicationDataStatistics}
          />
          */}
    </Accordion>
  );
};
