import { Heading, Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import React from "react";

interface IProps {
    heading: string;
    data: Record<string, number>;
}

const TableView: React.FC<IProps> = props => (
  <>
  <Heading style={{ textAlign: "center", fontSize: "25px", marginTop: "20px"}}>{props.heading}</Heading>
  <TableContainer overflowY="auto" maxHeight="500px">
    <Table variant="simple">
      <Tbody>
        {Object.keys(props.data).map(key => (
          <Tr>
            <Td style={{ width: "315px", maxWidth: "315px", fontSize: "13px" }}>{key}</Td>
            <Td style={{ fontSize: "13px" }}>{props.data[key]}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
  </>
);

export default TableView;
