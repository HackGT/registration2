import React, { FormEvent, useState } from "react";
import { Box, Button, Flex, Stack } from "@chakra-ui/react";
import Form from "@rjsf/chakra-ui";
import { JSONSchema7 } from "json-schema";

import ObjectFieldTemplate from "./ObjectFieldTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";
import axios from "axios";
import internal from "stream";

axios.defaults.withCredentials = true;
interface props {
  formData: string;
  formPageNumber: number;
  setFormPageNumber: React.Dispatch<React.SetStateAction<number>>
  setFormData: React.Dispatch<React.SetStateAction<string>>;
  schema: string;
  uiSchema: string;
  applicationId: string;
  lastPage: boolean;
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormPage = ({ formData, formPageNumber, setFormPageNumber, setFormData, schema, uiSchema, applicationId, lastPage, setSubmit }: props) => {

  const saveData = async () =>
    await axios.post(`https://registration.api.hexlabs.org/application/${applicationId}/actions/save-application-data`,
      {
        "applicationData": formData,
        "branchFormPage": 1
      }
    );
  return (
        <Form
          schema={JSON.parse(schema)}
          uiSchema={JSON.parse(uiSchema)}
          formData={JSON.parse(formData)}
          onChange={(val: any, event: any) => {
            setFormData(JSON.stringify(val.formData, null, 2));
          }}
          ObjectFieldTemplate={ObjectFieldTemplate}
          fields={{ select: SelectFieldTemplate }}
          onSubmit={async ({ formData }, e) => {
            e.preventDefault();
            await saveData()
            if (lastPage) {
              setSubmit(true)
            }
            setFormPageNumber(formPageNumber+1);
          }
          }
        >
          <Button colorScheme='purple' type="submit" width="100%">Next</Button>
        </Form>
  );
};

export default FormPage;
