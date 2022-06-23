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

import { Branch } from "./InternalSettings";

const AccordionSection: React.FC<Branch> = props => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const saveBranch = async (values: Partial<Branch>) => {
    await axios.patch(`https://registration.api.hexlabs.org/branches/${props._id}`, { ...values });
  };

  return (
    <form onSubmit={handleSubmit(saveBranch)}>
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
          <Select defaultValue={props.type} {...register("type")}>
            <option value="APPLICATION">Application</option>
            <option value="CONFIRMATION">Confirmation</option>
          </Select>
          <InputGroup>
            <Input
              width="15rem"
              placeholder={props.settings.open}
              size="sm"
              {...register("settings.open")}
            />
            <Input
              width="15rem"
              placeholder={props.settings.close}
              size="sm"
              {...register("settings.close")}
            />
          </InputGroup>
          <Button
            colorScheme="purple"
            size="sm"
            width="80px"
            isLoading={isSubmitting}
            type="submit"
          >
            Save
          </Button>
        </AccordionPanel>
      </AccordionItem>
    </form>
  );
};

export default AccordionSection;
