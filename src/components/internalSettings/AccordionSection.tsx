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

import { Branch, BranchType } from "./InternalSettings";
import FormModal from "./FormModal";

export interface FormModalType {
  _id?: string;
  name: string;
  hexathon: string;
  type: BranchType;
  settings: {
    open: string;
    close: string;
  };
  buttonName: string;
  updateBranch: (values: Partial<Branch>) => void;
}

const AccordionSection: React.FC<Branch> = props => {
  const toast = useToast();
  const saveBranch = async (values: Partial<Branch>) => {
    try {
      await axios.patch(`https://registration.api.hexlabs.org/branches/${props._id}`, {
        ...values,
      });
      toast({
        title: "Success!",
        description: "The branch has successfully been edited.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (e: any) {
      console.log(e.message);
      toast({
        title: "Error!",
        description: "One or more entries are invalid. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
        <AccordionPanel pb={4}>
          <VStack align="left">
            <Text>Type: {props.type === "APPLICATION" ? "Application" : "Confirmation"}</Text>
            <Text align="left">
              Open Time:{" "}
              {DateTime.fromISO(props.settings.open, { zone: "utc" }).toLocaleString(
                DateTime.DATETIME_SHORT
              )}
            </Text>
            <Text>
              Close Time:{" "}
              {DateTime.fromISO(props.settings.close, { zone: "utc" }).toLocaleString(
                DateTime.DATETIME_SHORT
              )}
            </Text>
          </VStack>
          <FormModal {...props} buttonName="Edit" updateBranch={saveBranch} />
        </AccordionPanel>
      </AccordionItem>
    </Box>
  );
};

export default AccordionSection;
