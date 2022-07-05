import React from "react";
import Loading from "../../util/Loading";
import { Box, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Tag } from "@chakra-ui/react";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";

const ParticipantIndividual: React.FC = () => {
  const { applicationId } = useParams();
  const [{ data, loading, error }] = useAxios(`https://registration.api.hexlabs.org/application/${applicationId}`);

  if (loading || error) {
    return <Loading />;
  }

  return (
    <Box>
      <Box style={{paddingLeft: '50px'}}>
        <Heading as="h1" size="xl" fontWeight={700} style={{paddingTop: '30px'}}>{data.name.first} {data.name.last}</Heading>
        <Heading as="h2" size="xs" fontWeight={500} style={{color: 'grey'}}>Hackathon Track: {data.applicationBranch.name}</Heading>
        <Text><Tag colorScheme='blue'>{data.applied ? 'Applied' : 'Not Applied'}</Tag> <Tag colorScheme='green'>{data.confirmed ? 'Confirmed' : 'Not Confirmed'}</Tag></Text>
      </Box>
      <Accordion style={{paddingTop: '10px', paddingLeft: '50px', paddingRight: '50px'}} defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                <Text style={{fontWeight: "bold"}}>Contact Information</Text>
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
              <Box flex='1' textAlign='left'>
                <Text style={{fontWeight: "bold"}}>Application Statistics</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              {data.applicationData.adult ? 'Older' : 'Younger'} than 18 years old
            </Text>
            <Text>
              <span style={{color: "Grey"}}>
                Attends
              </span> 
              {" "} {data.applicationData.school}
            </Text>
            <Text>
              <span style={{color: "Grey"}}>
                Studies
              </span> 
              {" "} {data.applicationData.major}
            </Text>
            <Text>
              <span style={{color: "Grey"}}>
                Identifies
              </span> 
              {" "} as a {data.applicationData.gender}
            </Text>
            <Text>
              <span style={{color: "Grey"}}>
                Ethnicity
              </span> 
              {" "} is {data.applicationDataa.ethnicity}
            </Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                <Text style={{fontWeight: "bold"}}>Application Questions</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
     </Box>
  );
};

export default ParticipantIndividual;