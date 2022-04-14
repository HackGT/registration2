import React from 'react'
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

const UserInfoTable: React.FC<any> = (props: any) => {
  const [input, setInput] = React.useState('')
  const [filters, setFilters] = React.useState(['SETUP', 'LEARN']);

  const [search, setSearch] = React.useState('');

  const names = ["Jane Doe","Mike Smith", "Random Person"]
  const emails = ["janedoe@gmail.com", "mikey@gmail.com", "rando@gmail.com"]
  const status = ["Accepted", "Status Pending", "Status Pending"]
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
    /*
    for (i = 1; i < names.length+1; i ++) {
      const r = table.insertRow(i);
      const cell1 = r.insertCell(0);
      const cell2 = r.insertCell(1);
      const cell3 = r.insertCell(2);
      cell1.innerHTML = names[i-1];
      cell3.innerHTML = emails[i-1];
      cell2.innerHTML = status[i-1];
    }
    for (i = 1; i < rows.length; i ++) {
      const cellText = rows[i].cells[0].innerHTML.toLowerCase();
      if (names[i-1].toLowerCase().startsWith(e.target.value.toLowerCase())) {
        rows[i].cells[0].innerHTML = names[i-1];
      } else {

      }


    }
    */


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
            <Tbody>
              <Tr>
                <Td>Jane Doe</Td>
                <Td>janedoe@gmail.com</Td>
                <Td>Accepted</Td>
              </Tr>
              <Tr>
                <Td>Mike Smith</Td>
                <Td>mikey@gmail.com</Td>
                <Td>Status Pending</Td>
              </Tr>
              <Tr>
                <Td>Random Person</Td>
                <Td>rando@gmail.com</Td>
                <Td>Status</Td>
              </Tr>
            </Tbody>
          </Table>


</div>
)
};

export default UserInfoTable;
