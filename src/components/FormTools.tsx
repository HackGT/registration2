import React, { useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import Form from "@rjsf/chakra-ui";
import { JSONSchema7 } from "json-schema";

import defaultFormSchema from "../defaultSchemas/defaultFormSchema.json";
import defaultFormUISchema from "../defaultSchemas/defaultFormUISchema.json";
import defaultFormData from "../defaultSchemas/defaultFormData.json";
import SchemaInput from "./SchemaInput";
import FormFieldTemplate from "./ObjectFieldTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";

const FormTools: React.FC<any> = (props: any) => {
  const [formSchema, setFormSchema] = useState(JSON.stringify(defaultFormSchema, null, 2));
  const [formUISchema, setFormUISchema] = useState(JSON.stringify(defaultFormUISchema, null, 2));
  const [formData, setFormData] = useState(JSON.stringify(defaultFormData, null, 2));

  return (
    <Box margin="30px">
      <Stack
        width={{ base: "100%", md: "55%" }}
        display="inline-block"
        paddingRight={{ base: "0px", md: "30px" }}
      >
        <SchemaInput title="JSONSchema" schema={formSchema} setSchema={setFormSchema} />
        <Box display="flex" justifyContent="space-between">
          <SchemaInput
            width="48.5%"
            display="inline-block"
            title="UISchema"
            schema={formUISchema}
            setSchema={setFormUISchema}
          />
          <SchemaInput
            width="48.5%"
            display="inline-block"
            title="formData"
            schema={formData}
            setSchema={setFormData}
          />
        </Box>
      </Stack>
      <Box
        padding="15px"
        verticalAlign="top"
        width={{ base: "100%", md: "45%" }}
        height="100%"
        display="inline-block"
      >
        <Form
          schema={JSON.parse(formSchema) as JSONSchema7}
          uiSchema={JSON.parse(formUISchema)}
          formData={JSON.parse(formData)}
          onChange={(val: any, event: any) => {
            setFormData(JSON.stringify(val.formData, null, 2));
          }}
          ObjectFieldTemplate={FormFieldTemplate}
          fields={{ select: SelectFieldTemplate }}
        />
      </Box>
    </Box>
  );
};

export default FormTools;
