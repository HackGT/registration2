import React from "react";
import {
  Box,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tag,
  VStack,
  HStack,
} from "@chakra-ui/react";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";

import Loading from "../../../util/Loading";

const ApplicationDetailPage: React.FC = () => {
  const { applicationId } = useParams();
  const [{ data, loading, error }] = useAxios(
    `https://registration.api.hexlabs.org/applications/${applicationId}`
  );

  if (loading || error) {
    return <Loading />;
  }

  return (
    <Box paddingX="50px">
      <VStack spacing="6px" align="left" paddingBottom="10px">
        <Heading as="h1" size="xl" fontWeight={700}>
          {data.userInfo.name.first} {data.userInfo.name.last}
        </Heading>
        <Heading as="h2" size="s" fontWeight={500} color="grey">
          Application Track: {data.applicationBranch.name}
        </Heading>
        <HStack>
          <Tag colorScheme="blue">{data.applied ? "Applied" : "Not Applied"}</Tag>
          <Tag colorScheme="green">{data.confirmed ? "Confirmed" : "Not Confirmed"}</Tag>
        </HStack>
      </VStack>
      <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text style={{ fontWeight: "bold" }}>Contact Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={3}>
            <Text>{data.email}</Text>
            <Text>{data.phoneNumber}</Text>
            <Text>{data.applicationData.linkedin}</Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text style={{ fontWeight: "bold" }}>Application Statistics</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>{data.applicationData.adult ? "Older" : "Younger"} than 18 years old</Text>
            <Text>
              <span style={{ color: "Grey" }}>Attends</span> {data.applicationData.school}
            </Text>
            <Text>
              <span style={{ color: "Grey" }}>Studies</span> {data.applicationData.major}
            </Text>
            <Text>
              <span style={{ color: "Grey" }}>Identifies</span> as a {data.applicationData.gender}
            </Text>
            <Text>
              <span style={{ color: "Grey" }}>Ethnicity</span> is {data.applicationData.ethnicity}
            </Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text style={{ fontWeight: "bold" }}>Application Questions</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default ApplicationDetailPage;
