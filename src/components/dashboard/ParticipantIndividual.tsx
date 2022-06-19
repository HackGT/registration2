import React, { useState, useEffect } from "react";
import { Box, Flex, SimpleGrid, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Tag, TagLabel, TagLeftIcon, TagRightIcon, TagCloseButton } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ParticipantIndividual: React.FC = () => {
  const { applicationId } = useParams();
  const [name, setName] = useState("name");
  const [gmail, setGmail] = useState("gmail");
  const [phone, setPhone] = useState("phone");
  const [linkedin, setLinkedin] = useState("linkedin");
  const [adult, setAdult] = useState(true);
  const [school, setSchool] = useState("school");
  const [major, setMajor] = useState("major");
  const [graduation, setGraduation] = useState(0);
  const [gender, setGender] = useState("gender");
  const [ethnicity, setEthnicity] = useState("ethnicity");
  const [applied, setApplied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const app = await axios.get(
          `https://registration.api.hexlabs.org/application/${applicationId}`
        );
        const user = await axios.get(
          `https://users.api.hexlabs.org/users/'${app.data.applicationData.userId}`
        )
        setName(`${user.data.name.first}{' '}${user.data.name.last}`);
        setGmail(user.data.email);
        setPhone(app.data.applicationData.phoneNumber);
        setLinkedin(app.data.applicationData.linkedin);
        setAdult(app.data.applicationData.adult);
        setSchool(app.data.applicationData.school);
        setMajor(app.data.applicationData.major);
        setGraduation(app.data.applicationData.graduationYear);
        setGender(app.data.applicationData.gender);
        setEthnicity(app.data.applicationData.ethnicity);
        setApplied(app.data.applied);
        setConfirmed(app.data.confirmed);
      } catch (e: any) {
        console.log(e.message);
      }
    };
    getUserData();
  }, []);

  return (
    <Box>
      <Box style={{paddingLeft: '50px'}}>
        <Heading as="h1" size="xl" fontWeight={700} style={{paddingTop: '30px'}}> {name} </Heading>
        <Heading as="h2" size="xs" fontWeight={500} style={{color: 'grey'}}> Hackathon Track </Heading>
        <Text><Tag colorScheme='blue'>{applied ? 'Applied' : 'Not Applied'}</Tag> <Tag colorScheme='green'>{confirmed ? 'Confirmed' : 'Not Confirmed'}</Tag></Text>
      </Box>
      <Accordion style={{paddingTop: '10px', paddingLeft: '50px', paddingRight: '50px'}} defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left' /* style={{ borderStyle: "solid", borderColor: "black", borderWidth: 1}} */>
                <Text style={{fontWeight: "bold"}}>Contact Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={3}>
            <Text>{gmail}</Text>
            <Text>{phone}</Text>
            <Text>{linkedin}</Text>
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
              {adult ? 'Older' : 'Younger'} than 18 years old
            </Text>
            <Text>
              <span style={{color: "Grey"}}>
                Attends
              </span> 
              {" "} {school}
            </Text>
            <Text>
              <span style={{color: "Grey"}}>
                Studies
              </span> 
              {" "} {major}
            </Text>
            <Text>
              <span style={{color: "Grey"}}>
                Identifies
              </span> 
              {" "} as a {gender}
            </Text>
            <Text>
              <span style={{color: "Grey"}}>
                Ethnicity
              </span> 
              {" "} is {ethnicity}
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