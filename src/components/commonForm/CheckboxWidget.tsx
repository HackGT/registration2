import React from "react";
import { Checkbox, FormControl } from "@chakra-ui/react";
import { WidgetProps } from "@rjsf/core";

import RenderMarkdown from "./RenderMarkdown";

const CheckboxWidget: React.FC<WidgetProps> = props => {
  const { id, value, disabled, readonly, onChange, onBlur, onFocus, required, label } = props;

  const _onChange = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) =>
    onChange(checked);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement | any>) =>
    onBlur(id, value);
  const _onFocus = ({ target: { value } }: React.FocusEvent<HTMLInputElement | any>) =>
    onFocus(id, value);

  return (
    <FormControl mb={1} isRequired={required}>
      <Checkbox
        id={id}
        name={id}
        isChecked={typeof value === "undefined" ? false : value}
        isDisabled={disabled || readonly}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
      >
        {label && <RenderMarkdown>{label}</RenderMarkdown>}
      </Checkbox>
    </FormControl>
  );
};

export default CheckboxWidget;
