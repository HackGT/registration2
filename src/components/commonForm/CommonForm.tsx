import Form, { FormProps } from "@rjsf/core";
import React from "react";

import ObjectFieldTemplate from "./ObjectFieldTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";

interface Props extends FormProps<any> {}

const CommonForm: React.FC<Props> = props => (
  <Form
    {...props}
    ObjectFieldTemplate={ObjectFieldTemplate}
    fields={{ select: SelectFieldTemplate }}
    noHtml5Validate
    showErrorList={false}
  >
    {props.children}
  </Form>
);

export default CommonForm;
