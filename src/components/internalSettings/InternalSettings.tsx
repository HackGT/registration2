/* eslint-disable no-underscore-dangle */
import React from "react";
import { Accordion, Stack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";

import AccordionSection from "./AccordionSection";
import Loading from "../../util/Loading";

enum BranchType {
  APPLICATION = "APPLICATION",
  CONFIRMATION = "CONFIRMATION",
}

export interface Branch {
  _id: number;
  name: string;
  hexathon: number;
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
    </Stack>
  );
};

export default InternalSettings;
