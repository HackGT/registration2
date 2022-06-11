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
        const groupedData: Record<string, any> = {};
        for (const element of res.data) {
          if (element.hexathon === hexathonId) {
            const applicationBranchName = element.applicationBranch.name;
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
                <option value="application">Application</option>
                <option value="confirmation">Confirmation</option>
              </Select>
              <InputGroup>
                <Input width="15rem" placeholder={applicationDict[applicationBranchName][0].applicationBranch.settings.open} size="sm" />
                <Input width="15rem" placeholder={applicationDict[applicationBranchName][0].applicationBranch.settings.close} size="sm" />
              </InputGroup>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Stack>
  );
};

export default InternalSettings;
