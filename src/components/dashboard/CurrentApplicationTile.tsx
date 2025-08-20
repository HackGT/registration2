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
  Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";

interface Props {
  application: any;
}

export enum ApplicationFormStatus {
  CONTINUE = "CONTINUE",
  EDIT = "EDIT",
}

const CurrentApplicationTile: React.FC<Props> = props => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteModal = useDisclosure();
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
      applicationExtendedDeadline: props.application.applicationExtendedDeadline
        ? DateTime.fromISO(new Date(props.application.applicationExtendedDeadline).toISOString())
        : null,
      confirmationOpen: confirmationBranch
        ? DateTime.fromISO(new Date(confirmationBranch?.settings?.open).toISOString())
        : null,
      confirmationClose: confirmationBranch
        ? DateTime.fromISO(new Date(confirmationBranch?.settings?.close).toISOString())
        : null,
      confirmationExtendedDeadline: props.application.confirmationExtendedDeadline
        ? DateTime.fromISO(new Date(props.application.confirmationExtendedDeadline).toISOString())
        : null,
    }),
    [props.application, applicationBranch, confirmationBranch]
  );

  const branchTitle = useMemo(() => {
    if (confirmationBranch?.name) {
      return confirmationBranch.name;
    }
    return applicationBranch.name;
  }, [applicationBranch, confirmationBranch]);

  const travelReimbursementDescription = useMemo(() => {
    if (!["ACCEPTED", "CONFIRMED"].includes(props.application.status)) {
      return "";
    }

    const travelReimbursementInfoLink = (
      <>
        {" "}
        Please visit{" "}
        <Link
          color="teal.500"
          href={props.application.decisionData?.travelReimbursementInfoLink}
          target="_blank"
          rel="noreferrer"
        >
          this link
        </Link>{" "}
        to view the specific details & requirements.
      </>
    );
    switch (props.application.decisionData?.travelReimbursement) {
      case "gas/flight":
        return (
          <>
            You've been awarded gas/flight reimbursement for your travel.
            {travelReimbursementInfoLink}
          </>
        );
      case "flight":
        return (
          <>
            You've been awarded flight reimbursement of{" "}
            <Text as="b">${props.application.decisionData?.travelReimbursementAmount}</Text> for
            your travel.
            {travelReimbursementInfoLink}
          </>
        );
      case "bus":
        return (
          <>
            You've been assigned a bus route for your travel.
            {travelReimbursementInfoLink}
          </>
        );
      default:
        return "";
    }
  }, [props.application]);

  const submissionTimingDescription = useMemo(() => {
    if (props.application.status === "CONFIRMED") {
      return "";
    }
    // If this is a confirmation
    if (props.application.status === "ACCEPTED" && confirmationBranch) {
      if (!dates.confirmationOpen || !dates.confirmationClose) {
        return "Unknown dates";
      }
      if (dates.currentDate < dates.confirmationOpen) {
        return `RSVP's will open on ${dates.confirmationOpen.toLocaleString(
          DateTime.DATETIME_FULL
        )}`;
      }
      if (dates.currentDate < dates.confirmationClose) {
        return `Accepting RSVP's until ${dates.confirmationClose.toLocaleString(
          DateTime.DATETIME_FULL
        )}`;
      }
      if (
        dates.confirmationExtendedDeadline &&
        dates.currentDate < dates.confirmationExtendedDeadline
      ) {
        return `Accepting RSVP's until ${dates.confirmationExtendedDeadline.toLocaleString(
          DateTime.DATETIME_FULL
        )}`;
      }
      return `RSVP's closed on ${dates.confirmationClose.toLocaleString(DateTime.DATETIME_FULL)}`;
    }

    if (dates.currentDate < dates.applicationOpen) {
      return `Submissions open on ${dates.applicationOpen.toLocaleString(DateTime.DATETIME_FULL)}`;
    }
    if (dates.currentDate < dates.applicationClose) {
      return `Accepting submissions until ${dates.applicationClose.toLocaleString(
        DateTime.DATETIME_FULL
      )}`;
    }
    if (
      dates.applicationExtendedDeadline &&
      dates.currentDate < dates.applicationExtendedDeadline
    ) {
      return `Accepting submissions until ${dates.applicationExtendedDeadline.toLocaleString(
        DateTime.DATETIME_FULL
      )}`;
    }
    return `Submissions closed on ${dates.applicationClose.toLocaleString(DateTime.DATETIME_FULL)}`;
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

  const deleteApplication = useMemo(
    () => async () => {
      try {
        await axios.delete(apiUrl(Service.REGISTRATION, `/applications/${props.application.id}`));
        window.location.reload();
      } catch (error: any) {
        handleAxiosError(error);
      }
    },
    [props.application]
  );

  const actionButtons = useMemo(() => {
    const openApplication = async (formStatus: ApplicationFormStatus) => {
      navigate(`application/${props.application.id}`, { state: { formStatus } });
    };

    const deleteAppButton = (
      <Button
        onClick={() => {
          deleteModal.onOpen();
        }}
        variant="link"
        colorScheme="red"
        fontSize="sm"
        width="100%"
        mt={4}
      >
        Delete Application
      </Button>
    );

    if (
      props.application.status === "DRAFT" &&
      (dates.currentDate < dates.applicationClose ||
        (dates.applicationExtendedDeadline &&
          dates.currentDate < dates.applicationExtendedDeadline))
    ) {
      return (
        <>
          <Button
            onClick={() => openApplication(ApplicationFormStatus.CONTINUE)}
            variant="outline"
            width="100%"
            colorScheme="purple"
          >
            Continue Application
          </Button>

          {deleteAppButton}
        </>
      );
    }
    if (
      props.application.status === "APPLIED" &&
      (dates.currentDate < dates.applicationClose ||
        (dates.applicationExtendedDeadline &&
          dates.currentDate < dates.applicationExtendedDeadline))
    ) {
      return (
        <>
          <Button
            onClick={() => openApplication(ApplicationFormStatus.EDIT)}
            variant="outline"
            width="100%"
            colorScheme="purple"
          >
            Edit Application
          </Button>

          {deleteAppButton}
        </>
      );
    }
    if (
      props.application.status === "ACCEPTED" &&
      ((dates.confirmationClose && dates.currentDate < dates.confirmationClose) ||
        (dates.confirmationExtendedDeadline &&
          dates.currentDate < dates.confirmationExtendedDeadline))
    ) {
      return (
        <Stack gap="5px">
          <Button
            onClick={() => {
              if (props.application.confirmationBranch?.formPages?.length > 0) {
                openApplication(ApplicationFormStatus.CONTINUE);
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

        <AlertDialog
          isOpen={deleteModal.isOpen}
          leastDestructiveRef={cancelRef}
          onClose={deleteModal.onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Application
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete your application for{" "}
                <Text as="span" fontWeight="bold">
                  {branchTitle}
                </Text>
                ?
                <Text as="span" fontStyle="italic">
                  {" "}
                  This action cannot be undone.
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={deleteModal.onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    deleteModal.onClose();
                    deleteApplication();
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Flex
          bgGradient="linear(to-l, #33c2ff, #7b69ec)"
          borderTopRadius="4px"
          height="70px"
          justifyContent="flex-end"
          alignItems="flex-start"
        />
        <Box padding="20px 32px">
          <Heading fontSize="18px" fontWeight="semibold" marginBottom="10px" color="#212121">
            <Text>{branchTitle}</Text>
          </Heading>
          <Text fontSize="sm" mb="8px">
            {travelReimbursementDescription}
          </Text>
          <Text fontSize="sm" color="#858585" mb="8px">
            {submissionTimingDescription}
          </Text>
          {actionButtons}
        </Box>
      </Box>
    </SimpleGrid>
  );
};

export default CurrentApplicationTile;
