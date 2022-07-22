/* eslint-disable no-underscore-dangle */
import React, { useState } from "react";
import { Alert, AlertIcon, Box, Button, SimpleGrid, Stack, useDisclosure } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";

import BranchCard from "./BranchCard";
import Loading from "../../../util/Loading";
import BranchFormModal from "./BranchFormModal";

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
    _id: string;
    title: string;
    jsonSchema: string;
    uiSchema: string;
  }[];
}

const BranchSettings: React.FC = () => {
  const { hexathonId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentBranchData, setCurrentBranchData] = useState<any>({});

  const [{ data: branches, loading, error }, refetch] = useAxios(
    `https://registration.api.hexlabs.org/branches/?hexathon=${hexathonId}`
  );

  const handleModalOpen = (defaultValues: Partial<Branch>) => {
    setCurrentBranchData(defaultValues);
    onOpen();
  };

  const handleModalClose = () => {
    setCurrentBranchData({});
    onClose();
  };

  if (loading) return <Loading />;
  if (error) console.log(error.message);

  return (
    <>
      <Box padding="20px">
        <Alert status="info" marginBottom="20px">
          <AlertIcon />
          All times are shown in America/New_York time zone
        </Alert>
        <Button onClick={() => handleModalOpen({})} marginBottom="20px">
          Create Branch
        </Button>
        <Stack>
          <SimpleGrid columns={[1, 1, 2, 3, 4]} spacing="25px">
            {branches.map((branch: Branch) => (
              <BranchCard openModal={handleModalOpen} branch={branch} />
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
      <BranchFormModal
        defaultValues={currentBranchData}
        isOpen={isOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </>
  );
};

export default BranchSettings;
