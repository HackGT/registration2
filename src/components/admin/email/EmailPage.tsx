import { Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react";
import React from "react";

import PastEmailsTab from "./PastEmailsTab";
import SendEmailTab from "./SendEmailTab";

const EmailPage: React.FC = () => (
  <Tabs paddingX="15px" paddingTop="15px" isFitted align="center">
    <TabList maxWidth="700px">
      <Tab>Send Batch Email</Tab>
      <Tab>Past Emails</Tab>
    </TabList>

    <TabPanels textAlign="left">
      <TabPanel>
        <SendEmailTab />
      </TabPanel>
      <TabPanel>
        <PastEmailsTab />
      </TabPanel>
    </TabPanels>
  </Tabs>
);

export default EmailPage;
