import React from "react";
import { FormControl, FormLabel, Textarea, Text } from "@chakra-ui/react";
import { WidgetProps, utils } from "@rjsf/core";

const { getDisplayLabel } = utils;

/**
 * Gets the number of words in a string.
 */
const getWordCount = (value?: string) => {
  if (!value) {
    return 0;
  }
  let s = value.trim();

  // Credit: https://stackoverflow.com/questions/18679576/counting-words-in-string
  s = s.replace(/(^\s*)|(\s*$)/gi, ""); // exclude  start and end white-space
  s = s.replace(/[ ]{2,}/gi, " "); // 2 or more space to 1
  s = s.replace(/\n /, "\n"); // exclude newline with a start spacing
  const curWordCount = s.split(" ").filter((str: string) => str !== "").length;

  return curWordCount;
};

// TODO: Make this a dynamic value
const WORD_COUNT_LIMIT = 100;

const EssayWidget = ({
  id,
  placeholder,
  value,
  label,
  disabled,
  autofocus,
  readonly,
  onBlur,
  onFocus,
  onChange,
  options,
  schema,
  uiSchema,
  required,
  rawErrors,
}: WidgetProps) => {
  const displayLabel = getDisplayLabel(schema, uiSchema) && (!!label || !!schema.title);

  const _onChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) =>
    onChange(value === "" ? options.emptyValue : value);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLTextAreaElement>) =>
    onBlur(id, value);
  const _onFocus = ({ target: { value } }: React.FocusEvent<HTMLTextAreaElement>) =>
    onFocus(id, value);

  const wordCount = getWordCount(value);

  return (
    <FormControl
      mb={1}
      isDisabled={disabled || readonly}
      isRequired={required}
      isReadOnly={readonly}
      isInvalid={rawErrors && rawErrors.length > 0}
    >
      {displayLabel ? <FormLabel htmlFor={id}>{label || schema.title}</FormLabel> : null}
      <Textarea
        id={id}
        name={id}
        value={value ?? ""}
        placeholder={placeholder}
        autoFocus={autofocus}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
      />
      <Text color={wordCount > WORD_COUNT_LIMIT ? "red" : "gray"} marginTop="5px">
        {wordCount} / {WORD_COUNT_LIMIT} words
      </Text>
    </FormControl>
  );
};

export default EssayWidget;
