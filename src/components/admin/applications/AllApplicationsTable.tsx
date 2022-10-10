import React, { useState } from "react";
import {
  Box,
  Code,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { apiUrl, ErrorScreen, SearchableTable, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { Link, useParams } from "react-router-dom";
import { GroupBase, OptionBase, Select } from "chakra-react-select";
import { useForm } from "react-hook-form";
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
  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [applicantGroup, setApplicantGroup] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [applicationBranch, setApplicationBranch] = useState<string[]>([]);
  const [confirmationBranch, setConfirmationBranch] = useState<string[]>([]);

  const { register, watch } = useForm();

  const [{ data, error }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/applications"),
    params: {
      hexathon: hexathonId,
      search: searchText,
      offset,
    },
  });
  const [{ data: branches, error: error2 }] = useAxios({
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
  if (error2) {
    return <ErrorScreen error={error2} />;
  }

  // Filters

  interface GroupOption extends OptionBase {
    label: string;
    value: string;
  }

  const groupOptions = [
    {
      label: "Participant",
      value: "PARTICIPANT",
    },
    {
      label: "Judge",
      value: "JUDGE",
    },
    {
      label: "Mentor",
      value: "MENTOR",
    },
    {
      label: "Volunteer",
      value: "VOLUNTEER",
    },
    {
      label: "Sponsor",
      value: "SPONSOR",
    },
    {
      label: "Partner",
      value: "PARTNER",
    },
    {
      label: "Staff",
      value: "STAFF",
    },
  ];

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
  ];

  const applicationBranchOptions: any[] = [];
  const confirmationBranchOptions: any[] = [];

  branches &&
    branches
      .filter((branch: any) => branch.type === "APPLICATION")
      .map((branch: any) =>
        applicationBranchOptions.push({
          label: branch.name,
          value: branch.id,
        })
      );

  branches &&
    branches
      .filter((branch: any) => branch.type === "CONFIRMATION")
      .map((branch: any) =>
        confirmationBranchOptions.push({
          label: branch.name,
          value: branch.id,
        })
      );

  return (
    <>
      <Heading as="h5" size="sm" marginLeft={6} marginTop={6}>
        Filters:
      </Heading>
      <HStack marginLeft={2}>
        <Box p={4} w="80">
          <Text size="sm">Applicant Group</Text>
          <Select<GroupOption, true, GroupBase<GroupOption>>
            isMulti
            options={groupOptions}
            placeholder="Select application group(s)..."
            closeMenuOnSelect={false}
            selectedOptionStyle="check"
            hideSelectedOptions={false}
            size="sm"
            onChange={(e: any) => {
              if (e !== null) {
                const applicantGroups: string[] = []
                e.map((val: any) => applicantGroups.push(val.value));
                setApplicantGroup(applicantGroups);
              }
            }}
          />
        </Box>
        <Box p={4} w="80">
          <Text size="sm">Status</Text>
          <Select<GroupOption, true, GroupBase<GroupOption>>
            isMulti
            options={statusOptions}
            placeholder="Select status..."
            closeMenuOnSelect={false}
            selectedOptionStyle="check"
            hideSelectedOptions={false}
            size="sm"
            onChange={(e: any) => {
              if (e !== null) {
                const statuses: string[] = []
                e.map((val: any) => statuses.push(val.value));
                setStatus(statuses);
              }
            }}
          />
        </Box>
        <Box p={4} w="80">
          <Text size="sm">Application Branch</Text>
          <Select<GroupOption, true, GroupBase<GroupOption>>
            isMulti
            options={applicationBranchOptions}
            placeholder="Select application branch..."
            closeMenuOnSelect={false}
            selectedOptionStyle="check"
            hideSelectedOptions={false}
            size="sm"
            onChange={(e: any) => {
              if (e !== null) {
                const applicationBranches: string[] = []
                e.map((val: any) => applicationBranches.push(val.value));
                setApplicationBranch(applicationBranches);
              }
            }}
          />
        </Box>
        <Box p={4} w="80">
          <Text size="sm">Confirmation Branch</Text>
          <Select<GroupOption, true, GroupBase<GroupOption>>
            isMulti
            options={confirmationBranchOptions}
            placeholder="Select confirmation branch..."
            closeMenuOnSelect={false}
            selectedOptionStyle="check"
            hideSelectedOptions={false}
            size="sm"
            onChange={(e: any) => {
              if (e !== null) {
                const confirmationBranches: string[] = []
                e.map((val: any) => confirmationBranches.push(val.value));
                setConfirmationBranch(confirmationBranches);
              }
            }}
          />
        </Box>
      </HStack>
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
