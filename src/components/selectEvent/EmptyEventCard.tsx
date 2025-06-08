import React from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";

import { CARD_HEIGHT, CARD_HEIGHT_SM } from "./EventCard";

const EmptyEventCard = (props: {noEvents?: boolean}) => (
	<Flex
	direction="column"
	position="relative"
	w="100%"
	alignItems="center"
	justifyContent="center"
	color="white"
	border="1px"
	borderColor="gray.200"
	borderRadius={6}
	overflow="hidden"
	shadow="sm"
	padding={{base: 3, lg: 5}}
	height={{base: CARD_HEIGHT_SM, lg: CARD_HEIGHT}}>
		<Heading textAlign="center" fontSize={{base: 'xl', lg: '4xl'}} fontFamily="DM Sans, system-ui">
			{props.noEvents? "No Events at the Moment..." : "... And More to Come!"}
		</Heading>
		<Text textAlign="center" fontSize={{base: 'xs', lg: 'lg'}} fontFamily="DM Sans, system-ui">
			Check out our social media to stay up to date on new events!
		</Text>
	</Flex>
);

export default EmptyEventCard;
