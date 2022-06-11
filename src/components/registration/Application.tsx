import React, { useEffect, useState } from "react";
import { ChakraProvider, Flex, theme } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "../../contexts/AuthContext";
import { useLogin } from "../../hooks/useLogin";
import FormPage from "../formPlayground/FormPage";
import EssayPage from "../formPlayground/EssayPage";
import ExtraInfoPage from "../formPlayground/ExtraInfoPage"
import SubmittedPage from "../formPlayground/SubmittedPage"
import defaultFormData from "../formPlayground/Form_Schemas/defaultFormData.json";
import defaultEssayData from "../formPlayground/Essay_Schemas/defaultFormData.json";

import Admin from "../dashboard/Dashboard";
import User from "../user/User";

axios.defaults.withCredentials = true;

const Application: React.FC = () => {
  const [loading, loggedIn] = useLogin();
  const {branchId} = useParams();
  const [formPage, setFormPage] = useState(1);
  const [formData, setFormData] = useState(JSON.stringify(defaultFormData, null, 2));
  const [essayData, setEssayData] = useState(JSON.stringify(defaultEssayData, null, 2));
  const [extraInfoData, setExtraInfoData] = useState("");
  const [submit, setSubmit] = useState(false)
  const [formSchema, setFormSchema] = useState();
  const [formUISchema, setFormUISchema] = useState();
  const [essaySchema, setEssaySchema] = useState();
  const [essayUISchema, setEssayUISchema] = useState();


  // TODO: get application branch 
  // branch = axios.get("registration.api.hexlabs.org/applications/"+id)
  // branch.applicationBranch.formPages...
  // fetch branch data
  useEffect(() => {
    const fetchBranchData = async () => {
      const response = await axios.get("https://registration.api.hexlabs.org/branches"+branchId);
      const formPages = response.data.formPages
      setFormSchema(formPages[0].jsonSchema)
      setFormUISchema(formPages[0].uiSchema)
      setEssaySchema(formPages[1].jsonSchema)
      setEssayUISchema(formPages[1].uiSchema)
    }

    fetchBranchData()

  }, []);

  useEffect(() => {
    const submitApp = async () => {
      const appData = JSON.parse(formData)
      appData.essays = JSON.parse(essayData)
      appData.extraInfo = { "extra": extraInfoData }
      // save and submit application
      await axios.post("", JSON.stringify(appData))
      setFormPage(4)
    }
    if (submit) {
      submitApp()
    }
  }, [submit])




  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!loggedIn) {
    window.location.href = `https://login.hexlabs.org?redirect=${window.location.href}`;
    return <h1>Loading...</h1>;
  }


  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Flex
          align="center"
          justify="center"
          direction="column"
          fontFamily="verdana"
        >
          {formPage == 1 && <FormPage
            setFormPage={setFormPage}
            formData={formData}
            setFormData={setFormData}
            schema = {formSchema}
            uiSchema = {formUISchema}

          />}

          {formPage == 2 && <EssayPage
            setFormPage={setFormPage}
            essayData={essayData}
            setEssayData={setEssayData}
            schema = {essaySchema}
            uiSchema = {essayUISchema}
          />}
          {formPage == 3 && <ExtraInfoPage
            setFormPage={setFormPage}
            extraInfoData={extraInfoData}
            setExtraInfoData={setExtraInfoData}
            setSubmit={setSubmit}
          />}
          {formPage == 4 && <SubmittedPage />}
        </Flex>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default Application;