import React, { useState } from "react";
import { Box, Button, ButtonGroup, Stack, Flex } from "@chakra-ui/react";
import Form from "@rjsf/chakra-ui";
import { JSONSchema7 } from "json-schema";

import defaultFormSchema from "./Essay_Schemas/defaultFormSchema.json";
import defaultFormUISchema from "./Essay_Schemas/defaultFormUISchema.json";
import defaultFormData from "./Essay_Schemas/defaultFormData.json";
import SchemaInput from "./SchemaInput";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";


interface props {
  setFormPage: (value: number | ((prevVar: number) => number)) => void;
  essayData: string;
  setEssayData: React.Dispatch<React.SetStateAction<string>>;
  schema: {string: string};
  uiSchema: {string: string};
}


const EssayPage = ({ setFormPage, essayData, setEssayData, schema, uiSchema }: props) => {
  const [formSchema, setFormSchema] = useState(JSON.stringify(defaultFormSchema, null, 2));
  const [formUISchema, setFormUISchema] = useState(JSON.stringify(defaultFormUISchema, null, 2));

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
            <Button width="100%" colorScheme='purple' type="submit" onClick={() => setFormPage(1)}>Previous</Button>
            <Button width="100%" colorScheme='purple' type="submit" onClick={() => setFormPage(3)}>Next</Button>
          </ButtonGroup>
        </Form>
      </Flex>
    </Flex>
  );
};

export default EssayPage;
