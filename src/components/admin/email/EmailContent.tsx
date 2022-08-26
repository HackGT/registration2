import React from "react";
import { Box, Heading, Text, Divider } from "@chakra-ui/react";

interface Props {
  heading: string;
  content: string;
}

const EmailContent: React.FC<Props> = props => (
  <Box width="100%" height="58vh">
    <Heading size="lg" paddingBottom={{ base: "8px" }}>
      {props.heading}
    </Heading>
    <Divider />
    <Text paddingTop={{ base: "8px" }}>{props.content}</Text>
  </Box>
);

export default EmailContent;
