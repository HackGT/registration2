import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Table,
  TableContainer,
} from "@chakra-ui/react";
import React from "react";

interface IProps {
  name: string;
  small?: string;
  children: React.ReactNode | React.ReactNode[];
}

const AccordionSection: React.FC<IProps> = props => (
  <AccordionItem>
    <h2>
      <AccordionButton paddingY="15px">
        <Box flex="1" textAlign="left">
          <Heading size="md">{props.name}</Heading>
          {props.small && (
            <Box fontSize="sm" color="gray.500">
              {props.small}
            </Box>
          )}
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      <TableContainer>
        <Table variant="simple">{props.children}</Table>
      </TableContainer>
    </AccordionPanel>
  </AccordionItem>
);

export default AccordionSection;
