import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  Input,
  FormLabel,
  FormControl,
  FormErrorMessage,
  VStack,
  useToast,
  AlertIcon,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@chakra-ui/react";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
// @ts-ignore
import draftToHtml from "draftjs-to-html";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";
import { Letter } from "react-letter";
import { Select } from "chakra-react-select";
import { LoadingScreen, ErrorScreen, Service, apiUrl } from "@hex-labs/core";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import styles from "./email.module.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const BranchTemplates: React.FC = () => {
  const { hexathonId } = useParams();
  const [editorState, setEditorState] = useState<EditorState | undefined>(undefined);
  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm();
  const toast = useToast();

  const watchSelectors = watch(["branch"])

  const [{ data: branches, loading, error }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/branches"),
    params: {
      hexathon: hexathonId,
    },
  });

  const [{ data }] = useAxios({
    method: "POST",
    url: apiUrl(Service.NOTIFICATIONS, "/email/render"),
    data: {
      hexathon: hexathonId,
      message: editorState ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : "",
    },
  });

  const templates = new Map();
  for (let idx = 0; idx < branches?.length; idx += 1) {
    templates.set(branches[idx]?.id, branches[idx]?.postSubmitEmailTemplate)
  }

  useEffect(() => {
    const curBranch = watchSelectors[0];
    const template = templates.get(curBranch?.value)?.content || "Hello from Hexlabs!";
    const subject = templates.get(curBranch?.value)?.subject || "Hello!";
    const newEditorState = EditorState.createWithContent(ContentState.createFromText(template))

    setEditorState(newEditorState)
    setValue("subject", subject)
  }, watchSelectors)
  
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const onSubmit = async (values: any) => {
    if (!editorState) return;

    try {
      const response = await axios.patch(
        apiUrl(Service.REGISTRATION, `/branches/${values.branch.value}`),
        {
          postSubmitEmailTemplate: {
            subject: values.subject.value,
            content: data?.text
          }
        }
      );

      console.log(response.data);
      toast({
        title: "Success",
        description: "Email Template saved successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Error",
        description:
          "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box paddingY={{ base: "32px", md: "32px" }} paddingX={{ base: "16px", md: "32px" }}>
      <Alert status="warning" marginBottom="20px" title="Warning">
        <AlertIcon />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Please be careful when editing the email templates as after you press save, it cannot be undone.
          Ensure you are selecting the right target group, and double check that the email subject &
          body is correct. Please reach out to someone on tech team if you have any questions about
          how to use this form.
        </AlertDescription>
      </Alert>
      <Heading size="xl" mb="10px">
        Edit Branch Email Templates
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <VStack spacing="3" align="left" mb="20px">
          <Controller
            control={control}
            name="branch"
            rules={{ required: "Please select a branch" }}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { error: fieldError },
            }) => (
              <FormControl isInvalid={!!fieldError} isRequired>
                <FormLabel>Branch</FormLabel>
                <Select
                  name={name}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  options={branches.map((branch: any) => ({
                    label: branch.name,
                    value: branch.id,
                  }))}
                />
                <FormErrorMessage>{fieldError && fieldError.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <FormControl isInvalid={Boolean(errors.subject)} isRequired>
            <FormLabel>Subject</FormLabel>
            <Input
              placeholder="Welcome to HexLabs!"
              {...register("subject", {
                required: "Please enter a subject",
              })}
            />
            <FormErrorMessage>{errors.subject && (errors.subject.message as any)}</FormErrorMessage>
          </FormControl>
          {/*
              // @ts-ignore */}
          <Editor
            onEditorStateChange={newEditorState => setEditorState(newEditorState)}
            editorState = {editorState}
            editorStyle={{
              border: "1px solid #F1F1F1",
              padding: "0 10px",
              minHeight: "250px",
            }}
          />
          <Button colorScheme="purple" maxW="150px" type="submit" isLoading={isSubmitting}>
            Save Template!
          </Button>
        </VStack>
      </form>
      <Heading size="xl" mb="10px">
        Email Preview
      </Heading>
      <Letter html={data?.html} text={data?.text} className={styles["email-screen"]} />
    </Box>
  );
};

export default BranchTemplates;
