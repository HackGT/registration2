/* eslint-disable no-underscore-dangle */
import React from "react";
import { FormControl, FormLabel, Textarea, Text } from "@chakra-ui/react";
import { WidgetProps } from "@rjsf/core";

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

const EssayWidget: React.FC<WidgetProps> = props => {
  const _onChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) =>
    props.onChange(value === "" ? props.options.emptyValue : value);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLTextAreaElement>) =>
    props.onBlur(props.id, value);
  const _onFocus = ({ target: { value } }: React.FocusEvent<HTMLTextAreaElement>) =>
    props.onFocus(props.id, value);

  const wordCount = getWordCount(props.value);

  return (
    <FormControl
      mb={1}
      isDisabled={props.disabled || props.readonly}
      isRequired={props.required}
      isReadOnly={props.readonly}
      isInvalid={props.rawErrors && props.rawErrors.length > 0}
    >
      {(props.label || props.schema.title) && (
        <FormLabel htmlFor={props.id}>{props.label || props.schema.title}</FormLabel>
      )}
      <Textarea
        id={props.id}
        name={props.id}
        value={props.value ?? ""}
        placeholder={props.placeholder}
        autoFocus={props.autofocus}
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
