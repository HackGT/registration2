import React, { useEffect, useMemo, useState } from "react";
import { Box, Heading, Link as ChakraLink, Stack, Text, Button, useDisclosure } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, SearchableTable, Service } from "@hex-labs/core";
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
];

const generateCSV = async (
  hexathonId: any,
  status: any,
  applicationBranch: any,
  confirmationBranch: any
) => {
  await axios
    .get(apiUrl(Service.REGISTRATION, `applications/generate-csv`), {
      params: { hexathon: hexathonId, status, applicationBranch, confirmationBranch },
      responseType: "blob",
    })
    .then(response => {
      const href = URL.createObjectURL(response.data);

      // create "a" HTML element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "Applications.csv");
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
};

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

  const [{ data, error }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/applications"),
    params: {
      hexathon: hexathonId,
      status: searchParams.get("status")?.split(","),
      applicationBranch: searchParams.get("applicationBranch")?.split(","),
      confirmationBranch: searchParams.get("confirmationBranch")?.split(","),
      search: searchText,
      offset,
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
        <Box p={4} w="80">
          <br />
          <Button onClick={onOpen}>
            Generate CSV
          </Button>
          <ApplicationCSVModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            hexathonId={hexathonId}
            status={searchParams.get("status")?.split(",")}
            applicationBranch={searchParams.get("applicationBranch")?.split(",")}
            confirmationBranch={searchParams.get("confirmationBranch")?.split(",")}
            totalApplicants={data?.total}
          />
        </Box>
      </Stack>
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
