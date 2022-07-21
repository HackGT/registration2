import { FormProps } from "@rjsf/core";
import React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Text, VStack } from "@chakra-ui/react";

import CommonFormRenderer from "./CommonFormRenderer";

export interface CommonFormProps extends Omit<FormProps<any>, "schema" | "uiSchema"> {
  schema: string;
  uiSchema: string;
  commonDefinitionsSchema: string;
}

const ErrorFallback: React.FC<FallbackProps> = props => (
  <VStack spacing={4} width="100%">
    <Text fontWeight="500">Something went wrong. Please edit the schema to rerender.</Text>
    <Text>{props.error.message}</Text>
  </VStack>
);

const CommonForm: React.FC<CommonFormProps> = props => (
  <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[props.schema, props.uiSchema]}>
    <CommonFormRenderer {...props} />
  </ErrorBoundary>
);

export default CommonForm;
