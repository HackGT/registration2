import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup } from "@chakra-ui/react";
import useAxios from "axios-hooks";

const UserInfoTable: React.FC = () => {
  const [value, setValue] = React.useState("");
  const [tableValues, setTableValues] = React.useState([[]]);
  const [{ data, loading, error }] = useAxios("https://registration.api.hexlabs.org/applications");

  if (loading || error) {
    console.log(error);
    return <div>Loading...</div>;
  }

  let i = 0;
  let tempData: any[] = [[]];
  const handleClick = (event: any) => {
    tempData = [[]];
    console.log(value);
    for (i = 0; i < data.length; i++) {
      if (
        data[i].applicationBranch.name.toLowerCase().startsWith(value.toLowerCase()) ||
        data[i].userId.toLowerCase().startsWith(value.toLowerCase())
      ) {
        const stat = data[i].confirmed;
        tempData.push({
          name: data[i].applicationBranch.name,
          email: data[i].userId,
          status: stat ? "Confirmed" : "Applied",
        });
      }
    }
    setValue(event.target.value);
    setTableValues(tempData);
    console.log(tableValues);
  };

  return (
    <div>
      <InputGroup size="md">
        <Input
          id="inputText"
          placeholder="Filter Participants"
          isReadOnly={false}
          value={value}
          onChange={handleClick}
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
          {data.map((row: any) => (
            <Tr>
              <Td>{row.name}</Td>
              <Td>{row.email}</Td>
              <Td>{row.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default UserInfoTable;
