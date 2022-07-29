import React, { useMemo, useState } from "react";
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Link,
  Stack,
  useToast,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import defaultJsonSchema from "./defaultSchemas/defaultJsonSchema.json";
import defaultUiSchema from "./defaultSchemas/defaultUiSchema.json";
import CommonForm from "../commonForm/CommonForm";
import SchemaInput from "./SchemaInput";
import SchemaOutput from "./SchemaOutput";
import { JSONSchema7 } from "json-schema";
import FormPageModal from "../admin/branchSettings/FormPageModal";
import useAxios from "axios-hooks";

export enum BranchType {
  APPLICATION = "APPLICATION",
  CONFIRMATION = "CONFIRMATION",
}

export interface Branch {
  _id: string;
  name: string;
  hexathon: string;
  type: BranchType;
  settings: {
    open: string;
    close: string;
  };
  formPages: {
    _id: string;
    title: string;
    jsonSchema: string;
    uiSchema: string;
  }[];
}

interface Props {
  branchId: any;
  formPage: any;
  formPageIndex: number;
  handleSaveFormPage: (updatedFormPage: any, formPageIndex: number) => Promise<void>;
  handleDeleteFormPage: (formPageIndex: number) => Promise<void>;
  commonDefinitionsSchema: string;
}

const BranchFormCreator: React.FC<Props> = props => {
  const [jsonSchema, setJsonSchema] = useState(
    props.formPage.jsonSchema ?? JSON.stringify(defaultJsonSchema, null, 2)
  );
  const [uiSchema, setUiSchema] = useState(
    props.formPage.uiSchema ?? JSON.stringify(defaultUiSchema, null, 2)
  );
  const [formData, setFormData] = useState("{}");
  const [loading, setLoading] = useState(false);
  const [schemaErrors, setSchemaErrors] = useState<any>({});
  const [modalType, setModalType] = useState("");
  const toast = useToast();

  const [{ data: branchData, loading: load, error }, refetch] = useAxios(
    `https://registration.api.hexlabs.org/branches/${props.branchId}`
  );

  const handleSaveFormPage = async () => {
    // If JSON schema or UI schema have errors, don't save
    try {
      JSON.parse(jsonSchema);
      JSON.parse(uiSchema);
      console.log(schemaErrors);
      if (Object.values(schemaErrors).includes(true)) throw Error();
    } catch (err) {
      toast({
        title: "Error",
        description:
          "Unable to save form page. Please check your JSON schema and UI schema for errors.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    const updatedFormPage = {
      title: props.formPage.title,
      jsonSchema,
      uiSchema,
    };
    await props.handleSaveFormPage(updatedFormPage, props.formPageIndex);
    setLoading(false);
  };

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()

  const btnRef = React.useRef<HTMLButtonElement>(null);
  
  const handleDeleteFormPage = async () => {
    onClose();
    setLoading(true);
    await props.handleDeleteFormPage(props.formPageIndex);
    setLoading(false);
  };

  const handleModalOpen = (defaultValues: any) => {
    if (defaultValues) {
      setModalType("EDIT");
    } else {
      setModalType("ADD");
    }
    onOpen2();
  };

  const handleModalClose = () => {
    onClose2();
  };

  // Need to use this memo function to include the common definitions schema. These
  // definitions don't show up in the editor
  const combinedJsonSchema = useMemo(() => {
    const schema = JSON.parse(jsonSchema);
    schema.definitions = JSON.parse(props.commonDefinitionsSchema);
    return schema as JSONSchema7;
  }, [jsonSchema, props.commonDefinitionsSchema]);

  return (
    <>
      <Button onClick={handleSaveFormPage} colorScheme="purple" isLoading={loading}>
        Save Form Page
      </Button>
      <Button colorScheme="red" isLoading={loading} onClick={onOpen}>
        Delete Form Page
      </Button>
      <Button colorScheme="orange" isLoading={loading} onClick={() => handleModalOpen(branchData)}>
        Edit Form Page
      </Button>
      <Button colorScheme="green" isLoading={loading} onClick={() => handleModalOpen(null)}>
        Add Form Page
      </Button>
      <FormPageModal
        defaultValues={branchData}
        type={modalType}
        branchId={props.branchId}
        formPageIndex={props.formPageIndex}
        isOpen={isOpen2}
        onClose={handleModalClose}
        refetch={refetch}
      />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={btnRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Form Page
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This will affect all applications and is unrecoverable
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={btnRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleDeleteFormPage} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Box marginTop="20px">
        <Stack
          width={{ base: "100%", md: "55%" }}
          display="inline-block"
          paddingRight={{ base: "0px", md: "20px" }}
        >
          <Alert status="info">
            <AlertIcon />
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>
              Right click inside the editor for more tools like JSON formatting.
            </AlertDescription>
          </Alert>
          <Alert status="info">
            <AlertIcon />
            <AlertTitle>Common Definitions</AlertTitle>
            <AlertDescription>
              <Text>
                You can use common definitions to reuse shared dropdown options between forms (like
                school, ethnicity, etc.). Click{" "}
                <Link
                  href="https://github.com/HackGT/api/blob/main/services/registration/src/common/commonDefinitions.ts"
                  target="_blank"
                  rel="noreferrer"
                  isExternal
                  textDecorationLine="underline"
                >
                  here
                </Link>{" "}
                to view the current list.
              </Text>
            </AlertDescription>
          </Alert>
          <SchemaInput
            title="JSON Schema"
            schema={jsonSchema}
            setSchema={setJsonSchema}
            setSchemaErrors={setSchemaErrors}
          />
          <SchemaInput
            title="UI Schema"
            schema={uiSchema}
            setSchema={setUiSchema}
            setSchemaErrors={setSchemaErrors}
          />
          <SchemaOutput title="Test Form Data" schema={formData} />
        </Stack>
        <Box
          padding="15px"
          verticalAlign="top"
          width={{ base: "100%", md: "45%" }}
          height="100%"
          display="inline-block"
        >
          <CommonForm
            schema={jsonSchema}
            uiSchema={uiSchema}
            commonDefinitionsSchema={props.commonDefinitionsSchema}
            formData={JSON.parse(formData)}
            onChange={(val: any, event: any) => {
              setFormData(JSON.stringify(val.formData, null, 2));
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default BranchFormCreator;
