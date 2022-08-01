/* eslint-disable no-underscore-dangle */
import React from "react";
import { Checkbox, FormControl } from "@chakra-ui/react";
import { WidgetProps } from "@rjsf/core";

import RenderMarkdown from "../RenderMarkdown";

const CheckboxWidget: React.FC<WidgetProps> = props => {
  const _onChange = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) =>
    props.onChange(checked);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement | any>) =>
    props.onBlur(props.id, value);
  const _onFocus = ({ target: { value } }: React.FocusEvent<HTMLInputElement | any>) =>
    props.onFocus(props.id, value);

  return (
    <FormControl mb={1} isRequired={props.required}>
      <Checkbox
        id={props.id}
        name={props.id}
        isChecked={typeof props.value === "undefined" ? false : props.value}
        isDisabled={props.disabled || props.readonly}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
      >
        {props.label && <RenderMarkdown>{props.label}</RenderMarkdown>}
      </Checkbox>
    </FormControl>
  );
};

export default CheckboxWidget;
