import React, { FormEvent, useState } from "react";
import { Box, Button, Flex, Stack } from "@chakra-ui/react";
import Form from "@rjsf/chakra-ui";
import { JSONSchema7 } from "json-schema";

import defaultFormSchema from "./Form_Schemas/defaultFormSchema.json";
import defaultFormUISchema from "./Form_Schemas/defaultFormUISchema.json";
import defaultFormData from "./Form_Schemas/defaultFormData.json";
import SchemaInput from "./SchemaInput";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";
// interface IButtonPropList {
//   label: string
//   type: 'button' | 'submit' | 'reset'
//   click: (e: FormEvent<HTMLInputElement>) => void
//   disabled: boolean
// }
interface props {
  setFormPage: (value: number | ((prevVar: number) => number)) => void;
  formData: string;
  setFormData: React.Dispatch<React.SetStateAction<string>>;
  schema: {string: string};
  uiSchema: {string: string};
}

// const Button = ({ label, click, type, disabled }: IButtonPropList) =>
const FormPage = ({setFormPage, formData, setFormData, schema, uiSchema}:props) => {
  const [formSchema, setFormSchema] = useState(JSON.stringify(defaultFormSchema, null, 2));
  const [formUISchema, setFormUISchema] = useState(JSON.stringify(defaultFormUISchema, null, 2));
  // const [formData, setFormData] = useState(JSON.stringify(defaultFormData, null, 2));
  // const handleSubmit = (e: FormEvent): void => {
  //   e.preventDefault();
  //   setFormPage(2);
  // };

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
          onSubmit = {({formData}, e) => {
            e.preventDefault();
            setFormPage(2);
            console.log("Data submitted: ",  formData)}
          }
        >
          <Button colorScheme='purple' type="submit" width="100%">Next</Button>      
        </Form>
      </Flex>
    </Flex>
  );
};

export default FormPage;
