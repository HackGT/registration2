import { Link } from "@chakra-ui/react";
import React from "react";
import ReactMarkdown, { Options } from "react-markdown";

const MarkdownLink: React.FC<any> = props => (
  <Link color="teal.500" href={props.href} target="_blank">
    {props.children}
  </Link>
);

const RenderMarkdown: React.FC<Options> = props => (
  <ReactMarkdown components={{ a: MarkdownLink }}>{props.children}</ReactMarkdown>
);

export default RenderMarkdown;
