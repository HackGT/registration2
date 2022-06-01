import React from "react";
import {
  Box,
  Heading,
  Text,
  Textarea,
  Button,
  Tabs,
  Input,
  Select,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

const EmailScreen: React.FC = () => (
  <>
    <Box
      color="Black"
      paddingY={{ base: "32px", md: "32px" }}
      paddingLeft={{ base: "16px", md: "64px" }}
      paddingRight={{ base: "16px", md: "0" }}
    >
      <Heading size="2xl">Send a Batch Email</Heading>
      <Text fontSize="lg">test text</Text>
    </Box>

    {/* left side */}
    <Box>
      <Select placeholder="Select Recipient">
        <option value="participants">Participants</option>
        <option value="sponsors">Sponsors</option>
        <option value="mentors">Mentors</option>
      </Select>

      <Input placeholder="Subject" />

      <Textarea placeholder="Email Content..." />
      <Button colorScheme="purple">Send</Button>
    </Box>

    {/* right side */}
    <Box>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Format Guide</Tab>
          <Tab>Email Log</Tab>
          <Tab>Preview</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>format guide...</p>
          </TabPanel>
          <TabPanel>
            <p>email log...</p>
          </TabPanel>
          <TabPanel>
            <p>preview...</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  </>
);

export default EmailScreen;
