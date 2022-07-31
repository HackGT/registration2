import React, { useMemo } from "react";
import {
  Box,
  Heading,
  Text,
  Tag,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";

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
  chooseBranch: (appBranchID: any) => Promise<string | undefined>;
}

const Tile: React.FC<Props> = props => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);

  const chooseBranchAndNavigate = async () => {
    const newAppLink = await props.chooseBranch(props.branch.id);
    if (newAppLink) {
      navigate(newAppLink);
    }
  };

  const onConfirm = async () => {
    onClose();
    await chooseBranchAndNavigate();
  };

  const openDate = DateTime.fromISO(new Date(props.branch.settings.open).toISOString());
  const closeDate = DateTime.fromISO(new Date(props.branch.settings.close).toISOString());
  const currDate = DateTime.fromISO(new Date().toISOString());

  const branchStatus = useMemo(() => {
    const currBranchHasApplication = props.branch.id === props.currApp?.applicationBranch?.id;
    if (currBranchHasApplication && props.currApp?.status === "APPLIED") {
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
  }, [props.branch, props.currApp, openDate, closeDate, currDate]);

  const branchDescription = useMemo(() => {
    if (currDate < openDate) {
      return `Application opens on ${openDate.toLocaleString(DateTime.DATETIME_FULL)}`;
    }
    if (currDate > closeDate) {
      return `Applications closed on ${closeDate.toLocaleString(DateTime.DATETIME_FULL)}`;
    }
    return `Accepting applications until ${closeDate.toLocaleString(DateTime.DATETIME_FULL)}`;
  }, [openDate, closeDate, currDate]);

  const tagColor = useMemo(() => {
    if (branchStatus === BranchStatus.Closed || branchStatus === BranchStatus.NotOpen) {
      return "red";
    }
    return "teal";
  }, [branchStatus]);

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
      style={{ cursor: "pointer" }}
      onClick={async () => {
        if (
          branchStatus === BranchStatus.Closed ||
          branchStatus === BranchStatus.NotOpen ||
          branchStatus === BranchStatus.Submitted
        ) {
          return;
        }
        // If the user has an application, ask if they want to start a new one
        if (props.currApp && Object.keys(props.currApp).length !== 0) {
          if (branchStatus === BranchStatus.NotStarted) {
            onOpen();
          } else if (branchStatus === BranchStatus.InProgress) {
            navigate(`application/${props.currApp.id}`);
          }
        } else {
          await chooseBranchAndNavigate();
        }
      }}
    >
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Start a new application?
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You have already started another application. If you start a new one,
              all previous progress will be lost.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={onConfirm} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Flex
        bgGradient={props.image ? "" : "linear(to-l, #33c2ff, #7b69ec)"}
        borderTopRadius="4px"
        height="150px"
        justifyContent="flex-end"
        alignItems="flex-start"
      >
        <Tag size="sm" key="sm" variant="solid" colorScheme={tagColor} margin="5px">
          {branchStatus}
        </Tag>
      </Flex>

      <Box padding="20px 32px">
        <Heading fontSize="18px" fontWeight="semibold" marginBottom="10px" color="#212121">
          <Text>{props.branch.name}</Text>
        </Heading>
        <Text fontSize="sm" color="#858585">
          {branchDescription}
        </Text>
      </Box>
    </Box>
  );
};

export default Tile;
