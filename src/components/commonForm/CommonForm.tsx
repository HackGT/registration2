import { FormProps } from "@rjsf/core";
import React, { useMemo } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Text, VStack } from "@chakra-ui/react";
import { JSONSchema7 } from "json-schema";
import Form from "@rjsf/chakra-ui";

import ObjectFieldTemplate from "./ObjectFieldTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";
import FileUploadFieldTemplate from "./FileUploadFieldTemplate";

function transformErrors(errors: any[]) {
  const updatedErrors = [...errors];
  return errors.map((error: any) => {
    if (
      error.message === "should be equal to constant" ||
      error.message === "should match exactly one schema in oneOf"
    ) {
      error.message = "";
    } else if (
      error.message === "should be number" ||
      error.message === "should be equal to one of the allowed values"
    ) {
      error.message = "This is a required field";
    }
    return error;
  });
}

const ErrorFallback: React.FC<FallbackProps> = props => (
  <VStack spacing={4} width="100%">
    <Text fontWeight="500">Something went wrong. Please edit the schema to rerender.</Text>
    <Text>{props.error.message}</Text>
  </VStack>
);

interface Props extends Omit<FormProps<any>, "schema" | "uiSchema"> {
  schema: string;
  uiSchema: string;
  commonDefinitionsSchema: string;
}

const CommonForm: React.FC<Props> = props => {
  // Need to use this memo function to include the common definitions schema. These
  // definitions don't show up in the editor
  const combinedSchema = useMemo(() => {
    const schema = JSON.parse(props.schema);
    schema.definitions = JSON.parse(props.commonDefinitionsSchema);
    return schema as JSONSchema7;
  }, [props.schema, props.commonDefinitionsSchema]);
  const uiSchema: JSONSchema7 = useMemo(() => JSON.parse(props.uiSchema), [props.uiSchema]);


  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[props.schema, props.uiSchema]}>
      <Form
        {...props}
        schema={combinedSchema}
        uiSchema={uiSchema}
        ObjectFieldTemplate={ObjectFieldTemplate}
        fields={{ select: SelectFieldTemplate, file: FileUploadFieldTemplate }}
        noHtml5Validate
        showErrorList={false}
        transformErrors={transformErrors}
      >
        {props.children}
      </Form>
    </ErrorBoundary>
  );
};

export default CommonForm;
