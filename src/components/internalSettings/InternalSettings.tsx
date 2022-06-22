import React, { useEffect, useState } from "react";
import { Accordion, Button, Stack } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

import AccordionSection from "./AccordionSection";

const InternalSettings: React.FC = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [branchDict, setBranchDict] = useState<Record<string, any>>({});
  const { hexathonId } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`https://registration.api.hexlabs.org/applications/`);
        const allBranches: any[] = [];
        for (const element of res.data) {
          if (element.hexathon === hexathonId) {
            const applicationBranchName = element.applicationBranch.name;
            if (element.confirmationBranch) {
              const confirmationBranchName = element.confirmationBranch.name;
              if (!allBranches.includes(confirmationBranchName)) {
                allBranches.push(element.confirmationBranch);
              }
            }
            if (!allBranches.includes(applicationBranchName)) {
              allBranches.push(element.applicationBranch);
            }
          }
        }
        setBranches(allBranches);
      } catch (e: any) {
        console.log(e.message);
      }
    };
    getData();
  }, [hexathonId]);

  return (
    <Stack>
      <Accordion>
        {branches.map((branch: any) => (
          <AccordionSection
            {...branch}
            setBranchDict={setBranchDict}
            branchDict={branchDict}
            id={branch._id}
          />
        ))}
      </Accordion>
    </Stack>
  );
};

export default InternalSettings;
