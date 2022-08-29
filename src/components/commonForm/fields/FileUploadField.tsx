/* eslint-disable no-underscore-dangle */
import React, { useMemo, useRef } from "react";
import { FieldProps } from "@rjsf/core";
import {
  Input,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Icon,
  Progress,
  FormControl,
  InputRightElement,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import axios from "axios";
import { CloseIcon } from "@chakra-ui/icons";
import { apiUrl, Service } from "@hex-labs/core";

import { handleAxiosError } from "../../../util/util";

const FileUploadField: React.FC<FieldProps> = props => {
  const inputRef = useRef<any>();
  const [fileName, setFileName] = React.useState<any>(props.formData?.name ?? "");
  const [fileUploadLoading, setFileUploadLoading] = React.useState(false);

  // Manually create error message since empty object ({}) are still considered valid
  const errorMessage = useMemo(() => {
    try {
      return String(props.errorSchema.name.__errors[0]);
    } catch {
      return "";
    }
  }, [props.errorSchema]);

  const _onChange = async ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => {
    if (!files || !files.length) return;
    setFileUploadLoading(true);
    try {
      const multipartFormData = new FormData();
      multipartFormData.append("type", props.name);
      multipartFormData.append("file", files[0], files[0].name);
      setFileName(files[0].name);
      const response = await axios.post(apiUrl(Service.FILES, "/files/upload"), multipartFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      props.onChange(response.data);
    } catch (error: any) {
      setFileName("");
      props.onChange({});
      handleAxiosError(error);
    } finally {
      setFileUploadLoading(false);
    }
  };
  const _onClear = () => {
    setFileName("");
    props.onChange({});
    setFileUploadLoading(false);
  };
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    props.onBlur(props.id ?? "", value);
  const _onFocus = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    props.onFocus(props.id ?? "", value);

  return (
    <>
      <FormControl
        mb={1}
        isDisabled={props.disabled || props.readonly}
        isRequired={props.required}
        isReadOnly={props.readonly}
        isInvalid={!!errorMessage || (props.rawErrors && props.rawErrors.length > 0)}
      >
        {(props.label || props.schema.title) && (
          <FormLabel htmlFor={props.id}>{props.label || props.schema.title}</FormLabel>
        )}
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiFile} />
          </InputLeftElement>
          <Input
            type="file"
            onChange={_onChange}
            onBlur={_onBlur}
            onFocus={_onFocus}
            ref={inputRef}
            style={{ display: "none" }}
            disabled={props.disabled}
          />
          <Input
            placeholder="Click to upload resume"
            onClick={() => inputRef.current.click()}
            value={fileName}
            disabled={props.disabled}
            cursor="pointer"
            style={{ caretColor: "transparent" }}
          />
          {fileName && !fileUploadLoading && (
            <InputRightElement cursor="pointer">
              <CloseIcon boxSize="3" onClick={_onClear} />
            </InputRightElement>
          )}
        </InputGroup>
        {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
      </FormControl>
      {props.children}
      {fileUploadLoading && <Progress size="xs" isIndeterminate mt="2" />}
    </>
  );
};

export default FileUploadField;
