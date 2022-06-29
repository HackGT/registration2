import React, {useEffect, useState, useMemo} from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Button,
  Text,
  useControllableState,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText
} from '@chakra-ui/react'

import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import axios from 'axios'
import useAxios from 'axios-hooks'
import {useTable, useSortBy} from 'react-table'


const UserInfoTable: React.FC<any> = (props: any) => {
  const [value, setValue] = React.useState('');
  const [tableValues, setTableValues] = React.useState([[]]);
  const [{data, loading, error}, refetch] = useAxios(
    'https://registration.api.hexlabs.org/applications'
  );

  let i = 0;
  let tempData: any[] = [[]];
  const handleClick = (event:any) => {
    tempData = [[]];
    console.log(value);
    for (i = 0; i < data.length; i ++) {
      if (data[i].applicationBranch.name.toLowerCase().startsWith(value.toLowerCase()) || data[i].userId.toLowerCase().startsWith(value.toLowerCase())) {
        const stat = data[i].confirmed;
        tempData.push({name: data[i].applicationBranch.name, email: data[i].userId, status: stat ? "Confirmed" : "Applied"});
      }
    }
    setValue(event.target.value)
    setTableValues(tempData)
    console.log(tableValues);
  };

  return (
      <div>
        <InputGroup size='md'>
          <Input id='inputText' placeholder='Filter Participants' isReadOnly={false} value={value} onChange={handleClick}/>
        </InputGroup>
          <Table variant='simple' id = 'table'>
            <TableCaption>Participant Registration</TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((rowData: any, index : any) => (
                <Tr>
                  <Td> rowData.name </Td>
                  <Td> rowData.email </Td>
                  <Td> rowData.status </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

      </div>
  )

};

export default UserInfoTable;
