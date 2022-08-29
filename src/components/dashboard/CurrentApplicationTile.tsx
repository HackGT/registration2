import React, { useMemo } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  SimpleGrid,
  Stack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";

interface Props {
  application: any;
}

const CurrentApplicationTile: React.FC<Props> = props => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const { applicationBranch, confirmationBranch } = props.application;

  // Convert dates into DateTime objects
  const dates = useMemo(
    () => ({
      currentDate: DateTime.fromISO(new Date().toISOString()),
      applicationOpen: DateTime.fromISO(new Date(applicationBranch?.settings?.open).toISOString()),
      applicationClose: DateTime.fromISO(
        new Date(applicationBranch?.settings?.close).toISOString()
      ),
      confirmationOpen:
        confirmationBranch &&
        DateTime.fromISO(new Date(confirmationBranch?.settings?.open).toISOString()),
      confirmationClose:
        confirmationBranch &&
        DateTime.fromISO(new Date(confirmationBranch?.settings?.close).toISOString()),
    }),
    [applicationBranch, confirmationBranch]
  );

  const branchDescription = useMemo(() => {
    // If this is a confirmation
    if (props.application.status === "ACCEPTED" && confirmationBranch) {
      if (dates.currentDate < dates.confirmationOpen) {
        return `RSVP's will open on ${dates.confirmationOpen.toLocaleString(
          DateTime.DATETIME_FULL
        )}`;
      }
      if (dates.currentDate > dates.confirmationClose) {
        return `RSVP's closed on ${dates.confirmationClose.toLocaleString(DateTime.DATETIME_FULL)}`;
      }
      return `Accepting RSVP's until ${dates.confirmationClose.toLocaleString(
        DateTime.DATETIME_FULL
      )}`;
    }
    if (dates.currentDate < dates.applicationOpen) {
      return `Submissions open on ${dates.applicationOpen.toLocaleString(DateTime.DATETIME_FULL)}`;
    }
    if (dates.currentDate > dates.applicationClose) {
      return `Submissions closed on ${dates.applicationClose.toLocaleString(
        DateTime.DATETIME_FULL
      )}`;
    }
    return `Accepting submissions until ${dates.applicationClose.toLocaleString(
      DateTime.DATETIME_FULL
    )}`;
  }, [dates, confirmationBranch, props.application]);

  const updateStatus = useMemo(
    () => async (status: string) => {
      try {
        await axios.post(
          apiUrl(
            Service.REGISTRATION,
            `/applications/${props.application.id}/actions/update-status`
          ),
          {
            status,
          }
        );
        window.location.reload();
      } catch (error: any) {
        handleAxiosError(error);
      }
    },
    [props.application]
  );

  const actionButtons = useMemo(() => {
    const openApplication = async () => {
      navigate(`application/${props.application.id}`);
    };

    if (props.application.status === "DRAFT" && dates.currentDate < dates.applicationClose) {
      return (
        <Button onClick={openApplication} variant="outline" width="100%" colorScheme="purple">
          Continue Application
        </Button>
      );
    }
    if (props.application.status === "APPLIED" && dates.currentDate < dates.applicationClose) {
      return (
        <Button onClick={openApplication} variant="outline" width="100%" colorScheme="purple">
          Edit Application
        </Button>
      );
    }
    if (props.application.status === "ACCEPTED" && dates.currentDate < dates.confirmationClose) {
      return (
        <Stack gap="5px">
          <Button
            onClick={() => {
              if (props.application.confirmationBranch?.formPages?.length > 0) {
                openApplication();
              } else {
                updateStatus("CONFIRMED");
              }
            }}
            width="100%"
            colorScheme="green"
          >
            Confirm Attendance
          </Button>
          <Button onClick={() => onOpen()} variant="outline" width="100%" colorScheme="red">
            Unable to Attend
          </Button>
        </Stack>
      );
    }
    return null;
  }, [navigate, props.application, dates, updateStatus, onOpen]);

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
      <Box
        borderRadius="4px"
        boxShadow={{
          base: "rgba(0, 0, 0, 0.15) 0px 0px 6px 1px",
        }}
        _hover={{
          boxShadow: "rgba(0, 0, 0, 0.20) 0px 0px 8px 2px",
        }}
        transition="box-shadow 0.2s ease-in-out"
      >
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Confirm Not Attending
              </AlertDialogHeader>
              <AlertDialogBody>Are you sure you won't be able to attend?</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    onClose();
                    updateStatus("NOT_ATTENDING");
                  }}
                  ml={3}
                >
                  Sorry, I can't make it
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <Flex
          bgGradient="linear(to-l, #33c2ff, #7b69ec)"
          borderTopRadius="4px"
          height="100px"
          justifyContent="flex-end"
          alignItems="flex-start"
        />
        <Box padding="20px 32px">
          <Heading fontSize="18px" fontWeight="semibold" marginBottom="10px" color="#212121">
            <Text>{props.application.applicationBranch.name}</Text>
          </Heading>
          <Text fontSize="sm" color="#858585" mb="8px">
            {branchDescription}
          </Text>
          {actionButtons}
        </Box>
      </Box>
    </SimpleGrid>
  );
};

export default CurrentApplicationTile;
