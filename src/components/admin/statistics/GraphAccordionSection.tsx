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

function sortObjectByValue(obj: any) {
  const items = Object.keys(obj).map(key => [key, obj[key]]);
  items.sort((first, second) => second[1] - first[1]);
  const sortedObj: any = {};
  for (const item of items) {
    const use_key = item[0];
    const use_value = item[1];
    sortedObj[use_key] = use_value;
  }
  items.map(item => {
    const key = item[0];
    const value = item[1];
    sortedObj[key] = value;
  });
  return sortedObj;
}

function sortObjectByKey(obj: any) {
  const sorted: string[] = [];
  for (const key of Object.keys(obj)) {
    sorted[sorted.length] = key;
  }
  sorted.sort();

  const sortedDict: Record<string, number> = {};
  for (let i = 0; i < sorted.length; i++) {
    sortedDict[sorted[i]] = obj[sorted[i]];
  }

  return sortedDict;
}

const GraphAccordionSection: React.FC<IProps> = props => {
  const universities: Record<string, number> = {};
  const ages: Record<string, number> = {};
  const majors: Record<string, number> = {};
  const genders: Record<string, number> = {};
  const schoolYear: Record<string, number> = {};

  Object.keys(props.data).map(key => {
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
  });

  return (
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
        <VStack>
          {Object.keys(universities).length ||
          Object.keys(ages).length ||
          Object.keys(majors).length ||
          Object.keys(genders).length ? (
            <HStack>
              {Object.keys(universities).length && (
                <TableView heading="Universities" data={sortObjectByValue(universities)} />
              )}
              <VStack>
                {Object.keys(majors).length && (
                  <TableView heading="Majors" data={sortObjectByValue(majors)} />
                )}
                {Object.keys(schoolYear).length && (
                  <BarGraphView heading="School Year" data={sortObjectByKey(schoolYear)} />
                )}
                {Object.keys(genders).length && <PieGraphView heading="Gender" data={genders} />}
              </VStack>
            </HStack>
          ) : (
            <Heading size="md">No statistics available</Heading>
          )}
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default GraphAccordionSection;
