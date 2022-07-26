import React, { useRef } from "react";
import { FieldProps } from "@rjsf/core";
import { Input, FormLabel, InputGroup, InputLeftElement, Icon } from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";

const FileUploadFieldTemplate: React.FC<FieldProps> = props => {
  const inputRef = useRef<any>();
  console.log(props.formData);
  const [fileName, setFileName] = React.useState<any>(props.formData?.name);

  const handleChange = (e: any) => {
    console.log(e);
    setFileName(e.target.files[0].name);
    props.onChange(e.target.files[0]);
  };

  return (
    <>
      <FormLabel>{props.schema.title}</FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiFile} />
        </InputLeftElement>
        <Input type="file" onChange={handleChange} ref={inputRef} style={{ display: "none" }} />
        <Input
          placeholder="Click or drag to upload resume"
          onClick={() => inputRef.current.click()}
          value={fileName}
          readOnly
        />
      </InputGroup>
    </>
  );
};

export default FileUploadFieldTemplate;
