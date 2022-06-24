import React, { useEffect, useState } from "react";
import { ChakraProvider, Flex, theme } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { AuthProvider } from "../../contexts/AuthContext";
import { useLogin } from "../../hooks/useLogin";
import FormPage from "../formPlayground/FormPage";
import SubmittedPage from "../formPlayground/SubmittedPage"

axios.defaults.withCredentials = true;

interface props {
  applicationId: string;
}

const Application = ({ applicationId }: props) => {
  const convertToDefaultData = (uiSchema: string) => (Object.assign({}, ...Object.keys(JSON.parse(uiSchema)).map((x) => ({ [x]: "" }))));
  const [loading, loggedIn] = useLogin();
  const { branchId } = useParams();
  const [formPageNumber, setFormPageNumber] = useState(1);
  const [submit, setSubmit] = useState(false)

  const [branch, setBranch] = useState("")
  const [formData, setFormData] = useState("")
  const [formPages, setFormPages] = useState([{jsonSchema:'', uiSchema:''}])


  useEffect(() => {
    const fetchBranchData = async () => {
      const { data: { formPages: formPages, name: branch } } = await axios.get(`https://registration.api.hexlabs.org/branches/${branchId}`);
      setBranch(branch)
      setFormPages(formPages)
    }

    fetchBranchData()

  }, []);

  useEffect(() => {
    const submitApp = async () => {
      const response = await axios.post(`https://registration.api.hexlabs.org/application/${applicationId}/actions/submit-application`)
      setFormPageNumber(formPages.length)
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
          <FormPage
            formData={formData}
            setFormData={setFormData}
            setFormPageNumber={setFormPageNumber}
            formPageNumber={formPageNumber}
            schema={JSON.stringify(formPages[formPageNumber].jsonSchema, null, 2)}
            uiSchema={JSON.stringify(formPages[formPageNumber].uiSchema, null, 2)}
            applicationId={applicationId}
            lastPage = {formPageNumber==formPages.length-1}
            setSubmit = {setSubmit}
          />

          {formPageNumber == formPages.length && <SubmittedPage />}
        </Flex>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default Application;