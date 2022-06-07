import React from "react";
import {
  Box,
  Heading,
  Textarea,
  Button,
  Tabs,
  Input,
  Select,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Wrap,
  WrapItem,
  Stack,
} from "@chakra-ui/react";

import EmailContent from "./EmailContent";

const EmailScreen: React.FC = () => (
  <>
    <Box
      color="Black"
      paddingY={{ base: "32px", md: "32px" }}
      paddingLeft={{ base: "16px", md: "64px" }}
      paddingRight={{ base: "16px", md: "0" }}
    >
      <Heading size="2xl">Send a Batch Email</Heading>
    </Box>

    <Wrap
      paddingY={{ base: "32px", md: "32px" }}
      paddingLeft={{ base: "16px", md: "64px" }}
      paddingRight={{ base: "16px", md: "0" }}
      spacing="30px"
    >
      {/* left panel */}
      <WrapItem width="45%">
        <Stack width="100%">
          <Select placeholder="Select Recipient">
            <option value="participants">Participants</option>
            <option value="sponsors">Sponsors</option>
            <option value="mentors">Mentors</option>
          </Select>

          <Input placeholder="Subject" />

          <Textarea placeholder="Email Content..." h="50vh" />
          <Button colorScheme="purple">Send</Button>
        </Stack>
      </WrapItem>

      {/* right panel */}
      <WrapItem width="45%">
        <Tabs variant="soft-rounded" colorScheme="purple" width="100%">
          <TabList>
            <Tab>Format Guide</Tab>
            <Tab>Email Log</Tab>
            <Tab>Preview</Tab>
          </TabList>
          <TabPanels shadow="md">
            <TabPanel>
              <EmailContent
                heading="HTML & Variable Considerations"
                content="format guide content..."
              />
            </TabPanel>
            <TabPanel>
              <EmailContent heading="Email Log" content="content..." />
            </TabPanel>
            <TabPanel>
              <EmailContent heading="Preview" content="preview content..." />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </WrapItem>
    </Wrap>
  </>
);

export default EmailScreen;
