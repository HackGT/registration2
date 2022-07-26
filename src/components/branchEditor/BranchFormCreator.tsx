import React, { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Link,
  Stack,
  useToast,
  Text,
} from "@chakra-ui/react";

import defaultJsonSchema from "./defaultSchemas/defaultJsonSchema.json";
import defaultUiSchema from "./defaultSchemas/defaultUiSchema.json";
import CommonForm from "../commonForm/CommonForm";
import SchemaInput from "./SchemaInput";
import SchemaOutput from "./SchemaOutput";

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
  const [schemaErrors, setSchemaErrors] = useState<any>({});
  const toast = useToast();

  const handleSaveFormPage = async () => {
    // If JSON schema or UI schema have errors, don't save
    try {
      JSON.parse(jsonSchema);
      JSON.parse(uiSchema);
      console.log(schemaErrors);
      if (Object.values(schemaErrors).includes(true)) throw Error();
    } catch (err) {
      toast({
        title: "Error",
        description:
          "Unable to save form page. Please check your JSON schema and UI schema for errors.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    const updatedFormPage = {
      title: props.formPage.title,
      jsonSchema,
      uiSchema,
    };
    await props.handleSaveFormPage(updatedFormPage, props.formPageIndex);
    setLoading(false);
  };

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
          <Alert status="info">
            <AlertIcon />
            <AlertTitle>Common Definitions</AlertTitle>
            <AlertDescription>
              <Text>
                You can use common definitions to reuse shared dropdown options between forms (like
                school, ethnicity, etc.). Click{" "}
                <Link
                  href="https://github.com/HackGT/api/blob/main/services/registration/src/common/commonDefinitions.ts"
                  target="_blank"
                  rel="noreferrer"
                  isExternal
                  textDecorationLine="underline"
                >
                  here
                </Link>{" "}
                to view the current list.
              </Text>
            </AlertDescription>
          </Alert>
          <SchemaInput
            title="JSON Schema"
            schema={jsonSchema}
            setSchema={setJsonSchema}
            setSchemaErrors={setSchemaErrors}
          />
          <SchemaInput
            title="UI Schema"
            schema={uiSchema}
            setSchema={setUiSchema}
            setSchemaErrors={setSchemaErrors}
          />
          <SchemaOutput title="Test Form Data" schema={formData} />
        </Stack>
        <Box
          padding="15px"
          verticalAlign="top"
          width={{ base: "100%", md: "45%" }}
          height="100%"
          display="inline-block"
        >
          <CommonForm
            schema={jsonSchema}
            uiSchema={uiSchema}
            commonDefinitionsSchema={props.commonDefinitionsSchema}
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
