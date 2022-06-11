import React, { useEffect } from "react";
import { Select } from "chakra-react-select";
import { Box } from "@chakra-ui/react";

const SelectFieldTemplate = (props: any) => {
  const options: any[] = [];

  useEffect(() => {
    try {
      props.schema.enum.forEach((element: any) => {
        options.push({
          label: element,
          value: element,
        });
      });
    } catch (e: any) {
      console.log(e.message);
    }
  });

  return (
    <Box>
      <Box fontSize="1rem" fontWeight="500" marginBottom="8px" >
        {props.schema.title}
      </Box>
      <Select
        value={{ label: props.formData, value: props.formData }}
        options={options}
        onChange={(e: any) => {
          props.onChange(e.value);
        }}
      />
    </Box>
  );
};

export default SelectFieldTemplate;
