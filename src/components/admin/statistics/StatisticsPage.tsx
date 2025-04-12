import React from "react";
import {
  Accordion,
  Alert,
  AlertIcon,
  Box,
  HStack,
  Heading,
  Select,
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
import TreeMapView from "./graphs/TreeMapView";
import { Branch, BranchType } from "../branchSettings/BranchSettingsPage";

const StatisticsPage: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = React.useState<string | null>(null);
  const { hexathonId } = useParams();

  // Enable manual mode
  const [{ data, loading, error }, refetchStatistics] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/statistics"),
    params: {
      hexathon: hexathonId,
      branch: selectedBranchId ?? undefined,
    },
  });

  // Fetch statistics whenever selectedBranchId changes
  React.useEffect(() => {
    if (hexathonId) {
      refetchStatistics({
        params: {
          hexathon: hexathonId,
          branch: selectedBranchId ?? undefined,
        },
      });
    }
  }, [selectedBranchId, hexathonId, refetchStatistics]);


  const [{ data: branchData, loading: branchLoading, error: branchError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/branches"),
    params: {
      hexathon: hexathonId,
    },
  });

  if (loading || branchLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  const {
    userStatistics,
    applicationStatistics,
    confirmationStatistics,
    applicationDataStatistics,
    eventInteractionStatistics,
  } = data;


  const confirmationBranches = branchData.filter((branch: Branch) => branch.type === BranchType.CONFIRMATION)

  return (
    <Box w="100%" p={5}>
      <Stack>
        <VStack>
          <Heading as="h1">Statistics</Heading>
          <Text fontSize="lg" color="grey">
            All of the data crunched into this page from all of the applications we recieved.
          </Text>

          <HStack>
            <Box>
              <Text fontSize="lg" color="grey">
                Confirmation Branch
              </Text>
              <Select placeholder='Confirmation branch'
                value={selectedBranchId ?? ""}
                onChange={(e) => {
                  setSelectedBranchId(e.target.value);
                }}
              >
                {
                  confirmationBranches.map((branch: any) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))
                }
              </Select>
            </Box>

            <Box>
              <Text fontSize="lg" color="grey">
                Application Branch
              </Text>
              <Select placeholder='Application branch'
              >
                {
                  confirmationBranches.map((branch: any) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))
                }
              </Select>
            </Box>

            <Box>
              <Text fontSize="lg" color="grey">
                Status
              </Text>
              <Select placeholder='Application Status'
              // default this to confirmed
              >
                {
                  confirmationBranches.map((branch: any) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))
                }
              </Select>
            </Box>
          </HStack>
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
                  (not filtered by branch)
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
          <AccordionSection name="Application Type" small="not filtered by branch">
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
          <AccordionSection name="Confirmation Type" small="not filtered by branch">
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
          <AccordionSection name="Event Interaction Stats" small="not filtered by branch">
            <Alert status="info">
              <AlertIcon />
              Numbers displayed here are generally underestimates given issues with badge scanning,
              but can be used as a reference point.
            </Alert>
            <TreeMapView data={eventInteractionStatistics} />
          </AccordionSection>

          {/* <GraphAccordionSection
            name="Users Detailed Stats & Graphs"
            data={applicationDataStatistics}
          />
          */}
          <AccordionSection name="Users Detailed Stats & Graphs">
            <GraphAccordionSection
                name="Users Detailed Stats & Graphs"
                data={applicationDataStatistics}
            />
        </AccordionSection>

        </Accordion>

      </Stack>
    </Box>
  );
};

export default StatisticsPage;
