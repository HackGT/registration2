import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import BarGraphView from "./GraphView";

const graphQuestions = {
  University: "What university do you attend?",
  Age: "Are you over 18?",
  Major: "What major are you?",
  Gender: "What gender are you?",
};

interface IProps {
  name: string;
  data: Record<string, Array<any>>;
}

const GraphAccordionSection: React.FC<IProps> = props => (
  <Box borderWidth={1} margin={10}>
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            {props.name}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        {Object.keys(props.data).map(key => {
          const universities: Record<string, number> = {};
          const ages: Record<string, number> = {};
          const majors: Record<string, number> = {};
          const genders: Record<string, number> = {};

          for (const element of props.data[key]) {
            // records frequency of applicants' school
            "school" in element &&
              (universities[element.school] = universities[element.school]
                ? universities[element.school] + 1
                : 1);
            // records whether the applicant is over 18 or not
            if ("adult" in element) {
              if (element.adult) {
                if (ages.Yes) {
                  ages.Yes += 1;
                } else {
                  ages.Yes = 1;
                }
              } else if (ages.No) {
                ages.No += 1;
              } else {
                ages.No = 1;
              }
            }
            // records applicants' majors
            "major" in element &&
              (majors[element.major] = majors[element.major] ? majors[element.major] + 1 : 1);
            // records applicants' genders
            "gender" in element &&
              (genders[element.gender] = genders[element.gender] ? genders[element.gender] + 1 : 1);
          }

          return (
            <VStack>
              <Heading size="lg">{key}</Heading>
              {Object.keys(universities).length ||
              Object.keys(ages).length ||
              Object.keys(majors).length ||
              Object.keys(genders).length ? (
                <HStack>
                  {Object.keys(universities).length && (
                    <BarGraphView graphQuestion={graphQuestions.University} data={universities} />
                  )}
                  {Object.keys(ages).length && (
                    <BarGraphView graphQuestion={graphQuestions.Age} data={ages} />
                  )}
                  {Object.keys(majors).length && (
                    <BarGraphView graphQuestion={graphQuestions.Major} data={majors} />
                  )}
                  {Object.keys(genders).length && (
                    <BarGraphView graphQuestion={graphQuestions.Gender} data={genders} />
                  )}
                </HStack>
              ) : (
                <Heading size="md">{`No statistics for ${key}`}</Heading>
              )}
            </VStack>
          );
        })}
      </AccordionPanel>
    </AccordionItem>
  </Box>
);

export default GraphAccordionSection;
