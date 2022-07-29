/* eslint-disable no-underscore-dangle */
import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { ErrorScreen, LoadingScreen } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { Link, useParams } from "react-router-dom";

import { getApplicationStatusTag } from "../../../util/util";

const AllApplicationsTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { hexathonId } = useParams();
  const [{ data, loading, error }] = useAxios({
    method: "GET",
    url: "https://registration.api.hexlabs.org/applications",
    params: {
      hexathon: hexathonId,
      search: searchQuery,
    },
  });

  if (loading) return <LoadingScreen />;

  if (error) return <ErrorScreen error={error} />;

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <InputGroup size="md">
        <Input
          id="inputText"
          placeholder="Search applications"
          isReadOnly={false}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </InputGroup>
      <Table variant="simple" id="table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.applications.map((row: any) => (
            <LinkBox as={Tr} key={row._id}>
              <Td>
                <LinkOverlay as={Link} to={row._id}>
                  {row.name}
                </LinkOverlay>
              </Td>
              <Td>{row.email}</Td>
              <Td>{getApplicationStatusTag(row)}</Td>
            </LinkBox>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default AllApplicationsTable;
