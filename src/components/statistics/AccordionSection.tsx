import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import React from "react";

const usersKeyMap: Record<string, string> = {
  totalUsers: "Total Users",
  appliedUsers: "Applied Users",
  acceptedUsers: "Accepted Users",
  confirmedUsers: "Confirmed Users",
  nonConfirmedUsers: "Non-Confirmed Accepted Users",
  deniedUsers: "Denied Users",
};

interface IProps {
  name: string;
  data: Record<string, number>;
}

const AccordionSection: React.FC<IProps> = props => (
  <Box borderWidth={1} margin={10}>
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            {props.name}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <TableContainer>
          <Table variant="simple">
            <Tbody>
              {Object.keys(props.data).map(key =>
                props.name === "Users" ? (
                  <Tr>
                    <Td style={{ width: "500px", maxWidth: "500px" }}>{usersKeyMap[key]}</Td>
                    <Td>{props.data[key]}</Td>
                  </Tr>
                ) : (
                  <Tr>
                    <Td style={{ width: "500px", maxWidth: "500px" }}>{key}</Td>
                    <Td>{props.data[key]}</Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </AccordionPanel>
    </AccordionItem>
  </Box>
);

export default AccordionSection;
