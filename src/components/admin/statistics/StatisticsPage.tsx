import React from "react";
import {
  Accordion,
  Alert,
  AlertIcon,
  Box,
  HStack,
  Heading,
  Select,
  Spinner,
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
import { RenderStatistics } from "./RenderStatistics";

const StatisticsPage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = React.useState<Branch | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>("CONFIRMED");
  const { hexathonId } = useParams();

  // Enable manual mode
  const [{ data, loading, error }, refetchStatistics] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/statistics"),
    params: {
      hexathon: hexathonId,
    },
  });

  // Fetch statistics whenever selectedBranchId changes
  React.useEffect(() => {
    if (hexathonId) {
      const params: any = { hexathon: hexathonId };

      if (selectedBranch) {
        const { type, id } = selectedBranch;
        if (type === BranchType.CONFIRMATION) {
          params.confirmationBranch = id;
        } else if (type === BranchType.APPLICATION) {
          params.applicationBranch = id;
        }
      }

      if (selectedStatus) {
        params.status = selectedStatus;
      }

      refetchStatistics({ params });
    }
  }, [selectedBranch, selectedStatus, hexathonId, refetchStatistics]);

  const [{ data: branchData, loading: branchLoading, error: branchError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/branches"),
    params: {
      hexathon: hexathonId,
    },
  });

  if (error) return <ErrorScreen error={error} />;

  return (
    <Box w="100%" p={5}>
      <Stack>
        <VStack mb={8}>
          <Heading as="h1">Statistics</Heading>
          <Text fontSize="lg" color="grey">
            All of the data crunched into this page from all of the applications we recieved.
          </Text>

          {branchLoading ? (
            <Spinner />
          ) : (
            <HStack>
              <Box>
                <Text fontSize="lg" color="grey">
                  Branch
                </Text>
                <Select
                  placeholder="All"
                  value={selectedBranch?.id ?? ""}
                  onChange={e => {
                    const selectedBranchId = e.target.value;
                    const newSelected = branchData.find(
                      (branch: any) => branch.id === selectedBranchId
                    );
                    setSelectedBranch(newSelected);
                  }}
                >
                  {branchData.map((branch: any) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text fontSize="lg" color="grey">
                  Status
                </Text>
                <Select
                  placeholder="All"
                  value={selectedStatus ?? ""}
                  onChange={e => {
                    const newSelectedStatus = e.target.value;
                    setSelectedStatus(newSelectedStatus);
                  }}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="APPLIED">Applied</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="WAITLISTED">Waitlisted</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="DENIED">Denied</option>
                  <option value="NOT_ATTENDING">Not Attending</option>
                </Select>
              </Box>
            </HStack>
          )}
        </VStack>

        <RenderStatistics data={data} loading={loading} />
      </Stack>
    </Box>
  );
};

export default StatisticsPage;
