import React, { useState } from "react";
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
import { convertToRaw, EditorState } from "draft-js";
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
import { applicationStatusOptions } from "../../../util/ApplicationStatusTag";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const SendEmailTab: React.FC = () => {
  const { hexathonId } = useParams();
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
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const onSubmit = async (values: any) => {
    if (!editorState) return;

    try {
      const response = await axios.post(
        apiUrl(Service.REGISTRATION, "/email/actions/send-emails"),
        {
          hexathon: hexathonId,
          message: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          subject: values.subject,
          branchList: values.branchList.map((option: any) => option.value),
          // We make this into an array in case in the future we want to send multiple status
          statusList: [values.status.value],
        }
      );
      console.log(response.data);
      toast({
        title: "Success",
        description: "The emails are queued to be sent soon. You will also receive a copy.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Error",
        description:
          "Something went wrong. Please contact a tech director before trying again to ensure duplicate emails aren't sent.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Alert status="warning" marginBottom="20px" title="Warning">
        <AlertIcon />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Please be careful when sending an email as after you press send, it cannot be undone.
          Ensure you are selecting the right target group, and double check that the email subject &
          body is correct. Please reach out to someone on tech team if you have any questions about
          how to use this form.
        </AlertDescription>
      </Alert>
      <Heading size="xl" mb="10px">
        Send a Batch Email
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <VStack spacing="3" align="left" mb="20px">
          <Controller
            control={control}
            name="branchList"
            rules={{ required: "Please select at least one branch" }}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { error: fieldError },
            }) => (
              <FormControl isInvalid={!!fieldError} isRequired>
                <FormLabel>Branches</FormLabel>
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
                  isSearchable
                  isMulti
                  closeMenuOnSelect={false}
                />
                <FormErrorMessage>{fieldError && fieldError.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="status"
            rules={{ required: "Please select a status" }}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { error: fieldError },
            }) => (
              <FormControl isInvalid={!!fieldError} isRequired>
                <FormLabel>Application Status</FormLabel>
                <Select
                  name={name}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  options={applicationStatusOptions}
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
            editorStyle={{
              border: "1px solid #F1F1F1",
              padding: "0 10px",
              minHeight: "250px",
            }}
          />
          <Button colorScheme="purple" maxW="150px" type="submit" isLoading={isSubmitting}>
            Send Emails!
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

export default SendEmailTab;
