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
import BarGraphView from "./BarGraphView";

import PieGraphView from "./PieGraphView";
import TableView from "./TableView";

interface IProps {
  name: string;
  data: Record<string, Array<any>>;
}

const GraphAccordionSection: React.FC<IProps> = props => (
  <AccordionItem>
    <h2>
      <AccordionButton paddingY="15px">
        <Box flex="1" textAlign="left">
          <Heading size="md">{props.name}</Heading>
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
        const schoolYear: Record<string, number> = {};

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
          "schoolYear" in element &&
            (schoolYear[element.schoolYear] = schoolYear[element.schoolYear]
              ? schoolYear[element.schoolYear] + 1
              : 1);
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
                  <TableView heading="Universities" data={universities} />
                )}
                <VStack>
                  {Object.keys(majors).length && (
                    <TableView heading="Majors" data={majors} />
                  )}
                  {Object.keys(schoolYear).length && <BarGraphView heading="School Year" data={schoolYear} />}
                  {Object.keys(genders).length && (
                    <PieGraphView heading='Gender' data={genders} />
                  )}
                </VStack>
              </HStack>
            ) : (
              <Heading size="md">{`No statistics for ${key}`}</Heading>
            )}
          </VStack>
        );
      })}
    </AccordionPanel>
  </AccordionItem>
);

export default GraphAccordionSection;
