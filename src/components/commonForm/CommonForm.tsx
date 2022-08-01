/* eslint-disable no-param-reassign */
import { FormProps } from "@rjsf/core";
import React, { useMemo } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Text, VStack } from "@chakra-ui/react";
import { JSONSchema7 } from "json-schema";
import Form from "@rjsf/chakra-ui";

import ObjectFieldTemplate from "./ObjectFieldTemplate";
import SelectField from "./fields/SelectField";
import FileUploadField from "./fields/FileUploadField";
import CheckboxWidget from "./widgets/CheckboxWidget";
import EssayWidget from "./widgets/EssayWidget";

function transformErrors(errors: any[]) {
  return errors.map((error: any) => {
    if (
      error.message === "should be equal to constant" ||
      error.message === "should match exactly one schema in oneOf" ||
      error.message === "should match some schema in anyOf"
    ) {
      error.message = "";
    } else if (
      error.message === "should be equal to one of the allowed values" ||
      error.message === "is a required property"
    ) {
      error.message = "Please fill out this field";
    } else if (error.message === "should NOT be shorter than 10 characters") {
      error.message = "This field must be at least 10 characters long";
    } else if (error.message === `should match format "email"`) {
      error.message = "Please enter a valid email address";
    } else if (error.message === `should match format "uri"`) {
      error.message = "Please enter a valid URL";
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
        fields={{ select: SelectField, file: FileUploadField }}
        widgets={{
          checkbox: CheckboxWidget,
          essay: EssayWidget,
        }}
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
