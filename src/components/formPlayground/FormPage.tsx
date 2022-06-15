import React, { FormEvent, useState } from "react";
import { Box, Button, Flex, Stack } from "@chakra-ui/react";
import Form from "@rjsf/chakra-ui";
import { JSONSchema7 } from "json-schema";

import ObjectFieldTemplate from "./ObjectFieldTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";
import axios from "axios";

axios.defaults.withCredentials = true;
interface props {
  setFormPage: (value: number | ((prevVar: number) => number)) => void;
  formData: string;
  setFormData: React.Dispatch<React.SetStateAction<string>>;
  schema: string;
  uiSchema: string;
  applicationId: string;
}

const FormPage = ({ setFormPage, formData, setFormData, schema, uiSchema, applicationId }: props) => {

  const saveData = async () =>
    await axios.post(`https://registration.api.hexlabs.org/application/${applicationId}/actions/save-application-data`,
      {
        "applicationData": formData,
        "branchFormPage": 1
      }
    );
  return (
    <Flex align="center" justify="center" direction="column">
      <Flex
        padding="15px"
        verticalAlign="top"
        width={{ base: "100%", md: "45%" }}
        height="100%"
        align="center"
        justify="center"
        direction="column"
      >
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
            console.log("saved formpage data")
            console.log(formData)
            setFormPage(2);

          }
          }
        >
          <Button colorScheme='purple' type="submit" width="100%">Next</Button>
        </Form>
      </Flex>
    </Flex>
  );
};

export default FormPage;
