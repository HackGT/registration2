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

import BarGraphView from "./graphs/BarGraphView";
import PieGraphView from "./graphs/PieGraphView";
import TableView from "./graphs/TableView";

interface IProps {
  name: string;
  data: Record<string, any>;
}

function sortObjectByValue(obj: any) {
  const items = Object.keys(obj).map(key => [key, obj[key]]);
  items.sort((first, second) => second[1] - first[1]);
  const sortedObj: any = {};
  for (const item of items) {
    const useKey = item[0];
    const useValue = item[1];
    sortedObj[useKey] = useValue;
  }
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
  // props.data.shirtSizeData = {"M": 12, "S": 2};
  // props.data.dietaryRestrictionsData = {"Veg": 12, "Non-veg": 2};
  // props.data.marketingData = {"MLH": 10, "Google": 30, "Friend": 50};
  // console.log(props);
  const isStatisticsAvailable =
    Object.keys(props.data.schoolData).length ||
    Object.keys(props.data.majorData).length ||
    Object.keys(props.data.schoolYearData).length ||
    Object.keys(props.data.genderData).length ||
    Object.keys(props.data.marketingData).length ||    
    Object.keys(props.data.shirtSizeData).length ||
    Object.keys(props.data.dietaryRestrictionsData).length;

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
          {isStatisticsAvailable ? (
            <HStack>
              {Object.keys(props.data.schoolData).length && (
                <TableView heading="Universities" data={sortObjectByValue(props.data.schoolData)} />
              )}
              <VStack spacing={10}>
                {Object.keys(props.data.majorData).length && (
                  <TableView heading="Majors" data={sortObjectByValue(props.data.majorData)} />
                )}
                {Object.keys(props.data.schoolYearData).length && (
                  <BarGraphView
                    heading="School Year"
                    data={sortObjectByKey(props.data.schoolYearData)}
                  />
                )}
                {Object.keys(props.data.genderData).length && (
                  <PieGraphView heading="Gender" data={sortObjectByKey(props.data.genderData)} />
                )}
                {Object.keys(props.data.marketingData).length && (
                  <PieGraphView heading="Marketing Source" data={sortObjectByKey(props.data.marketingData)} />
                )}
                {Object.keys(props.data.shirtSizeData).length && (
                  <TableView heading="Shirt Size" data={sortObjectByValue(props.data.shirtSizeData)} />
                )}
                {Object.keys(props.data.dietaryRestrictionsData).length && (
                  <TableView heading="Dietary Restrictions" data={sortObjectByValue(props.data.dietaryRestrictionsData)} />
                )}
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
