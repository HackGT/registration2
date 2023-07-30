import { AddIcon } from "@chakra-ui/icons";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Heading,
  useToast,
  Button,
  useDisclosure,
  Box,
  Stack,
} from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import axios from "axios";
import useAxios from "axios-hooks";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import BranchFormCreator from "./BranchFormCreator";
import FormPageModal from "./FormPageModal";

const BranchEditorPage: React.FC = () => {
  const { branchId } = useParams();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFormPageIndex, setSelectedFormPageIndex] = useState(0);
  const [currentFormPageData, setCurrentFormPageData] = useState<any>(null);

  const [{ data, loading, error }, refetch] = useAxios(
    apiUrl(Service.REGISTRATION, `/branches/${branchId}`)
  );

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const handleSaveFormPage = async (updatedFormPage: any, formPageIndex: number) => {
    const updatedFormPages: any[] = [...data.formPages];
    updatedFormPages.splice(formPageIndex, 1, updatedFormPage);

    try {
      await axios.patch(apiUrl(Service.REGISTRATION, `/branches/${branchId}`), {
        formPages: updatedFormPages,
      });
      toast({
        title: "Success",
        description: "Form page updated successfully",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Error updating form page",
        status: "error",
        duration: 3000,
      });
    }
    await refetch();
  };

  const handleDeleteFormPage = async (formPageIndex: number) => {
    const updatedFormPages: any[] = [...data.formPages];
    updatedFormPages.splice(formPageIndex, 1);

    try {
      await axios.patch(apiUrl(Service.REGISTRATION, `/branches/${branchId}`), {
        formPages: updatedFormPages,
      });
      toast({
        title: "Success",
        description: "Form page deleted successfully",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Error deleting form page",
        status: "error",
        duration: 3000,
      });
    }
    await refetch();
  };

  const handleAddFormPage = async () => {
    setCurrentFormPageData(null);
    onOpen();
  };

  const handleEditFormPage = async (formPageIndex: number) => {
    setCurrentFormPageData(data.formPages[formPageIndex]);
    onOpen();
  };

  return (
    <Box p="20px">
      <FormPageModal
        formPageIndex={selectedFormPageIndex}
        defaultValues={currentFormPageData}
        branchId={branchId}
        formPages={data.formPages}
        isOpen={isOpen}
        onClose={onClose}
        refetch={refetch}
      />
      <Stack direction={{ base: "column", sm: "row" }} justifyContent="space-between" mb="2">
        <Heading mb="2">{data.name}</Heading>
        <Button leftIcon={<AddIcon />} onClick={handleAddFormPage}>
          Add Form Page
        </Button>
      </Stack>
      {data.formPages.length > 0 ? (
        <Tabs index={selectedFormPageIndex} onChange={index => setSelectedFormPageIndex(index)}>
          <TabList>
            {data.formPages.map((formPage: any) => (
              <Tab key={formPage.id}>{formPage.title}</Tab>
            ))}
          </TabList>

          <TabPanels>
            {data.formPages.map((formPage: any, index: number) => (
              <TabPanel key={formPage.id}>
                <BranchFormCreator
                  formPage={formPage}
                  formPageIndex={index}
                  handleSaveFormPage={handleSaveFormPage}
                  handleDeleteFormPage={handleDeleteFormPage}
                  handleEditFormPage={handleEditFormPage}
                  commonDefinitionsSchema={data.commonDefinitionsSchema}
                />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : (
        <Text>No form pages created yet. Use the button above to make one!</Text>
      )}
    </Box>
  );
};

export default BranchEditorPage;
