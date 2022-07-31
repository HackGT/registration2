import React, { useState } from "react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { ErrorScreen, SearchableTable } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { Link, useParams } from "react-router-dom";

import { getApplicationStatusTag } from "../../../util/util";

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
    header: "Status",
    accessor: (row: any) => getApplicationStatusTag(row),
  },
];

const AllApplicationsTable: React.FC = () => {
  const { hexathonId } = useParams();
  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [{ data, error }] = useAxios({
    method: "GET",
    url: "https://registration.api.hexlabs.org/applications",
    params: {
      hexathon: hexathonId,
      search: searchText,
      offset,
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

  return (
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
  );
};

export default AllApplicationsTable;
