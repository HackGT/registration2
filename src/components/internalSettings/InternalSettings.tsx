/* eslint-disable no-underscore-dangle */
import React from "react";
import { Accordion, Box, Stack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";

import AccordionSection from "./AccordionSection";
import Loading from "../../util/Loading";
import FormModal from "./FormModal";
import axios from "axios";

export enum BranchType {
  APPLICATION = "APPLICATION",
  CONFIRMATION = "CONFIRMATION",
}

export interface Branch {
  _id: string;
  name: string;
  hexathon: string;
  type: BranchType;
  settings: {
    open: string;
    close: string;
  };
  formPages: {
    title: string;
    jsonSchema: string;
    uiSchema: string;
  }[];
}

const InternalSettings: React.FC = () => {
  const { hexathonId } = useParams();
  const createBranch = async (values: Partial<Branch>) => {
    console.log(`enters createBranch`);
    const createdBranch: Partial<Branch> = {
      name: values.name,
      hexathon: hexathonId,
      type: values.type,
      settings: {
        open: values.settings?.open || "",
        close: values.settings?.close || "",
      },
    };
    await axios.post(`https://registration.api.hexlabs.org/branches/`, { ...createdBranch });
  };
  const newBranch: any = {
    name: "",
    hexathon: hexathonId!,
    type: BranchType.APPLICATION,
    settings: {
      open: "",
      close: "",
    },
    functionName: "Create Branch",
    buttonName: "Create",
  };

  const [{ data: branches, loading, error }] = useAxios(
    `https://registration.api.hexlabs.org/branches/?hexathon=${hexathonId}`
  );

  if (loading) return <Loading />;
  if (error) console.log(error.message);
  return (
    <Stack>
      <Accordion allowToggle>
        {branches.map((branch: Branch) => (
          <AccordionSection {...branch} />
        ))}
      </Accordion>
      <Box margin={10}>
        <FormModal {...newBranch} function={createBranch} />
      </Box>
    </Stack>
  );
};

export default InternalSettings;
