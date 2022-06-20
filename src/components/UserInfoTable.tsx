import React, {useEffect, useState} from 'react'
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
import { useAxios } from 'use-axios-client'
import {useTable, useSortBy} from 'react-table'


const UserInfoTable: React.FC<any> = (props: any) => {
  const [value, setValue] = React.useState("")
  const [tableRows, setRows] = React.useState([{
    Name: "",
    Email: "",
    Status: ""
  }]);
  /*
  const [realData, realsetData] = React.useState(null);



  const [filters, setFilters] = React.useState(['SETUP', 'LEARN']);

  const [search, setSearch] = React.useState('');
  const count = 0;
  /* const fetchData = () => axios.get('/applications')
      .then((response:any)=> console.log(response.data))
*/
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const fetchData = () => {
        axios.get('https://registration.api.hexlabs.org/applications')
            .then((res) => {
                let i;
                const residualData = res.data as JSON;
                const tableValues = [[]];
                for (i = 0; i < Object.keys(residualData).length; i ++) {
                  tableValues.push([residualData[i].applicationBranch.name, residualData[i].userId, residualData[i].confirmed]);
                }
                setRows(tableValues);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
      fetchData();
  }, [value]);

  return (
      <div>
        <Input id='inputText' placeholder='Filter Participants' isReadOnly={false} onChange={fetchData}/>
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
              {tableRows.map(row => (
                <Tr>
                  <Td>row.Name</Td>
                  <Td>row.Email</Td>
                  <Td>row.Status</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

      </div>
  )

};

export default UserInfoTable;
