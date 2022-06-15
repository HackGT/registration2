import React, { useState } from "react";
import { Button, ButtonGroup, Flex } from "@chakra-ui/react";
import Form from "@rjsf/chakra-ui";

import defaultEssaySchema from "./Essay_Schemas/defaultFormSchema.json";
import defaultEssayUISchema from "./Essay_Schemas/defaultFormUISchema.json";
import defaultEssayData from "./Essay_Schemas/defaultFormData.json";
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


const EssayPage = ({ setFormPage, schema, uiSchema, applicationId }: props) => {
  const [formSchema, setFormSchema] = useState(JSON.stringify(defaultEssaySchema, null, 2));
  const [formUISchema, setFormUISchema] = useState(JSON.stringify(defaultEssayUISchema, null, 2));
  const [essayData, setEssayData] = useState(JSON.stringify(defaultEssayData, null, 2));

  const saveEssayPage = async (nextPage: number) => {
    const response = await axios.post(`https://registration.api.hexlabs.org/application/${applicationId}/actions/save-application-data`,
      {
        "applicationData": essayData,
        "branchFormPage": 2
      }

    );
    console.log("saved essay data")
    console.log(essayData)

    setFormPage(nextPage)
  }
  return (
    <Flex align="center" justify="center" direction="column">
      <Flex
        padding="15px"
        verticalAlign="top"
        width={{ base: "100%", md: "45%" }}
        height="100%"
        display="inline-block"
        align="center"
        justify="center"
        direction="column"
      >
        <Form
          schema={JSON.parse(formSchema)}
          uiSchema={JSON.parse(formUISchema)}
          formData={JSON.parse(essayData)}
          onChange={(val: any, event: any) => {
            setEssayData(JSON.stringify(val.formData, null, 2));
          }}
          ObjectFieldTemplate={ObjectFieldTemplate}
          fields={{ select: SelectFieldTemplate }}
          onSubmit={({ formData }, e) => {
            e.preventDefault();
            console.log("Data submitted: ", formData)
          }
          }

        >
          <ButtonGroup
            width="100%"
            spacing='6'
          >
            <Button width="100%" colorScheme='purple' type="submit" onClick={() => saveEssayPage(1)}>Previous</Button>
            <Button width="100%" colorScheme='purple' type="submit" onClick={() => saveEssayPage(3)}>Next</Button>
          </ButtonGroup>
        </Form>
      </Flex>
    </Flex>
  );
};

export default EssayPage;
