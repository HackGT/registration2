import { Heading, Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import React from "react";

interface IProps {
    heading: string;
    data: Record<string, number>;
}

const TableView: React.FC<IProps> = props => (
  <TableContainer>
    <Heading style={{ textAlign: "center", fontSize: "25px" }}>{props.heading}</Heading>
    <Table variant="simple">
      <Tbody>
        {Object.keys(props.data).map(key => (
          <Tr>
            <Td style={{ width: "500px", maxWidth: "500px" }}>{key}</Td>
            <Td>{props.data[key]}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

export default TableView;
