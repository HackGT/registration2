import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  useToast,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import axios from "axios";
import { DateTime } from "luxon";

interface IProps {
  name: string;
  data: object;
}

const AccordionSection: React.FC<IProps> = props => {
  const lol = "lol";
  return (
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
        <AccordionPanel pb={4} />
      </AccordionItem>
    </Box>
  );
};

export default AccordionSection;
