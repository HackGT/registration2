import React, { useMemo, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Tag,
  Flex,
  Spinner
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { DateTime } from "luxon";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";

enum BranchStatus {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Submitted = "Submitted",
  Closed = "Closed",
  NotOpen = "Not Open",
}

interface Props {
  branch: any;
  currApp: any;
  image?: string;
}

const BranchTile: React.FC<Props> = props => {
  const { hexathonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const openDate = DateTime.fromISO(new Date(props.branch.settings.open).toISOString());
  const closeDate = DateTime.fromISO(new Date(props.branch.settings.close).toISOString());
  const currDate = DateTime.fromISO(new Date().toISOString());

  const currBranchHasApplication = props.branch.id === props.currApp?.applicationBranch?.id;

  const branchStatus = useMemo(() => {
    if (currBranchHasApplication && props.currApp?.status !== "DRAFT") {
      return BranchStatus.Submitted;
    }
    if (currDate < openDate) {
      return BranchStatus.NotOpen;
    }
    if (currDate > closeDate) {
      return BranchStatus.Closed;
    }
    if (currBranchHasApplication && props.currApp?.status === "DRAFT") {
      return BranchStatus.InProgress;
    }
    return BranchStatus.NotStarted;
  }, [currBranchHasApplication, props.currApp, openDate, closeDate, currDate]);

  const submissionTimingDescription = useMemo(() => {
    if (currDate < openDate) {
      return `Submissions open on ${openDate.toLocaleString(DateTime.DATETIME_FULL)}`;
    }
    if (currDate > closeDate) {
      return `Submissions closed on ${closeDate.toLocaleString(DateTime.DATETIME_FULL)}`;
    }
    return `Accepting submissions until ${closeDate.toLocaleString(DateTime.DATETIME_FULL)}`;
  }, [openDate, closeDate, currDate]);

  const tagColor = useMemo(() => {
    if (branchStatus === BranchStatus.Closed || branchStatus === BranchStatus.NotOpen) {
      return "red";
    }
    return "teal";
  }, [branchStatus]);

  const chooseBranchAndNavigate = async () => {
    setLoading(true); // prevent double-clicking

    try {
      const response = await axios.post(
        apiUrl(Service.REGISTRATION, "/applications/actions/choose-application-branch"),
        {
          hexathon: hexathonId,
          applicationBranch: props.branch.id,
        }
      );
      navigate(`/${hexathonId}/application/${response.data.id}`);
    } catch (error: any) {
      handleAxiosError(error);
    }
    setLoading(false);
  };

  const openApplication = async () => {
    // If the user has an application, ask if they want to start a new one
    if (props.currApp && Object.keys(props.currApp).length !== 0 && branchStatus === BranchStatus.InProgress) {
        navigate(`application/${props.currApp.id}`);
    } else {
      await chooseBranchAndNavigate(); // handles if user already has an application
    }
  };

  return (
    <Box
      borderRadius="4px"
      boxShadow={{
        base: "rgba(0, 0, 0, 0.15) 0px 0px 6px 1px",
      }}
      _hover={{
        boxShadow: "rgba(0, 0, 0, 0.20) 0px 0px 8px 2px",
      }}
      transition="box-shadow 0.2s ease-in-out"
      style={{ cursor: `${loading ? "": "pointer"}` }}
      onClick={async () => {
        if (branchStatus === BranchStatus.NotStarted && !loading) {
          await openApplication();
        }
      }}
      bg={loading ? "gray.200" : "white"}
    >
      <Flex
        bgGradient={props.image ? "" : "linear(to-l, #33c2ff, #7b69ec)"}
        borderTopRadius="4px"
        height="70px"
        justifyContent="flex-end"
        alignItems="flex-start"
      >
        <Tag size="sm" key="sm" variant="solid" colorScheme={tagColor} margin="5px">
          {branchStatus}
        </Tag>
      </Flex>

      <Box padding="20px 32px">
        <Heading fontSize="18px" fontWeight="semibold" marginBottom="6px" color="#212121">
          <Text>{props.branch.name}
            {
              loading && (
                <Spinner ml={3}/>
              )
            }
          </Text>
        </Heading>
        <Text fontSize="sm" color="#858585" marginBottom="10px">
          {submissionTimingDescription}
        </Text>
        <Text fontSize="md">{props.branch.description}</Text>
      </Box>
    </Box>
  );
};

export default BranchTile;
