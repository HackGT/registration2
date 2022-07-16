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
  University: "WHAT UNIVERSITY DO YOU ATTEND?",
  Age: "ARE YOU OVER 18?",
  Major: "WHAT MAJOR ARE YOU?",
  Gender: "WHAT GENDER ARE YOU?",
};

interface IProps {
  name: string;
  data: Record<string, Array<any>>;
}

const GraphAccordionSection: React.FC<IProps> = props => {
  const lol = "lol";
  return (
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
                (genders[element.gender] = genders[element.gender]
                  ? genders[element.gender] + 1
                  : 1);
            }

            return (
              <VStack>
                <Heading size="lg">{key}</Heading>
                <HStack>
                  <BarGraphView graphQuestion={graphQuestions.University} data={universities} />
                  <BarGraphView graphQuestion={graphQuestions.Age} data={ages} />
                  <BarGraphView graphQuestion={graphQuestions.Major} data={majors} />
                  <BarGraphView graphQuestion={graphQuestions.Gender} data={genders} />
                </HStack>
              </VStack>
            );
          })}
        </AccordionPanel>
      </AccordionItem>
    </Box>
  );
};

export default GraphAccordionSection;
