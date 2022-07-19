/* eslint-disable no-underscore-dangle */
import { Tabs, TabList, Tab, TabPanels, TabPanel, Text, Heading, useToast } from "@chakra-ui/react";
import axios from "axios";
import useAxios from "axios-hooks";
import React from "react";
import { useParams } from "react-router-dom";

import Loading from "../../util/Loading";
import BranchFormCreator from "./BranchFormCreator";

const BranchEditor: React.FC = () => {
  const { branchId } = useParams();
  const toast = useToast();

  const [{ data, loading, error }] = useAxios(
    `https://registration.api.hexlabs.org/branches/${branchId}`
  );

  if (loading || error) {
    return <Loading />;
  }

  const handleSaveFormPage = async (updatedFormPage: any, formPageIndex: number) => {
    const updatedFormPages: any[] = [...data.formPages];
    updatedFormPages.splice(formPageIndex, 1, updatedFormPage);

    try {
      await axios.patch(`https://registration.api.hexlabs.org/branches/${branchId}`, {
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
              <Tab key={formPage._id}>{formPage.title}</Tab>
            ))}
          </TabList>

          <TabPanels>
            {data.formPages.map((formPage: any, index: number) => (
              <TabPanel key={formPage._id}>
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
