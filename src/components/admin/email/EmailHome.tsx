import { Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react";
import React from "react";

import PastEmailsScreen from "./PastEmailsScreen";
import SendEmailScreen from "./SendEmailScreen";

const EmailHome: React.FC = () => (
  <Tabs paddingX="15px" paddingTop="15px" isFitted align="center">
    <TabList maxWidth="700px">
      <Tab>Send Batch Email</Tab>
      <Tab>Past Emails</Tab>
    </TabList>

    <TabPanels textAlign="left">
      <TabPanel>
        <SendEmailScreen />
      </TabPanel>
      <TabPanel>
        <PastEmailsScreen />
      </TabPanel>
    </TabPanels>
  </Tabs>
);

export default EmailHome;
