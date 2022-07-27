import React from "react";
import { Tag } from "@chakra-ui/react";
import { DateTime } from "luxon";

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
