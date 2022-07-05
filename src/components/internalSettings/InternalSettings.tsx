/* eslint-disable no-underscore-dangle */
import React from "react";
import { Accordion, Box, Stack, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";

import AccordionSection from "./AccordionSection";
import Loading from "../../util/Loading";
import FormModal from "./FormModal";
import axios, { AxiosError } from "axios";

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
  const toast = useToast();
  const createBranch = async (values: Partial<Branch>) => {
    const createdBranch: Partial<Branch> = {
      name: values.name,
      hexathon: hexathonId,
      type: values.type,
      settings: {
        open: values.settings?.open || "",
        close: values.settings?.close || "",
      },
    };
    try {
      await axios.post(`https://registration.api.hexlabs.org/branches/`, { ...createdBranch });
      toast({
        title: "Success!",
        description: "The branch has successfully been created.",
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
  const newBranch: any = {
    name: "",
    hexathon: hexathonId!,
    type: null,
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
      <Box marginBlock={10} style={{ marginLeft: "2.5rem" }}>
        <FormModal {...newBranch} updateBranch={createBranch} />
      </Box>
    </Stack>
  );
};

export default InternalSettings;
