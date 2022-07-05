import React from "react";
import { Tag } from "@chakra-ui/react";

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
