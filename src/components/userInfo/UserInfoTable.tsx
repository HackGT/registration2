/* eslint-disable no-underscore-dangle */
import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup } from "@chakra-ui/react";
import useAxios from "axios-hooks";

import { getApplicationStatusTag } from "../../util/util";

const UserInfoTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [{ data, loading, error }] = useAxios("https://registration.api.hexlabs.org/applications");

  if (loading || error) {
    return <div>Loading...</div>;
  }

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const tableData = data.filter((application: any) => {
    // Check if userId or applicationId matches search
    if (
      application.userId.toLowerCase().includes(searchQuery) ||
      application._id.toLowerCase().includes(searchQuery)
    ) {
      return true;
    }

    // If application doesn't have any other userInfo, return false
    if (Object.keys(application.userInfo).length === 0) {
      return false;
    }

    // Check if application name or email matches search
    const name = `${application.userInfo?.name?.first} ${application.userInfo?.name?.last}`;
    if (
      name.toLowerCase().includes(searchQuery) ||
      application.userInfo?.email.toLowerCase().includes(searchQuery)
    ) {
      return true;
    }
    return false;
  });

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
          {tableData.map((row: any) => (
            <Tr>
              <Td>{`${row.userInfo.name.first} ${row.userInfo.name.last}`}</Td>
              <Td>{row.userInfo.email}</Td>
              <Td>{getApplicationStatusTag(row)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default UserInfoTable;
