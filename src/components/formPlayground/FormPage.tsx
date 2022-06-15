import React, { useState } from "react";
import { Button, Flex } from "@chakra-ui/react";
import Form from "@rjsf/chakra-ui";

import defaultFormSchema from "./Form_Schemas/defaultFormSchema.json";
import defaultFormUISchema from "./Form_Schemas/defaultFormUISchema.json";
import defaultFormData from "./Form_Schemas/defaultFormData.json";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";
import axios from "axios";

axios.defaults.withCredentials = true;
interface props {
  setFormPage: (value: number | ((prevVar: number) => number)) => void;
  schema: string;
  uiSchema: string;
  applicationId: string;
}

// const Button = ({ label, click, type, disabled }: IButtonPropList) =>
const FormPage = ({ setFormPage, schema, uiSchema, applicationId }: props) => {
  const [formSchema, setFormSchema] = useState(JSON.stringify(defaultFormSchema, null, 2));
  const [formUISchema, setFormUISchema] = useState(JSON.stringify(defaultFormUISchema, null, 2));
  const [formData, setFormData] = useState(JSON.stringify(defaultFormData, null, 2));

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
          schema={JSON.parse(formSchema)}
          uiSchema={JSON.parse(formUISchema)}
          formData={JSON.parse(formData)}
          onChange={(val: any, event: any) => {
            setFormData(JSON.stringify(val.formData, null, 2));
            // console.log(formData)
          }}
          ObjectFieldTemplate={ObjectFieldTemplate}
          fields={{ select: SelectFieldTemplate }}
          onSubmit={async ({ formData }, e) => {
            e.preventDefault();

            const response = await axios.post(`https://registration.api.hexlabs.org/application/${applicationId}/actions/save-application-data`,
              {
                "applicationData": formData,
                "branchFormPage": 1
              }
            );
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
