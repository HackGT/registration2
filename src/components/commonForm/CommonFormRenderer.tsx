import Form from "@rjsf/chakra-ui";
import React, { useMemo } from "react";
import { JSONSchema7 } from "json-schema";

import ObjectFieldTemplate from "./ObjectFieldTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";
import { CommonFormProps } from "./CommonForm";

const CommonForm: React.FC<CommonFormProps> = props => {
  // Need to use this memo function to include the common definitions schema. These
  // definitions don't show up in the editor
  const combinedSchema = useMemo(() => {
    const schema = JSON.parse(props.schema);
    schema.definitions = JSON.parse(props.commonDefinitionsSchema);
    return schema as JSONSchema7;
  }, [props.schema, props.commonDefinitionsSchema]);
  const uiSchema: JSONSchema7 = useMemo(() => JSON.parse(props.uiSchema), [props.uiSchema]);

  return (
    <Form
      {...props}
      schema={combinedSchema}
      uiSchema={uiSchema}
      ObjectFieldTemplate={ObjectFieldTemplate}
      fields={{ select: SelectFieldTemplate }}
      noHtml5Validate
      showErrorList={false}
    >
      {props.children}
    </Form>
  );
};

export default CommonForm;