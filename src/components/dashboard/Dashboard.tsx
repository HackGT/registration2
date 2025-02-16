import React, { useEffect, useMemo, useState } from "react";
import { AlertDialog, AlertDialogOverlay, AlertDialogBody, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, Button, Box, Flex, Heading, Text, Divider, Link, useDisclosure } from "@chakra-ui/react";
import { apiUrl, ErrorScreen, handleAxiosError, LoadingScreen, Service, useAuth } from "@hex-labs/core";
import { QRCodeSVG } from "qrcode.react";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";
import axios from "axios";

import FutureEventsTimeline from "./FutureEventsTimeline";
import Branches from "./Branches";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";
import ApplicationStatusTag from "../../util/ApplicationStatusTag";
import CurrentApplicationTile from "./CurrentApplicationTile";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentHexathon } = useCurrentHexathon();
  const { hexathonId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const updateDimensions = () => {
    setScreenWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const [{ data: profile, loading: profileLoading, error: profileError }] = useAxios(
    apiUrl(Service.USERS, `/users/${user?.uid}`)
  );
  const [{ data: applications, loading: applicationsLoading, error: applicationsError }] = useAxios(
    {
      url: apiUrl(Service.REGISTRATION, "/applications"),
      method: "GET",
      params: {
        hexathon: hexathonId,
        userId: user?.uid,
      },
    },
    { useCache: false }
  );
  const [{ data: branches, loading: branchesLoading, error: branchesError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/branches"),
    params: {
      hexathon: hexathonId,
    },
  });

  const application =
    applications?.applications?.length > 0 ? applications?.applications[0] : undefined;

    const updateStatus = useMemo(
      () => async (status: string) => {
        try {
          await axios.post(
            apiUrl(
              Service.REGISTRATION,
              `/applications/${application.id}/actions/update-status`
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
      [application]
    );
  
  const applicationStatusDescription = useMemo(() => {
    switch (application?.status) {
      case "DRAFT":
        return (
          <>
            Your application isn't submitted yet. Please ensure you finish your application before
            the deadline!
          </>
        );
      case "APPLIED":
        return (
          <>
            You've applied and are all set for now! Feel free to edit your application at any time
            until the registration deadline. Application decisions will be released together some
            time after applications close.
          </>
        );
      case "ACCEPTED":
        return (
          <>
            Congratulations! You've been accepted to the event. Please make sure to confirm your
            attendance below before the deadline closes as there are a limited number of spots.
          </>
        );
      case "WAITLISTED":
        return (
          <>
            Thank you for applying! At this time, you have been put on our waitlist. We will be
            sending more updates to your email address soon.

            If you would no longer like to be on the waitlist, please let us know..
            <Button onClick={() => onOpen()} variant="outline" width="100%" colorScheme="red">
              Decline Waitlist
            </Button>
          </>
        );
      case "CONFIRMED":
        return (
          <>
            You're all set to attend our event! Please check your email and our social media for any
            updates. We look forward to seeing you!

            If you can no longer attend the event, please let us know.
            <Button onClick={() => onOpen()} variant="outline" width="100%" colorScheme="red">
              Unable to Attend
            </Button>
          </>
        );
      case "DENIED":
        return (
          <>
            Thank you for taking the time to apply to our event. Unfortunately, we are only able to
            take a limited number of qualified students each year due to space and funding
            constraints. You can read more about our admissions process on our{" "}
            <Link href="https://medium.com/@thehexlabs" target="_blank" color="teal">
              Medium blog
            </Link>
            . We hope to see you again at another one of our events in the future!
          </>
        );
      case "NOT_ATTENDING":
        return (
          <>
            You have confirmed that you will not be attending our event. We are sorry to see you go,
            but hope to see you again at another one of our events in the future!
          </>
        );
      default:
        return (
          <>
            You haven't started an application yet. Please choose a path from the list below to get
            started.
          </>
        );
    }
  }, [application]);

  if (profileLoading || applicationsLoading || branchesLoading) {
    return <LoadingScreen />;
  }

  if (profileError) return <ErrorScreen error={profileError} />;
  if (applicationsError) return <ErrorScreen error={applicationsError} />;
  if (branchesError) return <ErrorScreen error={branchesError} />;

  return (
    <Flex flexDir="column" padding={{ base: "0 0 16px", md: "32px 48px" }} margin="auto" gap="30px">
      <Box
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
        paddingX={{ base: "16px", md: "32px" }}
        paddingY="32px"
        color="white"
        bgGradient={{
          base: "linear(to-b, #33c2ff, #7b69ec)",
          md: "linear(to-r, #33c2ff, #7b69ec)",
        }}
      >
        <Heading size="xl" marginBottom="15px">
          Welcome, {profile.name?.first}!
        </Heading>
        <Text>
          Registration is currently open for {currentHexathon.name} and we'd love to see you there!
          Please reach out to{" "}
          <Link href="mailto:hello@hexlabs.org" target="_blank" textDecorationLine="underline">
            hello@hexlabs.org
          </Link>{" "}
          if you have any questions.
        </Text>
      </Box>
      <Box>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Confirm Not Attending
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text>{application.status === "WAITLISTED" ? "Are you sure you'd like to decline your spot on the waitlist?": "Are you sure you're no longer able to attend?"}</Text>

                <Text color='red.600' fontWeight='bold'>This action cannot be undone.</Text>
              </AlertDialogBody>
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
      </Box>
      <Box paddingX={{ base: "16px", md: "32px" }} paddingY="15px">
        <Flex
          direction={["column", "row"]}
          justifyContent="center"
          alignItems="center"
          gap="20px"
          marginBottom="5px"
        >
          <Heading size="lg" lineHeight="inherit">
            Your Status:
          </Heading>
          <Box>
            <ApplicationStatusTag
              status={application?.status}
              size="lg"
              style={{ fontSize: "18px" }}
            />
          </Box>
        </Flex>
        <Text textAlign="center" maxWidth="1000px" margin="auto">
          {applicationStatusDescription}
        </Text>
      </Box>
      {application && (
        <Box marginX={{ base: "15px", md: 0 }}>
          <Heading fontWeight="semibold" marginBottom="20px">
            Your Application
          </Heading>
          <CurrentApplicationTile application={application} />
        </Box>
      )}
      {application?.status === "CONFIRMED" && (
        <>
          <Box>
            <Heading>Your Code</Heading>
            <Text>Use this QR code to check into the event.</Text>
          </Box>
          <QRCodeSVG
            value={JSON.stringify({
              uid: user?.uid,
              name: {
                first: profile.name?.first,
                last: profile.name?.last,
              },
              email: user?.email,
            })}
            size={Math.min(screenWidth * 0.7, 250)}
            style={{ alignSelf: "center" }}
          />
        </>
      )}
      {(!application ||
        ["DRAFT", "APPLIED", "WAITLISTED", "DENIED", "NOT_ATTENDING"].includes(
          application.status
        )) && (
        <Box marginX={{ base: "15px", md: 0 }}>
          <Heading fontWeight="semibold" marginBottom="10px">
            Application Paths
          </Heading>
          <Text marginBottom="20px">
            Select one of the paths below to apply to {currentHexathon.name}. If you've already
            started an application, you can change to a different type at any time until it closes.
          </Text>
          <Branches application={application} branches={branches} />
        </Box>
      )}
      <Divider alignSelf="center" width="95%" />
      <Heading fontWeight="semibold" alignSelf="center" marginX={{ base: "15px", md: 0 }}>
        Future Events
      </Heading>
      <Text marginX={{ base: "15px", md: 0 }}>
        If you can't make it to {currentHexathon.name}, don't worry. We have more events planned for
        the next year, so be on the look out. Follow us on social media to stay in the loop!
      </Text>
      <Box marginX={{ base: "15px", md: 0 }}>
        <FutureEventsTimeline />
      </Box>
    </Flex>
  );
};

export default Dashboard;
