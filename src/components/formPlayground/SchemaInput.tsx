import React from "react";
import { Box, StyleProps } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

interface Props extends StyleProps {
  title: string;
  schema: string;
  setSchema: (val: string) => void;
}

const SchemaInput: React.FC<Props> = (props: Props) => {
  const { title, schema, setSchema, ...style } = props;

  const checkJSON = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  return (
    <Box
      height="400px"
      marginBottom="20px"
      borderColor="#ddd"
      borderRadius="3px"
      borderWidth="1px"
      {...style}
      fontSize="20px"
    >
      <Box paddingLeft="15px" paddingY="10px" height="44px" bg="#f5f5f5" borderTopRadius="3px" fontSize="100px">
        {title}
      </Box>
      <Editor
        width="100%"
        height="353px"
        
        value={schema}
        language="json"
        options={{
          minimap: {
            enabled: false,
          },
          selectOnLineNumbers: true,
          wordWrap: "on",
        }}
        onChange={(value: any, e: any) => {
          if (checkJSON(value)) {
            setSchema(value);
          }
        }}
      />
    </Box>
  );
};

export default SchemaInput;
