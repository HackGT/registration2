import React from "react";
import { Box, useRadio } from "@chakra-ui/react";

const ScoreButton = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='30px'
        boxShadow='md'
        _checked={{
          bg: '#7b69ec',
          color: 'white',
          borderColor: '#7b69ec',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default ScoreButton;