import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
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
  <AccordionItem>
    <h2>
      <AccordionButton paddingY="15px">
        <Box flex="1" textAlign="left">
          <Heading size="md">{props.name}</Heading>
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      <TableContainer>
        <Table variant="simple">
          <Tbody>
            {Object.keys(props.data).map(key => (
              <Tr>
                <Td style={{ width: "500px", maxWidth: "500px" }}>
                  {key in usersKeyMap ? usersKeyMap[key] : key}
                </Td>
                <Td>{props.data[key]}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </AccordionPanel>
  </AccordionItem>
);

export default AccordionSection;
