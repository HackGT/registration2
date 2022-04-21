import React, {useEffect} from 'react'
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


const UserInfoTable: React.FC<any> = (props: any) => {
  const [realData, realsetData] = React.useState(null);


  const [input, setInput] = React.useState('')
  const [filters, setFilters] = React.useState(['SETUP', 'LEARN']);

  const [search, setSearch] = React.useState('');
  let count = 0;
  /* const fetchData = () => axios.get('/applications')
      .then((response:any)=> console.log(response.data))
  */
  useEffect(() => {
    fetch("https://registration.api.hexlabs.org/applications")
      .then(response => {
        if (response.ok) {
          count = Object.keys(response.json()).length;
          return response.json();
        }
        throw response;
      }).then(data => {
        realsetData(data);
      })

  }, [])

  const names:any[] = []
  const emails:any[] = []
  const status:any[] = []

  const handleInputChange = (e: any) => {

    setInput(e.target.value)
    let i, x, j;
    const table = document.getElementById("table") as HTMLTableElement;
    j = 1;

    const { rows } = table;
    for (i = 1; i < rows.length; i ++) {
      table.deleteRow(i);
      i -= 1;
    }
    if (realData != null) {
      for (i = 0; i < count; i ++) {
        names.push(realData[i])
      }
    }

    for (i = 1; i < names.length+1; i ++) {
      if (names[i-1].toLowerCase().startsWith(e.target.value.toLowerCase()) || emails[i-1].toLowerCase().startsWith(e.target.value.toLowerCase())) {
        const r = table.insertRow(j);
        const cell1 = r.insertCell(0);
        const cell2 = r.insertCell(1);
        const cell3 = r.insertCell(2);
        cell1.innerHTML = names[i-1];
        cell3.innerHTML = emails[i-1];
        cell2.innerHTML = status[i-1];
        j ++;
      }
    }


  }
  const isError = input === ''

  return (
  <div>

        <Input placeholder='Basic usage' id='inputText' value = {input} onChange={handleInputChange} />
          <Table variant='simple' id = 'table'>
            <TableCaption>Participant Registration</TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>

          </Table>


</div>
)
};

export default UserInfoTable;
