import React from "react";
import { Tag } from "@chakra-ui/react";

interface Props {
  status: string;
  includeColor?: boolean;
  [key: string]: any;
}

const ReferralStatusTag: React.FC<Props> = props => {
  const { status, includeColor, ...rest } = props;

  switch (status) {
    case "DRAFT":
      return (
        <Tag colorScheme={includeColor ? "orange" : "gray"} {...rest}>
          In Progress
        </Tag>
      );
    case "SUBMITTED":
      return (
        <Tag colorScheme={includeColor ? "teal" : "gray"} {...rest}>
          Submitted
        </Tag>
      );
    default:
      return <Tag {...rest}>{status}</Tag>;
  }
};

export default ReferralStatusTag;
