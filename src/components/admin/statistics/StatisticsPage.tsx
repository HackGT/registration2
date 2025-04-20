import React from "react";
import {
  Box,
  HStack,
  Button,
  Heading,
  Select,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";
import { DownloadIcon } from "@chakra-ui/icons";

/*
import AccordionSection from "./AccordionSection";
import GraphAccordionSection from "./GraphAccordionSection";
import TreeMapView from "./graphs/TreeMapView";
*/
import { Branch, BranchType } from "../branchSettings/BranchSettingsPage";
import { RenderStatistics } from "./RenderStatistics";
import XLSXExporter from "../../../util/xlsxExport";
import { useCurrentHexathon } from "../../../contexts/CurrentHexathonContext";

const StatisticsPage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = React.useState<Branch | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>("CONFIRMED");
  const { hexathonId } = useParams();
  const { currentHexathon } = useCurrentHexathon();

  // Enable manual mode
  const [{ data, loading, error }, refetchStatistics] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/statistics"),
    params: {
      hexathon: hexathonId,
    },
  });

  const exportToXLSX = React.useCallback(() => {

    if (!hexathonId) { return; }
    
    // whitespaces bad
    const noWhitespaceName = (currentHexathon.name as string).replaceAll(" ", "_");

    const exporter = new XLSXExporter({name: noWhitespaceName, id: hexathonId});
    exporter.addKeyValueData(data.userStatistics, "Overall User Statistics");
    exporter.addTableData(data.applicationStatistics, "Branch", "Application Statistics");
    exporter.addTableData(data.confirmationStatistics, "Branch", "Confirmation Statistics");

    // eslint-disable-next-line guard-for-in
    for (const key in data.applicationDataStatistics) {
      const branchData = data.applicationDataStatistics[key];
      exporter.addKeyValueData(branchData, `${key}`);
    }

    const url = exporter.getDownloadURL();
    const a = document.createElement("a");

    let downloadName = noWhitespaceName;
    if (selectedBranch) downloadName = downloadName.concat(`_filterBranch-${selectedBranch.name}`);
    if (selectedStatus) downloadName = downloadName.concat(`_filterStatus-${selectedStatus}`);

    a.download = downloadName.concat(".xlsx");
    a.href = url;
    a.click();

    exporter.cleanupDownloadURL();
    
  }, [currentHexathon.name, data, hexathonId, selectedBranch, selectedStatus]);

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

  if (!hexathonId) return <ErrorScreen error={new Error("Hexathon ID invalid!")} />;
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  if (branchError) return <ErrorScreen error={branchError} />

  return (
    <Box w="100%" p={5}>
      <Stack>
        <VStack mb={8}>
          <Heading as="h1">Statistics</Heading>
          <Text fontSize="lg" color="grey">
            All of the data crunched into this page from all of the applications we recieved.
          </Text>
          <Box>
            <Button colorScheme="blue" onClick={exportToXLSX}><DownloadIcon />&nbsp;&nbsp;Export to XLSX</Button>
            <Text fontSize="sm" textAlign="center" opacity={0.5}>(Filters will be reflected)</Text>
          </Box>

          {branchLoading? (
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
