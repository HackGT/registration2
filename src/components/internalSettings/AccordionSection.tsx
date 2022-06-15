import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Input,
  InputGroup,
  Select,
} from "@chakra-ui/react";
import React from "react";

const AccordionSection: React.FC = (props: any) => {
  const updateBranches = () => {
    const selectId = `type${props.id}`;
    const openTimeId = `open${props.id}`;
    const closeTimeId = `close${props.id}`;

    const updatedBranchBody = {
      type: (document.getElementById(selectId) as HTMLSelectElement).value,
      settings: {
        open:
          (document.getElementById(openTimeId) as HTMLInputElement).value || props.settings.open,
        close:
          (document.getElementById(closeTimeId) as HTMLInputElement).value || props.settings.close,
      },
    };
    const newBranchDict = props.branchDict;
    newBranchDict[props.id] = updatedBranchBody;
    props.setBranchDict({ ...newBranchDict });
  };
  return (
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
        <Select id={`type${props.id}`} defaultValue={props.type} onChange={updateBranches}>
          <option value="APPLICATION">Application</option>
          <option value="CONFIRMATION">Confirmation</option>
        </Select>
        <InputGroup>
          <Input
            id={`open${props.id}`}
            width="15rem"
            placeholder={props.settings.open}
            size="sm"
            onChange={updateBranches}
          />
          <Input
            id={`close${props.id}`}
            width="15rem"
            placeholder={props.settings.close}
            size="sm"
            onChange={updateBranches}
          />
        </InputGroup>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default AccordionSection;
