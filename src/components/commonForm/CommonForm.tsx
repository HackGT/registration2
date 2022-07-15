import Form from "@rjsf/chakra-ui";
import { FormProps } from "@rjsf/core";
import React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Text, VStack } from "@chakra-ui/react";

import ObjectFieldTemplate from "./ObjectFieldTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";

interface Props extends FormProps<any> {}

const ErrorFallback: React.FC<FallbackProps> = props => (
  <VStack spacing={4} width="100%">
    <Text fontWeight="500">Something went wrong. Please edit the schema to rerender.</Text>
    <Text>{props.error.message}</Text>
  </VStack>
);

const CommonForm: React.FC<Props> = props => (
  <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[props.schema, props.uiSchema]}>
    <Form
      {...props}
      ObjectFieldTemplate={ObjectFieldTemplate}
      fields={{ select: SelectFieldTemplate }}
      noHtml5Validate
      showErrorList={false}
    >
      {props.children}
    </Form>
  </ErrorBoundary>
);

export default CommonForm;
