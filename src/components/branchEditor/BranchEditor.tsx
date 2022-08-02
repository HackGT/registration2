import { Tabs, TabList, Tab, TabPanels, TabPanel, Text, Heading, useToast } from "@chakra-ui/react";
import { ErrorScreen, LoadingScreen } from "@hex-labs/core";
import axios from "axios";
import useAxios from "axios-hooks";
import React from "react";
import { useParams } from "react-router-dom";

import { apiUrl, Service } from "../../util/apiUrl";
import BranchFormCreator from "./BranchFormCreator";

const BranchEditor: React.FC = () => {
  const { branchId } = useParams();
  const toast = useToast();

  const [{ data, loading, error }] = useAxios(
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
  };

  return (
    <>
      <Heading>{data.name}</Heading>
      {data.formPages.length > 0 ? (
        <Tabs>
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
                  commonDefinitionsSchema={data.commonDefinitionsSchema}
                />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : (
        <Text>No form pages created yet. Use the button above to make one!</Text>
      )}
    </>
  );
};

export default BranchEditor;
