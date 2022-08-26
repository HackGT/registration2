/* eslint-disable no-underscore-dangle */
import React from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { WidgetProps } from "@rjsf/core";

const DateWidget: React.FC<WidgetProps> = props => {
  const _onChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    console.log(value);
    props.onChange(value === "" ? props.options.emptyValue : value);
  };
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    props.onBlur(props.id, value);
  const _onFocus = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    props.onFocus(props.id, value);

  return (
    <FormControl
      mb={1}
      isDisabled={props.disabled || props.readonly}
      isRequired={props.required}
      isReadOnly={props.readonly}
      isInvalid={props.rawErrors && props.rawErrors.length > 0}
    >
      {(props.label || props.schema.title) && (
        <FormLabel htmlFor={props.id} id={`${props.id}-label`}>
          {props.label || props.schema.title}
        </FormLabel>
      )}
      <Input
        id={props.id}
        name={props.id}
        value={props.value || props.value === 0 ? props.value : ""}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        autoFocus={props.autofocus}
        placeholder={props.placeholder}
        type="date"
        list={props.schema.examples ? `examples_${props.id}` : undefined}
      />
      {props.schema.examples ? (
        <datalist id={`examples_${props.id}`}>
          {(props.schema.examples as string[])
            .concat(props.schema.default ? ([props.schema.default] as string[]) : [])
            .map((example: any) => (
              // eslint-disable-next-line jsx-a11y/control-has-associated-label
              <option key={example} value={example} />
            ))}
        </datalist>
      ) : null}
    </FormControl>
  );
};

export default DateWidget;
