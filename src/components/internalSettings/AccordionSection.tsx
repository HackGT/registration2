import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Input,
  InputGroup,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import React from "react";
import axios from "axios";

const AccordionSection: React.FC = (props: any) => {
  const { register, watch } = useForm();
  const saveBranch = async () => {
    axios.patch(
      `https://registration.api.hexlabs.org/branches/${props.id}`,
      props.branchDict[props.id]
    );
  };
  const updateBranches = () => {
    const updatedBranchBody = {
      type: watch("type") || props.type,
      settings: {
        open: watch("settings.open") || props.settings.open,
        close: watch("settings.close") || props.settings.close,
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
        <Select defaultValue={props.type} {...register("type")} onChange={updateBranches}>
          <option value="APPLICATION">Application</option>
          <option value="CONFIRMATION">Confirmation</option>
        </Select>
        <InputGroup>
          <Input
            width="15rem"
            placeholder={props.settings.open}
            size="sm"
            {...register("settings.open")}
            onChange={updateBranches}
          />
          <Input
            width="15rem"
            placeholder={props.settings.close}
            size="sm"
            {...register("settings.close")}
            onChange={updateBranches}
          />
        </InputGroup>
        <Button colorScheme="purple" size="sm" width="80px" onClick={saveBranch}>
          Save
        </Button>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default AccordionSection;
