import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Heading,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { apiUrl, ErrorScreen, SearchableTable, Service, useAuth } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { createSearchParams, Link, useParams, useSearchParams } from "react-router-dom";
import { GroupBase, OptionBase, Select } from "chakra-react-select";
import _ from "lodash";
import axios from "axios";

import ApplicationStatusTag from "../../../util/ApplicationStatusTag";
import ApplicationCSVModal from "./ApplicationCSVModal";

const limit = 50;

const columns = [
  {
    key: 0,
    header: "Name",
    accessor: (row: any) => (
      <ChakraLink as={Link} to={row.id}>
        {row.name}
      </ChakraLink>
    ),
  },
  {
    key: 1,
    header: "Email",
    accessor: (row: any) => row.email,
  },
  {
    key: 2,
    header: "Group Type",
    accessor: (row: any) => _.capitalize(row.applicationBranch.applicationGroup),
  },
  {
    key: 3,
    header: "Status",
    accessor: (row: any) => <ApplicationStatusTag status={row.status} includeColor />,
  },
  {
    key: 4,
    header: "Final Score",
    accessor: (row: any) => row.finalScore ?? "N/A",
  },
];

const ApplicationsTablePage: React.FC = () => {
  const { hexathonId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [statusSelectValue, setStatusSelectValue] = useState<GroupOption[]>([]);
  const [applicationBranchSelectValue, setApplicationBranchSelectValue] = useState<GroupOption[]>(
    []
  );
  const [confirmationBranchSelectValue, setConfirmationBranchSelectValue] = useState<GroupOption[]>(
    []
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();
  const [role, setRole] = useState<any>({ member: false, exec: false, admin: false });

  useEffect(() => {
    if (user?.uid) {
      axios
        .get(apiUrl(Service.USERS, `/users/${user.uid}`))
        .then(res => setRole({ ...res.data.roles }));
    }
  }, [user?.uid]);

  const [targetConfirmationBranch, setTargetConfirmationBranch] = useState<GroupOption | null>(null);
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);

  const [topPercentageInput, setTopPercentageInput] = useState("");
  const [topPercentage, setTopPercentage] = useState<number | undefined>(undefined);

  const [{ data, error }, refetch] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/applications"),
    params: {
      hexathon: hexathonId,
      status: searchParams.get("status")?.split(","),
      applicationBranch: searchParams.get("applicationBranch")?.split(","),
      confirmationBranch: searchParams.get("confirmationBranch")?.split(","),
      search: searchText,
      topPercentage,
      offset,
      requireApplicationData: true,
    },
  });
  const [{ data: branches, loading: branchesLoading, error: branchesError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/branches"),
    params: {
      hexathon: hexathonId,
    },
  });

  const statusOptions = useMemo(
    () => [
      {
        label: "Draft",
        value: "DRAFT",
      },
      {
        label: "Applied",
        value: "APPLIED",
      },
      {
        label: "Accepted",
        value: "ACCEPTED",
      },
      {
        label: "Waitlisted",
        value: "WAITLISTED",
      },
      {
        label: "Confirmed",
        value: "CONFIRMED",
      },
      {
        label: "Checked In",
        value: "CHECKED_IN",
      },
      {
        label: "Denied",
        value: "DENIED",
      },
      {
        label: "Not Attending",
        value: "NOT_ATTENDING",
      },
    ],
    []
  );

  const applicationBranchOptions: any[] = useMemo(
    () =>
      branches
        ? branches
            .filter((branch: any) => branch.type === "APPLICATION")
            .map((branch: any) => ({ label: branch.name, value: branch.id }))
        : [],
    [branches]
  );

  const confirmationBranchOptions: any[] = useMemo(
    () =>
      branches
        ? branches
            .filter((branch: any) => branch.type === "CONFIRMATION")
            .map((branch: any) => ({ label: branch.name, value: branch.id }))
        : [],
    [branches]
  );

  useEffect(() => {
    setStatusSelectValue(
      statusOptions.filter(status => searchParams.get("status")?.includes(status.value))
    );
    setApplicationBranchSelectValue(
      applicationBranchOptions.filter(branch =>
        searchParams.get("applicationBranch")?.includes(branch.value)
      )
    );
    setConfirmationBranchSelectValue(
      confirmationBranchOptions.filter(branch =>
        searchParams.get("confirmationBranch")?.includes(branch.value)
      )
    );
  }, [searchParams, statusOptions, applicationBranchOptions, confirmationBranchOptions]);

  const handleBulkAssign = async () => {
    if (!targetConfirmationBranch) return;
    setIsBulkAssigning(true);
    try {
      const response = await axios.get(apiUrl(Service.REGISTRATION, "/applications"), {
        params: {
          hexathon: hexathonId,
          status: searchParams.get("status")?.split(","),
          applicationBranch: searchParams.get("applicationBranch")?.split(","),
          confirmationBranch: searchParams.get("confirmationBranch")?.split(","),
          search: searchText || undefined,
          topPercentage,
          limit: data?.total,
        },
      });
      const allIds = response.data.applications.map((app: any) => app.id);

      const result = await axios.post(
        apiUrl(Service.REGISTRATION, "/applications/bulk/decide-applications"),
        {
          ids: allIds,
          newStatus: "ACCEPTED",
          confirmationBranchId: targetConfirmationBranch.value,
        }
      );

      toast({
        title: "Success",
        description: `Assigned ${result.data.updatedCount} applicants to "${targetConfirmationBranch.label}".`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      refetch();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.response?.data?.message ?? "Bulk assign failed. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsBulkAssigning(false);
    }
  };

  const applyTopPercentage = () => {
    const parsed = parseInt(topPercentageInput);
    setTopPercentage(!isNaN(parsed) && parsed >= 1 && parsed <= 100 ? parsed : undefined);
    setOffset(0);
  };

  const onPreviousClicked = () => {
    setOffset(offset - limit);
  };

  const onNextClicked = () => {
    setOffset(offset + limit);
  };

  const onSearchTextChange = (event: any) => {
    setSearchText(event.target.value);
    setOffset(0);
  };

  if (error) {
    return <ErrorScreen error={error} />;
  }
  if (branchesError) {
    return <ErrorScreen error={branchesError} />;
  }

  // Filters
  interface GroupOption extends OptionBase {
    label: string;
    value: string;
  }

  return (
    <>
      <Heading as="h5" size="sm" marginLeft={6} marginTop={6}>
        Filters:
      </Heading>

      <Stack marginLeft={2} spacing={0} flexDirection={{ base: "column", md: "row" }}>
        <Box p={4} w="80">
          <Text size="xs">Status</Text>
          <Select<GroupOption, true, GroupBase<GroupOption>>
            maxMenuHeight={140}
            isMulti
            options={statusOptions}
            placeholder="Select status..."
            value={statusSelectValue}
            closeMenuOnSelect={false}
            selectedOptionStyle="check"
            hideSelectedOptions={false}
            size="sm"
            onChange={(e: any) => {
              const statuses: GroupOption[] = [];
              if (e !== null) {
                e.forEach((val: any) => {
                  statuses.push({
                    label: val.label,
                    value: val.value,
                  });
                });

                const newParams = createSearchParams(searchParams);

                statuses.length > 0
                  ? newParams.set("status", statuses.map(status => status.value).join())
                  : newParams.delete("status");

                setSearchParams(newParams);
              }
            }}
          />
        </Box>
        <Box p={4} w="80">
          <Text size="xs">Application Branch</Text>
          <Select<GroupOption, true, GroupBase<GroupOption>>
            maxMenuHeight={140}
            isMulti
            options={applicationBranchOptions}
            placeholder="Select application branch..."
            value={applicationBranchSelectValue}
            isLoading={branchesLoading}
            closeMenuOnSelect={false}
            selectedOptionStyle="check"
            hideSelectedOptions={false}
            size="sm"
            onChange={(e: any) => {
              if (e !== null) {
                const applicationBranches: GroupOption[] = [];
                e.forEach((val: any) => {
                  applicationBranches.push({
                    label: val.label,
                    value: val.value,
                  });
                });

                const newParams = createSearchParams(searchParams);

                applicationBranches.length > 0
                  ? newParams.set(
                      "applicationBranch",
                      applicationBranches.map(applicationBranch => applicationBranch.value).join()
                    )
                  : newParams.delete("applicationBranch");

                setSearchParams(newParams);
              }
            }}
          />
        </Box>
        <Box p={4} w="80">
          <Text size="xs">Confirmation Branch</Text>
          <Select<GroupOption, true, GroupBase<GroupOption>>
            maxMenuHeight={140}
            isMulti
            options={confirmationBranchOptions}
            placeholder="Select confirmation branch..."
            value={confirmationBranchSelectValue}
            isLoading={branchesLoading}
            closeMenuOnSelect={false}
            selectedOptionStyle="check"
            hideSelectedOptions={false}
            size="sm"
            onChange={(e: any) => {
              if (e !== null) {
                const confirmationBranches: GroupOption[] = [];
                e.forEach((val: any) => {
                  confirmationBranches.push({
                    label: val.label,
                    value: val.value,
                  });
                });
                const newParams = createSearchParams(searchParams);

                confirmationBranches.length > 0
                  ? newParams.set(
                      "confirmationBranch",
                      confirmationBranches
                        .map(confirmationBranch => confirmationBranch.value)
                        .join()
                    )
                  : newParams.delete("confirmationBranch");

                setSearchParams(newParams);
              }
            }}
          />
        </Box>
        <Box p={4} w="52">
          <Text size="xs">Top X% by Score</Text>
          <Input
            type="number"
            min={1}
            max={100}
            size="sm"
            placeholder="e.g. 25"
            value={topPercentageInput}
            onChange={e => setTopPercentageInput(e.target.value)}
            onBlur={applyTopPercentage}
            onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && applyTopPercentage()}
          />
        </Box>
        <Box p={4} w="80">
          <br />
          <Button onClick={onOpen}>Generate CSV</Button>
          <ApplicationCSVModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            hexathonId={hexathonId}
            status={searchParams.get("status")?.split(",")}
            applicationBranch={searchParams.get("applicationBranch")?.split(",")}
            confirmationBranch={searchParams.get("confirmationBranch")?.split(",")}
            search={searchText || undefined}
            topPercentage={topPercentage}
            totalApplicants={data?.total}
          />
        </Box>
      </Stack>

      {role.admin && (
        <Box marginLeft={6} my={3} w="80">
          <Heading as="h5" size="sm" mb={2} mt={4}>
            Bulk Actions:
          </Heading>
          <Select<GroupOption, false, GroupBase<GroupOption>>
            options={confirmationBranchOptions}
            placeholder="Assign to confirmation branch..."
            value={targetConfirmationBranch}
            isLoading={branchesLoading}
            size="sm"
            onChange={(e: GroupOption | null) => setTargetConfirmationBranch(e)}
            isClearable
          />
          <Button
            mt={2}
            colorScheme="blue"
            size="sm"
            isDisabled={!targetConfirmationBranch}
            isLoading={isBulkAssigning}
            onClick={handleBulkAssign}
          >
            {`Accept & assign ${data?.total ?? 0} applicant${data?.total !== 1 ? "s" : ""}`}
          </Button>
        </Box>
      )}

      <SearchableTable
        title="Applications"
        data={data?.applications}
        columns={columns}
        searchText={searchText}
        onSearchTextChange={onSearchTextChange}
        onPreviousClicked={onPreviousClicked}
        onNextClicked={onNextClicked}
        offset={offset}
        total={data?.total}
      />
    </>
  );
};

export default ApplicationsTablePage;
