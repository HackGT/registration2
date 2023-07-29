import { Box, Text, Tag, Stack, Button, Container } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

import { Branch } from "./BranchSettingsPage";
import { parseDateString } from "../../../util/util";

export interface Props {
  branch: Branch;
  openModal: (defaultValues: Partial<Branch>) => void;
}

const BranchCard: React.FC<Props> = props => {
  const navigate = useNavigate();

  return (
    <Container padding="0">
      <Box
        boxShadow={{
          base: "rgba(0, 0, 0, 0.15) 0px 0px 6px 1px",
        }}
        borderRadius="lg"
        padding="4"
      >
        <Stack>
          <Stack spacing="1">
            <Text fontSize="sm" color="muted">
              {props.branch.grading?.enabled && (
                <Tag mr="8px" colorScheme="orange">
                  Grading Enabled
                </Tag>
              )}
              {props.branch.applicationGroup && (
                <Tag>{_.capitalize(props.branch.applicationGroup)}</Tag>
              )}
            </Text>
            <Text fontSize="lg" fontWeight="medium">
              {props.branch.name}
            </Text>
            <Text>{`Opens at: ${parseDateString(props.branch.settings.open)}`}</Text>
            <Text>{`Closes at: ${parseDateString(props.branch.settings.close)}`}</Text>
          </Stack>
          <Stack direction={{ base: "column", md: "row" }} spacing="3">
            <Button size="sm" onClick={() => props.openModal(props.branch)}>
              Edit
            </Button>
            <Button size="sm" onClick={() => navigate(props.branch.id)}>
              Modify Form
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};

export default BranchCard;
