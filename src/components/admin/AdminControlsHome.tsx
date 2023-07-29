import React from "react";
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import AdminMenuCard from "./AdminMenuCard";

const AdminControlsHome: React.FC = () => {
  const {
    isOpen: isBranchUserGuideOpen,
    onOpen: onBranchUserGuideOpen,
    onClose: onBranchUserGuideClose,
  } = useDisclosure();

  return (
    <Flex
      flexDir="column"
      padding={{ base: "0 0 8px 0", md: "32px 48px" }}
      margin="auto"
      maxWidth="1000px"
    >
      <Flex
        flexDir={{ base: "column", md: "row" }}
        bgGradient={{
          base: "linear(to-b, #33c2ff, #7b69ec)",
          md: "linear(to-r, #33c2ff, #7b69ec)",
        }}
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
        alignItems="center"
        justifyContent="space-around"
        marginBottom={{ base: "8px", md: "20px" }}
      >
        <Box
          color="white"
          paddingY={{ base: "24px", md: "24px" }}
          paddingLeft={{ base: "16px", md: "64px" }}
          paddingRight={{ base: "16px", md: "64px" }}
        >
          <Heading size="2xl" marginBottom="9px">
            Admin Controls
          </Heading>
        </Box>
      </Flex>
      <Drawer
        isOpen={isBranchUserGuideOpen}
        placement="right"
        onClose={onBranchUserGuideClose}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Registration User Guide</DrawerHeader>
          <DrawerBody>
            <Heading size="md">Overview</Heading>
            <Text>
              Registration uses the concept of branches to allow for customizability between
              different events. Branches essentially are application paths and are split into 2
              types: Application and Confirmation.
            </Text>
            <Heading size="md" marginTop="3" marginBottom="1">
              Application Branches
            </Heading>
            <Text>
              When a user first begins an application, they select an application branch. Each
              application branch can be setup to have different form questions. These application
              branches are different for each user type such as participant, judges, staff, etc.
              Even within user types, we often have multiple such as different application branches
              (for example, normal participants and participants who need travel assistance). This
              helps us greatly in the acceptance and grading process to split users. Application
              branches also have a lot of special settings like automatic confirmation and secret
              branches that you can read more about in the edit branch modal.
            </Text>
            <Heading size="md" marginTop="3" marginBottom="1">
              Confirmation Branches
            </Heading>
            <Text>
              When an applicant is accepted, they must be put on a confirmation branch. These
              confirmation branches usually have further questions like resume upload, etc.
              Typically, each application branch has a corresponding confirmation branch, but this
              flexibility allows us to mismatch in certain cases. For example, when we accept
              participants with travel assistance, they usually apply to the same application
              branch, but we place them on separate confirmation branches based on their travel
              assistance status (ie. separate confirmation branches for bus, car, and flight). This
              allows us to gather different information and send different emails to each group.
            </Text>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Stack spacing={4} marginX={{ base: 4, md: 0 }}>
        <Box
          borderRadius="4px"
          boxShadow={{
            base: "rgba(0, 0, 0, 0.15) 0px 0px 6px 1px",
          }}
        >
          <Box padding="20px 32px">
            <Text fontSize="sm" color="#858585">
              If you are new to registration, please read this guide before proceeding.
            </Text>
            <Button onClick={onBranchUserGuideOpen} size="sm" mt="1">
              Read User Guide
            </Button>
          </Box>
        </Box>
        <AdminMenuCard
          title="Statistics"
          description="View application statistics in tables & graphs"
          href="statistics"
        />
        <AdminMenuCard
          title="Applications"
          description="View detailed applicant information with filter & search tools"
          href="applications"
        />
        <AdminMenuCard
          title="Send Emails"
          description="Send one-off emails and view past emails sent"
          href="email"
        />
        <AdminMenuCard
          title="Branch Email Templates"
          description="Edit automatic post-apply and post-confirmation email templates"
          href="branch-email-templates"
        />
        <AdminMenuCard
          title="Branch Settings"
          description="Update application form questions & branch settings"
          href="branch-settings"
        />
      </Stack>
    </Flex>
  );
};
export default AdminControlsHome;
