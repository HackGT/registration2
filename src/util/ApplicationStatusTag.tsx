import React from "react";
import { Tag } from "@chakra-ui/react";

interface Props {
  status: string;
  includeColor?: boolean;
  [key: string]: any;
}

const ApplicationStatusTag: React.FC<Props> = props => {
  const { status, includeColor, ...rest } = props;

  switch (status) {
    case "DRAFT":
      return <Tag {...rest}>Draft</Tag>;
    case "APPLIED":
      return (
        <Tag colorScheme={includeColor ? "orange" : "gray"} {...rest}>
          Applied
        </Tag>
      );
    case "ACCEPTED":
      return (
        <Tag colorScheme={includeColor ? "purple" : "gray"} {...rest}>
          Accepted
        </Tag>
      );
    case "WAITLISTED":
      return (
        <Tag colorScheme={includeColor ? "gray" : "gray"} {...rest}>
          Waitlisted
        </Tag>
      );
    case "CONFIRMED":
      return (
        <Tag colorScheme={includeColor ? "green" : "gray"} {...rest}>
          Confirmed
        </Tag>
      );
    case "DENIED":
      return (
        <Tag colorScheme={includeColor ? "red" : "gray"} {...rest}>
          Denied
        </Tag>
      );
    case "NOT_ATTENDING":
      return (
        <Tag colorScheme={includeColor ? "gray" : "gray"} {...rest}>
          Not Attending
        </Tag>
      );
    default:
      return (
        <Tag colorScheme={includeColor ? "blue" : "gray"} {...rest}>
          Not Applied
        </Tag>
      );
  }
};

export default ApplicationStatusTag;
