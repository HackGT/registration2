import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import axios from "axios";

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
  functionName: string;
  buttonName: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  function: any;
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
        description: "The branch could not be edited due to server issues.",
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
          <Box flex="1" textAlign="left" borderWidth={1} padding={1}>
            {props.type === "APPLICATION" ? "Application" : "Confirmation"}
          </Box>
          <InputGroup>
            <Box width="15rem" borderWidth={1} padding={1}>
              {props.settings.open}
            </Box>
            <Box width="15rem" borderWidth={1} padding={1}>
              {props.settings.close}
            </Box>
          </InputGroup>
          <FormModal
            {...props}
            functionName="Edit Branch"
            buttonName="Edit"
            function={saveBranch}
          />
        </AccordionPanel>
      </AccordionItem>
    </Box>
  );
};

export default AccordionSection;
