import React, { useState } from "react";
import { Box, StyleProps } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

interface Props extends StyleProps {
  title: string;
  schema: string;
  setSchema: (val: string) => void;
  setSchemaErrors?: React.Dispatch<any>;
}

const SchemaInput: React.FC<Props> = (props: Props) => {
  const { title, schema, setSchema, setSchemaErrors, ...style } = props;
  // The input text state is kept separate as the schema is only changed
  // once it's validated
  const [inputText, setInputText] = useState(schema);

  const handleChange = (value: any, e: any) => {
    setInputText(value);
    try {
      JSON.parse(value);
      setSchemaErrors && setSchemaErrors((prev: any) => ({ ...prev, [title]: false }));
      setSchema(value);
    } catch (err) {
      setSchemaErrors && setSchemaErrors((prev: any) => ({ ...prev, [title]: true }));
    }
  };

  return (
    <Box
      height="500px"
      marginBottom="20px"
      borderColor="#ddd"
      borderRadius="3px"
      borderWidth="1px"
      {...style}
    >
      <Box paddingLeft="15px" paddingY="10px" height="44px" bg="#f5f5f5" borderTopRadius="3px">
        {title}
      </Box>
      <Editor
        width="100%"
        height="453px"
        value={inputText}
        language="json"
        options={{
          minimap: {
            enabled: false,
          },
          selectOnLineNumbers: true,
          wordWrap: "on",
        }}
        onChange={handleChange}
      />
    </Box>
  );
};

export default SchemaInput;
