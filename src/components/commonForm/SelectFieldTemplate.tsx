import React, { useEffect } from "react";
import { Select } from "chakra-react-select";
import { Box, FormLabel } from "@chakra-ui/react";
import { FieldProps } from "@rjsf/core";

const SelectFieldTemplate: React.FC<FieldProps> = props => {
  const options: any[] = [];

  useEffect(() => {
    (props.schema.enum ?? []).forEach(element => {
      options.push({
        label: element,
        value: element,
      });
    });
  });

  return (
    <Box>
      <FormLabel aria-disabled={props.disabled}>{props.schema.title}</FormLabel>
      <Select
        value={{ label: props.formData, value: props.formData }}
        options={options}
        onChange={(e: any) => {
          if (e === null) {
            props.onChange("");
          } else {
            props.onChange(e.value);
          }
        }}
        isSearchable
        isClearable
        isDisabled={props.disabled}
      />
    </Box>
  );
};

export default SelectFieldTemplate;
