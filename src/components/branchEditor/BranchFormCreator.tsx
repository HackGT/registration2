import React, { useMemo, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Stack,
} from "@chakra-ui/react";
import { JSONSchema7 } from "json-schema";

import defaultJsonSchema from "./defaultSchemas/defaultJsonSchema.json";
import defaultUiSchema from "./defaultSchemas/defaultUiSchema.json";
import CommonForm from "../commonForm/CommonForm";
import SchemaInput from "./SchemaInput";

interface Props {
  formPage: any;
  formPageIndex: number;
  handleSaveFormPage: (updatedFormPage: any, formPageIndex: number) => Promise<void>;
  commonDefinitionsSchema: string;
}

const BranchFormCreator: React.FC<Props> = props => {
  const [jsonSchema, setJsonSchema] = useState(
    props.formPage.jsonSchema ?? JSON.stringify(defaultJsonSchema, null, 2)
  );
  const [uiSchema, setUiSchema] = useState(
    props.formPage.uiSchema ?? JSON.stringify(defaultUiSchema, null, 2)
  );
  const [formData, setFormData] = useState("{}");
  const [loading, setLoading] = useState(false);

  const handleSaveFormPage = async () => {
    const updatedFormPage = {
      title: props.formPage.title,
      jsonSchema,
      uiSchema,
    };
    setLoading(true);
    await props.handleSaveFormPage(updatedFormPage, props.formPageIndex);
    setLoading(false);
  };

  // Need to use this memo function to include the common definitions schema. These
  // definitions don't show up in the editor
  const combinedJsonSchema = useMemo(() => {
    const schema = JSON.parse(jsonSchema);
    schema.definitions = JSON.parse(props.commonDefinitionsSchema);
    return schema as JSONSchema7;
  }, [jsonSchema, props.commonDefinitionsSchema]);

  return (
    <>
      <Button onClick={handleSaveFormPage} colorScheme="purple" isLoading={loading}>
        Save Form Page
      </Button>
      <Box marginTop="20px">
        <Stack
          width={{ base: "100%", md: "55%" }}
          display="inline-block"
          paddingRight={{ base: "0px", md: "20px" }}
        >
          <Alert status="info">
            <AlertIcon />
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>
              Right click inside the editor for more tools like JSON formatting.
            </AlertDescription>
          </Alert>
          <SchemaInput title="JSON Schema" schema={jsonSchema} setSchema={setJsonSchema} />
          <SchemaInput title="UI Schema" schema={uiSchema} setSchema={setUiSchema} />
          <SchemaInput title="Test Form Data" schema={formData} setSchema={setFormData} />
        </Stack>
        <Box
          padding="15px"
          verticalAlign="top"
          width={{ base: "100%", md: "45%" }}
          height="100%"
          display="inline-block"
        >
          <CommonForm
            schema={combinedJsonSchema}
            uiSchema={JSON.parse(uiSchema)}
            formData={JSON.parse(formData)}
            onChange={(val: any, event: any) => {
              setFormData(JSON.stringify(val.formData, null, 2));
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default BranchFormCreator;
