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
  Checkbox,
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

  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();
  const toast = useToast();

  const branch = watch("branch");
  const [editorState, setEditorState] = useState<EditorState | undefined>(undefined);

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
    templates.set(branches[idx]?.id, branches[idx]?.postSubmitEmailTemplate);
  }

  useEffect(() => {
    const subject = templates.get(branch?.value)?.subject ?? "";
    const enabled = templates.get(branch?.value)?.enabled ?? false;
    const newEditorState = EditorState.createWithContent(
      ContentState.createFromText(templates.get(branch?.value)?.content ?? "")
    );

    setValue("subject", subject);
    setValue("enabled", enabled);
    setEditorState(newEditorState);
  }, [branch]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const onSubmit = async (values: any) => {
    if (!editorState) return;

    try {
      await axios.patch(apiUrl(Service.REGISTRATION, `/branches/${values.branch.value}`), {
        postSubmitEmailTemplate: {
          enabled: values.enabled,
          subject: values.subject,
          content: editorState.getCurrentContent().getPlainText(),
        },
      });

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
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box paddingY={{ base: "32px", md: "32px" }} paddingX={{ base: "16px", md: "32px" }}>
      <Alert status="info" marginBottom="20px" title="Info">
        <AlertIcon />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>
          Edit post-submit email templates here! Pick a branch and edit the template that pops into
          the email editor, or create a new one if it doesn't exist. Double check that the value of
          the checkbox is correct. Please reach out to someone on tech team if you have any
          questions about how to use this form.
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
            render={({ field: { value, ref, ...field }, fieldState: { error: fieldError } }) => (
              <FormControl isInvalid={!!fieldError} isRequired>
                <FormLabel>Branch</FormLabel>
                <Select
                  {...field}
                  ref={ref}
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
          <Controller
            control={control}
            name="enabled"
            render={({ field: { value, ref, ...field }, fieldState: { error: fieldError } }) => (
              <FormControl isInvalid={!!fieldError}>
                <Checkbox {...field} ref={ref} isChecked={!!value}>
                  Enable emails
                </Checkbox>
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
            editorState={editorState}
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