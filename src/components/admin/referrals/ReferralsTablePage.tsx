import React, { useEffect, useMemo, useState } from "react";
import { Box, Heading, Link as ChakraLink, Stack, Text } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, SearchableTable, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";
import {
  createSearchParams,
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { GroupBase, OptionBase, Select } from "chakra-react-select";

import ReferralStatusTag from "../../../util/ReferralStatusTag";

const limit = 50;

interface GroupOption extends OptionBase {
  label: string;
  value: string;
}

const columns = [
  {
    key: 0,
    header: "Name",
    accessor: (row: any) => (
      <ChakraLink as={Link} to={row.id}>
        {[row.referralData?.firstName, row.referralData?.lastName].filter(Boolean).join(" ")}
      </ChakraLink>
    ),
  },
  {
    key: 1,
    header: "Email",
    accessor: (row: any) => row.referralData?.email,
  },
  {
    key: 2,
    header: "School",
    accessor: (row: any) => row.referralData?.school,
  },
  {
    key: 3,
    header: "Referrer Name",
    accessor: (row: any) => row.referrerName,
  },
  {
    key: 4,
    header: "Referrer Email",
    accessor: (row: any) => row.referrerEmail,
  },
  {
    key: 5,
    header: "Early Application",
    accessor: (row: any) => (row.referralData?.referForEarlyApplication ? "Yes" : "No"),
  },
  {
    key: 6,
    header: "Reimbursement",
    accessor: (row: any) => (row.referralData?.referForReimbursement ? "Yes" : "No"),
  },
  {
    key: 7,
    header: "Status",
    accessor: (row: any) => <ReferralStatusTag status={row.status} includeColor />,
  },
];

const ReferralsTablePage: React.FC = () => {
  const { hexathonId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [statusSelectValue, setStatusSelectValue] = useState<GroupOption[]>([]);

  const [{ data, error }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/referrals"),
    params: {
      hexathon: hexathonId,
      status: searchParams.get("status")?.split(","),
      search: searchText,
      offset,
    },
  });

  const statusOptions = useMemo(
    () => [
      {
        label: "In Progress",
        value: "DRAFT",
      },
      {
        label: "Submitted",
        value: "SUBMITTED",
      },
    ],
    []
  );

  useEffect(() => {
    const selectedStatuses = searchParams.get("status")?.split(",") ?? [];
    setStatusSelectValue(statusOptions.filter(status => selectedStatuses.includes(status.value)));
  }, [searchParams, statusOptions]);

  const onPreviousClicked = () => {
    setOffset(currentOffset => currentOffset - limit);
  };

  const onNextClicked = () => {
    setOffset(currentOffset => currentOffset + limit);
  };

  const onSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setOffset(0);
  };

  const onStatusChange = (selectedOptions: readonly GroupOption[]) => {
    const newParams = createSearchParams(searchParams);

    if (selectedOptions.length > 0) {
      newParams.set("status", selectedOptions.map(status => status.value).join());
    } else {
      newParams.delete("status");
    }

    setOffset(0);
    setSearchParams(newParams);
  };

  if (error) {
    return <ErrorScreen error={error} />;
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
            onChange={onStatusChange}
          />
        </Box>
      </Stack>
      <SearchableTable
        title="Referrals"
        data={data?.referrals}
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

export default ReferralsTablePage;
