import React, { useRef } from "react";
import { FieldProps } from "@rjsf/core";
import {
  Input,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Icon,
  Box,
  Progress,
} from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import axios from "axios";

import { handleAxiosError } from "../../util/util";

const FileUploadFieldTemplate: React.FC<FieldProps> = props => {
  const inputRef = useRef<any>();
  const [fileName, setFileName] = React.useState<any>(props.formData?.name);
  const [fileUploadLoading, setFileUploadLoading] = React.useState(false);

  const handleChange = async (e: any) => {
    setFileUploadLoading(true);
    try {
      const multipartFormData = new FormData();
      multipartFormData.append("type", props.name);
      multipartFormData.append("file", e.target.files[0], e.target.files[0].name);
      setFileName(e.target.files[0].name);
      const response = await axios.post(
        "https://files.api.hexlabs.org/files/upload",
        multipartFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      props.onChange(response.data);
    } catch (error: any) {
      setFileName("");
      handleAxiosError(error);
    } finally {
      setFileUploadLoading(false);
    }
  };

  return (
    <>
      <Box>
        <FormLabel aria-disabled={props.disabled}>{props.schema.title}</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiFile} />
          </InputLeftElement>
          <Input
            type="file"
            onChange={handleChange}
            ref={inputRef}
            style={{ display: "none" }}
            disabled={props.disabled}
          />
          <Input
            placeholder="Click to upload resume"
            onClick={() => inputRef.current.click()}
            value={fileName}
            readOnly
            disabled={props.disabled}
            cursor="pointer"
          />
        </InputGroup>
      </Box>
      {fileUploadLoading && <Progress size="xs" isIndeterminate mt="2" />}
    </>
  );
};

export default FileUploadFieldTemplate;
