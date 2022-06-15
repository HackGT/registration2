import React, { useEffect, useState } from "react";
import { ChakraProvider, Flex, theme } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { AuthProvider } from "../../contexts/AuthContext";
import { useLogin } from "../../hooks/useLogin";
import FormPage from "../formPlayground/FormPage";
import EssayPage from "../formPlayground/EssayPage";
import ExtraInfoPage from "../formPlayground/ExtraInfoPage"
import SubmittedPage from "../formPlayground/SubmittedPage"

axios.defaults.withCredentials = true;

interface props {
  applicationId: string;
}

const Application = ({ applicationId }: props) => {
  const convertToDefaultData = (uiSchema: string) => (Object.assign({}, ...Object.keys(JSON.parse(uiSchema)).map((x) => ({ [x]: "" }))));
  const [loading, loggedIn] = useLogin();
  const { branchId } = useParams();
  const [formPage, setFormPage] = useState(1);
  const [submit, setSubmit] = useState(false)

  const [formSchema, setFormSchema] = useState("");
  const [formUISchema, setFormUISchema] = useState("");
  const [essaySchema, setEssaySchema] = useState("");
  const [essayUISchema, setEssayUISchema] = useState("");
  const [branch, setBranch] = useState("")
  const [formData, setFormData] = useState("")
  const [essayData, setEssayData] = useState("")


  useEffect(() => {
    const fetchBranchData = async () => {
      const { data: { formPages: formPages, name: branch } } = await axios.get(`https://registration.api.hexlabs.org/branches/${branchId}`);
      setBranch(branch)
      setFormSchema(JSON.stringify(formPages[0].jsonSchema, null, 2))
      setFormUISchema(JSON.stringify(formPages[0].uiSchema, null, 2))
      setFormData(convertToDefaultData(formPages[0].uiSchema))
      setEssaySchema(JSON.stringify(formPages[1].jsonSchema, null, 2))
      setEssayUISchema(JSON.stringify(formPages[1].uiSchema, null, 2))
      setEssayData(convertToDefaultData(formPages[1].uiSchema))
    }

    fetchBranchData()

  }, []);

  useEffect(() => {
    const submitApp = async () => {
      const response = await axios.post(`https://registration.api.hexlabs.org/application/${applicationId}/actions/submit-application`)
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
            formData={formData}
            setFormData={setFormData}
            setFormPage={setFormPage}
            schema={formSchema}
            uiSchema={formUISchema}
            applicationId={applicationId}
          />}

          {formPage == 2 && <EssayPage
            essayData={essayData}
            setEssayData={setEssayData}
            setFormPage={setFormPage}
            schema={essaySchema}
            uiSchema={essayUISchema}
            applicationId={applicationId}
          />}

          {formPage == 3 && <ExtraInfoPage
            setFormPage={setFormPage}
            setSubmit={setSubmit}
            branch={branch}
            applicationId={applicationId}
          />}

          {formPage == 4 && <SubmittedPage />}
        </Flex>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default Application;