import React from "react";
import { Tag } from "@chakra-ui/react";
import { DateTime } from "luxon";

export enum ApplicationStatus {
  DRAFT = "DRAFT",
  APPLIED = "APPLIED",
  CONFIRMED = "CONFIRMED",
}

export const getApplicationStatus = (application: any) => {
  if (application.confirmed) {
    return ApplicationStatus.CONFIRMED;
  }
  if (application.applied) {
    return ApplicationStatus.APPLIED;
  }
  return ApplicationStatus.DRAFT;
};

// eslint-disable-next-line consistent-return
export const getApplicationStatusTag = (application: any) => {
  const status = getApplicationStatus(application);

  switch (status) {
    case ApplicationStatus.DRAFT:
      return <Tag>Draft</Tag>;
    case ApplicationStatus.APPLIED:
      return <Tag colorScheme="orange">Applied</Tag>;
    case ApplicationStatus.CONFIRMED:
      return <Tag colorScheme="green">Confirmed</Tag>;
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
