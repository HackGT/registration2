import React from "react";
import { createStandaloneToast, Tag } from "@chakra-ui/react";
import { DateTime } from "luxon";
import axios, { AxiosError } from "axios";

// eslint-disable-next-line consistent-return
export const getApplicationStatusTag = (application: any) => {
  switch (application.status) {
    case "DRAFT":
      return <Tag>Draft</Tag>;
    case "APPLIED":
      return <Tag colorScheme="orange">Applied</Tag>;
    case "ACCEPTED":
      return <Tag colorScheme="purple">Applied</Tag>;
    case "CONFIRMED":
      return <Tag colorScheme="green">Confirmed</Tag>;
    case "REJECTED":
      return <Tag colorScheme="red">Confirmed</Tag>;
  }
};

/**
 * Parse date string from backend to human readable format.
 */
export const parseDateString = (date?: string | null) => {
  if (date === undefined || date === null) {
    return "";
  }

  return DateTime.fromISO(date, { zone: "America/New_York" }).toLocaleString(
    DateTime.DATETIME_SHORT
  );
};

/**
 * Parse date string from human readable format to backend format
 * while keeping the time zone consistent.
 */
export const dateToServerFormat = (date?: string | null) => {
  if (date === undefined || date === null) {
    return "";
  }

  return DateTime.fromFormat(date, "f", {
    zone: "America/New_York",
  }).toISO();
};

const toast = createStandaloneToast();

export const handleAxiosError = (error: Error | AxiosError<any>) => {
  if (axios.isAxiosError(error)) {
    console.error(error.response);
    if (error.response?.data.message) {
      toast({
        title: "Error",
        description: error.response?.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  } else {
    console.error(error);
    toast({
      title: "Error",
      description: "An unknown error occurred. Please ask for help.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  }
};
