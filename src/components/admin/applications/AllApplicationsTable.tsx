import React, { useState } from "react";
import { Box, Heading, Link as ChakraLink, Stack, Text } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, SearchableTable, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { createSearchParams, Link, useParams, useSearchParams } from "react-router-dom";
import { GroupBase, OptionBase, Select } from "chakra-react-select";
import _ from "lodash";

import ApplicationStatusTag from "../../../util/ApplicationStatusTag";

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

const AllApplicationsTable: React.FC = () => {
  const { hexathonId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [labelDict, setLabelDict] = useState<Record<string, string>>(
    JSON.parse(localStorage.getItem("labelDict") || "{}")
  );

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
  const [{ data: branches, error: branchesError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/branches"),
    params: {
      hexathon: hexathonId,
    },
  });

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

  const statusOptions = [
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
  ];

  const applicationBranchOptions = branches
    ? branches
        .filter((branch: any) => branch.type === "APPLICATION")
        .map((branch: any) => ({ label: branch.name, value: branch.id }))
    : [];
  const confirmationBranchOptions = branches
    ? branches
        .filter((branch: any) => branch.type === "CONFIRMATION")
        .map((branch: any) => ({ label: branch.name, value: branch.id }))
    : [];

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
            value={
              searchParams
                .get("status")
                ?.split(",")
                .map(status => ({
                  label: labelDict[status],
                  value: status,
                })) || []
            }
            closeMenuOnSelect={false}
            selectedOptionStyle="check"
            hideSelectedOptions={false}
            size="sm"
            onChange={(e: any) => {
              if (e !== null) {
                const statuses: string[] = [];
                e.map((val: any) => {
                  statuses.push(val.value);
                  labelDict[val.value] = val.label;
                });
                const newParams = createSearchParams(searchParams);

                statuses.length > 0
                  ? newParams.set("status", statuses.join())
                  : newParams.delete("status");

                localStorage.setItem("labelDict", JSON.stringify(labelDict));
                setLabelDict(labelDict);
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
            value={
              searchParams
                .get("applicationBranch")
                ?.split(",")
                .map(applicationBranch => ({
                  label: labelDict[applicationBranch],
                  value: applicationBranch,
                })) || []
            }
            closeMenuOnSelect={false}
            selectedOptionStyle="check"
            hideSelectedOptions={false}
            size="sm"
            onChange={(e: any) => {
              if (e !== null) {
                const applicationBranches: string[] = [];
                e.map((val: any) => {
                  applicationBranches.push(val.value);
                  labelDict[val.value] = val.label;
                });

                const newParams = createSearchParams(searchParams);

                applicationBranches.length > 0
                  ? newParams.set("applicationBranch", applicationBranches.join())
                  : newParams.delete("applicationBranch");

                localStorage.setItem("labelDict", JSON.stringify(labelDict));
                setLabelDict(labelDict);
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
            value={
              searchParams
                .get("confirmationBranch")
                ?.split(",")
                .map(confirmationBranch => ({
                  label: labelDict[confirmationBranch],
                  value: confirmationBranch,
                })) || []
            }
            closeMenuOnSelect={false}
            selectedOptionStyle="check"
            hideSelectedOptions={false}
            size="sm"
            onChange={(e: any) => {
              if (e !== null) {
                const confirmationBranches: string[] = [];
                e.map((val: any) => {
                  confirmationBranches.push(val.value);
                  labelDict[val.value] = val.label;
                });
                const newParams = createSearchParams(searchParams);

                confirmationBranches.length > 0
                  ? newParams.set("confirmationBranch", confirmationBranches.join())
                  : newParams.delete("confirmationBranch");

                localStorage.setItem("labelDict", JSON.stringify(labelDict));
                setLabelDict(labelDict);
                setSearchParams(newParams);
              }
            }}
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

export default AllApplicationsTable;
