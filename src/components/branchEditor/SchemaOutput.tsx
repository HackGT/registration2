import React from "react";
import { Box, StyleProps } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

interface Props extends StyleProps {
  title: string;
  schema: string;
}

const SchemaOutput: React.FC<Props> = (props: Props) => {
  const { title, schema, ...style } = props;

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
        value={schema}
        language="json"
        options={{
          minimap: {
            enabled: false,
          },
          selectOnLineNumbers: true,
          wordWrap: "on",
        }}
      />
    </Box>
  );
};

export default SchemaOutput;
