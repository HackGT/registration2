import React from 'react';
import {HStack, Text, useRadioGroup, VStack} from "@chakra-ui/react";

import ScoreButton from './ScoreButton';


export const AI_SCORE_OPTIONS = [
  { value: "1", description: "No or very little chance of AI" },
  { value: "2", description: "Some hints but unsure, sounds possibly like AI" },
  { value: "3", description: "Fairly or very confident this is AI" },
];


type ScoreButtonsProps = {
	requiresAiScore: boolean;
	gradingRubric?: Record<string, string>;
	essayScore: string;
	setEssayScore: (score: string) => void;
	aiScore: string;
	setAiScore: (score: string) => void;
};

export const ScoreButtons = (props: ScoreButtonsProps) => {

	const {
		getRootProps: getEssayRootProps,
		getRadioProps: getEssayRadioProps,
	} = useRadioGroup({
    name: "score",
		value: props.essayScore,
    onChange: props.setEssayScore,
  });

	const {
    getRootProps: getAiRootProps,
    getRadioProps: getAiRadioProps,
  } = useRadioGroup({
    name: "aiScore",
		value: props.aiScore,
    onChange: props.setAiScore,
  });

	const essayScoreGroup = getEssayRootProps();
  const aiScoreGroup = getAiRootProps();

	return (
		<VStack 
		marginX="auto"
		spacing={4}
		padding={8}
		maxWidth="500px"
		width="100%">
			{props.gradingRubric && (
				<HStack width="100%" justifyContent="space-between" {...essayScoreGroup}>
					<Text flex="1" fontWeight="semibold" textAlign="left">
						Score
					</Text>
					<HStack spacing={2}>
						{Object.keys(props.gradingRubric).map(key => (
							<ScoreButton key={key} {...getEssayRadioProps({ value: key })}>
								{key}
							</ScoreButton>
						))}
					</HStack>
				</HStack>
			)}

			{props.requiresAiScore && (
				<HStack width="100%" justifyContent="space-between" {...aiScoreGroup}>
					<Text flex="1" fontWeight="semibold" textAlign="left">
						Chance of AI
					</Text>
					<HStack spacing={2}>
						{AI_SCORE_OPTIONS.map(option => (
							<ScoreButton key={option.value} {...getAiRadioProps({ value: option.value })}>
								{option.value}
							</ScoreButton>
						))}
					</HStack>
				</HStack>
			)}
		</VStack>
	);
};
