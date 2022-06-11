import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Stack,
  Input,
  InputGroup,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

const InternalSettings: React.FC = () => {
  const [applicationDict, setApplicationDict] = useState<Record<string, any>>({});
  const { hexathonId } = useParams();
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`https://registration.api.hexlabs.org/applications/`);
        console.log(res.data.length);
        const groupedData: Record<string, any> = {};
        for (const element of res.data) {
          if (element.hexathon === hexathonId) {
            const applicationBranchName = element.applicationBranch.name;
            console.log(applicationBranchName);
            if (!groupedData[applicationBranchName]) {
              groupedData[applicationBranchName] = [];
            }
            groupedData[applicationBranchName].push(element);
          }
        }
        setApplicationDict(groupedData);
      } catch (e: any) {
        console.log(e.message);
      }
    };
    getData();
  }, []);

  return (
    <Stack>
      <Accordion>
        {Object.keys(applicationDict).map((applicationBranchName: string) => (
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {applicationBranchName}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Select placeholder="Recipient">
                {/** need to display recipients for the current application branch, and based on selected recipient, set placeholders for open and close times */}
              </Select>
              <InputGroup>
                <Input width="15rem" placeholder="Open Time" size="sm" />
                <Input width="15rem" placeholder="Close Time" size="sm" />
              </InputGroup>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Stack>
  );
};

export default InternalSettings;
