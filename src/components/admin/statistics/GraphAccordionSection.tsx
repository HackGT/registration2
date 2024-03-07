import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Grid,
  GridItem,
  Heading,
  VStack,
  useBreakpointValue,
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
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isStatisticsAvailable =
    Object.keys(props.data.schoolData).length ||
    Object.keys(props.data.majorData).length ||
    Object.keys(props.data.schoolYearData).length ||
    Object.keys(props.data.genderData).length ||
    Object.keys(props.data.marketingData).length ||
    Object.keys(props.data.shirtSizeData).length ||
    Object.keys(props.data.dietaryRestrictionsData).length ||
    Object.keys(props.data.trackPreferenceData).length;

  return isStatisticsAvailable ? (
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
        {isMobile ? <VStack>
          {Object.keys(props.data.schoolData).length && (
            <TableView heading="Universities" data={sortObjectByValue(props.data.schoolData)} />
          )}
          {Object.keys(props.data.majorData).length && (
            <TableView heading="Majors" data={sortObjectByValue(props.data.majorData)} />
          )}
          {Object.keys(props.data.schoolYearData).length && (
            <BarGraphView
              heading="School Year"
              data={sortObjectByKey(props.data.schoolYearData)}
            />
          )}
          {Object.keys(props.data.shirtSizeData).length && (
            <TableView
              heading="Shirt Size"
              data={sortObjectByValue(props.data.shirtSizeData)}
            />
          )}
          {Object.keys(props.data.dietaryRestrictionsData).length && (
            <TableView
              heading="Dietary Restrictions"
              data={sortObjectByValue(props.data.dietaryRestrictionsData)}
            />
          )}
          {Object.keys(props.data.marketingData).length && (
            <PieGraphView
              heading="Marketing Source"
              data={sortObjectByKey(props.data.marketingData)}
            />
          )}
          {Object.keys(props.data.trackPreferenceData).length && (
            <PieGraphView
              heading="Track Preference"
              data={sortObjectByKey(props.data.trackPreferenceData)}
            />
          )}
          {Object.keys(props.data.genderData).length && (
            <PieGraphView heading="Gender" data={sortObjectByKey(props.data.genderData)} />
          )}
        </VStack>
        : <Grid templateColumns="repeat(3, 1fr)" templateRows="repeat(3, 1fr)" gap={7} overflowX="auto" mt={5} justifyItems="center">
          <GridItem>
            {Object.keys(props.data.schoolData).length && (
              <TableView heading="Universities" data={sortObjectByValue(props.data.schoolData)} />
            )}
          </GridItem>
          <GridItem>
            {Object.keys(props.data.majorData).length && (
              <TableView heading="Majors" data={sortObjectByValue(props.data.majorData)} />
            )}
          </GridItem>
          <GridItem alignSelf="center">
            {Object.keys(props.data.schoolYearData).length && (
              <BarGraphView
                heading="School Year"
                data={sortObjectByKey(props.data.schoolYearData)}
              />
            )}
          </GridItem>
          <GridItem pt={10}>
            {Object.keys(props.data.shirtSizeData).length && (
              <TableView
                heading="Shirt Size"
                data={sortObjectByValue(props.data.shirtSizeData)}
              />
            )}
          </GridItem>
          <GridItem pt={10}>
            {Object.keys(props.data.marketingData).length && (
              <PieGraphView
                heading="Marketing Source"
                data={sortObjectByKey(props.data.marketingData)}
              />
            )}
          </GridItem>
          <GridItem rowSpan={2} pt={10}>
            {Object.keys(props.data.genderData).length && (
              <PieGraphView heading="Gender" data={sortObjectByKey(props.data.genderData)} />
            )}
          </GridItem>
          <GridItem>
            {Object.keys(props.data.dietaryRestrictionsData).length && (
              <TableView
                heading="Dietary Restrictions"
                data={sortObjectByValue(props.data.dietaryRestrictionsData)}
              />
            )}
          </GridItem>
          <GridItem>
            {Object.keys(props.data.trackPreferenceData).length && (
              <PieGraphView
                heading="Track Preference"
                data={sortObjectByKey(props.data.trackPreferenceData)}
              />
            )}
          </GridItem>
        </Grid>}
      </AccordionPanel>
    </AccordionItem>
  ) : (
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
          <Heading size="md">No statistics available</Heading>
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default GraphAccordionSection;
