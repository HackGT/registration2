import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
  useRadioGroup,
  useToast,
} from "@chakra-ui/react";
import { apiUrl, handleAxiosError, LoadingScreen, Service } from "@hex-labs/core";

import ApplicantAnswer from "./ApplicantAnswer";
import ScoreButton from "./ScoreButton";

// Graders rate how much an essay reads like AI separately from its score, so they can grade the
// content on its merits and record the suspicion on its own axis.
const AI_SCORE_OPTIONS = [
  { value: "1", description: "No or very little chance of AI" },
  { value: "2", description: "Some hints but unsure, sounds possibly like AI" },
  { value: "3", description: "Fairly or very confident this is AI" },
];

// Keyboard shortcuts for the AI score. 1-4 are already bound to the essay score, so this uses the
// home row instead.
const AI_SCORE_KEYS: Record<string, string> = { a: "1", s: "2", d: "3" };

const GradingQuestionPage: React.FC = () => {
  const { hexathonId, gradingGroup } = useParams();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState<ApplicantAnswer>({
    essayId: "",
    branch: "",
    question: "",
    criteria: "",
    answer: "",
    rubricLink: "",
    gradingRubric: {},
    isCalibrationQuestion: false,
  });
  const [score, setScore] = useState<string>("");
  const [aiScore, setAiScore] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const toast = useToast();
  const [isDesktop] = useMediaQuery("(min-width: 600px)");

  const { setValue, getRootProps, getRadioProps } = useRadioGroup({
    name: "score",
    onChange: setScore,
  });

  const {
    setValue: setAiValue,
    getRootProps: getAiRootProps,
    getRadioProps: getAiRadioProps,
  } = useRadioGroup({
    name: "aiScore",
    onChange: setAiScore,
  });

  const group = getRootProps();
  const aiGroup = getAiRootProps();

  // Calibration questions are graded against canned answers and the API discards any AI score sent
  // with them, so only ask for one on real applications.
  const requiresAiScore = !questionData.isCalibrationQuestion;
  const canSubmit = !!score && (!requiresAiScore || !!aiScore);

  const retrieveQuestion = useCallback(async () => {
    try {
      const response = await axios.post(
        apiUrl(Service.REGISTRATION, "/grading/actions/retrieve-question"),
        {
          hexathon: hexathonId,
          gradingGroup,
        }
      );
      setQuestionData(response.data);
    } catch (err: any) {
      handleAxiosError(err);
    }
    setLoading(false);
  }, [gradingGroup, hexathonId]);

  const skipQuestion = useCallback(async () => {
    await axios.post(apiUrl(Service.REGISTRATION, "/grading/actions/skip-question"), {
      hexathon: hexathonId,
    });
    setLoading(true);
    // Clear the same state submitReview does. Without this the next essay renders with the
    // previous one's buttons still selected and submitting already enabled, so a single stray
    // click or Enter files the previous essay's scores against a different applicant.
    setValue("");
    setScore("");
    setAiValue("");
    setAiScore("");
    retrieveQuestion();
  }, [hexathonId, setValue, setAiValue, retrieveQuestion]);

  const submitReview = useCallback(
    async (payload: {
      applicationId?: string;
      essayId: string;
      criteria: string;
      score: number;
      aiScore?: number;
      isCalibrationQuestion: boolean;
    }) => {
      setSubmitButtonDisabled(true);
      await axios.post(apiUrl(Service.REGISTRATION, "/grading/actions/submit-review"), {
        ...payload,
        hexathon: hexathonId,
        gradingGroup,
      });
      setLoading(true);
      setValue("");
      setScore("");
      setAiValue("");
      setAiScore("");
      retrieveQuestion();
      window.scrollTo(0, 0);
      setSubmitButtonDisabled(false);
    },
    [gradingGroup, hexathonId, setValue, setAiValue, retrieveQuestion]
  );

  useEffect(() => {
    const keyUpHandler = ({ key }: any) => {
      if (key === "1" || key === "2" || key === "3" || key === "4") {
        setScore(key);
        setValue(key);
      } else if (requiresAiScore && AI_SCORE_KEYS[key?.toLowerCase()]) {
        const value = AI_SCORE_KEYS[key.toLowerCase()];
        setAiScore(value);
        setAiValue(value);
      } else if (key === "Enter" && canSubmit) {
        if (submitButtonDisabled) {
          toast({
            title: "Please wait",
            description: "Please read the entire response before submitting your review.",
            status: "info",
            duration: 2000,
          });
        } else {
          submitReview({
            applicationId: questionData?.applicationId,
            essayId: questionData?.essayId,
            criteria: questionData?.criteria,
            score: parseInt(score),
            aiScore: requiresAiScore ? parseInt(aiScore) : undefined,
            isCalibrationQuestion: questionData?.isCalibrationQuestion,
          });
        }
      }
    };

    window.addEventListener("keyup", keyUpHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [
    questionData,
    score,
    aiScore,
    canSubmit,
    requiresAiScore,
    setValue,
    setAiValue,
    submitButtonDisabled,
    submitReview,
    toast,
  ]);

  useEffect(() => {
    retrieveQuestion();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (Object.keys(questionData).length === 0) {
    return (
      <Box width="100%" textAlign="center">
        <Heading paddingTop="60px" paddingBottom="40px">
          All applications have been graded!
        </Heading>
        <Button onClick={() => navigate(`/${hexathonId}/grading`)}>
          Return to Grading Dashboard
        </Button>
      </Box>
    );
  }

  const rubricTable = (
    <Table width="100%">
      <Thead position="sticky" top="0" bg="white">
        <Tr>
          <Th isNumeric>Score</Th>
          <Th>Criteria</Th>
        </Tr>
      </Thead>
      <Tbody>
        {questionData.gradingRubric &&
          Object.keys(questionData.gradingRubric).map(key => (
            <Tr key={key}>
              <Td isNumeric fontWeight="bold">
                {key}
              </Td>
              <Td>
                {questionData.gradingRubric[key]
                  .split("\n")
                  .map((line: string, index: number, array: any[]) =>
                    line.includes("•") ? (
                      <Text
                        key={line}
                        paddingBottom={index === array.length - 1 ? "0px" : "5px"}
                        style={{ marginLeft: 20, textIndent: -11 }}
                      >
                        {line}
                      </Text>
                    ) : (
                      <Text
                        key={line}
                        fontWeight="semibold"
                        paddingBottom={index === array.length - 1 ? "0px" : "5px"}
                      >
                        {line}
                      </Text>
                    )
                  )}
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );

  return (
    <>
      {isDesktop && (
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>Tip</AlertTitle>
          <AlertDescription>
            We have keyboard shortcuts! 1-4 for main score, a-s-d for AI rating!
          </AlertDescription>
        </Alert>
      )}
      <Stack
        direction={{ base: "column", md: "row" }}
        margin="auto"
        marginTop={{ base: "20px", md: "40px" }}
        marginBottom="10px"
        width="90%"
        spacing="10px"
      >
        <Box width={{ base: "100%", md: "50%" }} marginBottom="10px">
          <Heading paddingTop="5px" fontSize="20px" width="100%" bg="white">
            {questionData?.question}
            <Divider paddingTop="11px" />
          </Heading>
          <Text marginY="20px" paddingX="20px">
            {questionData?.answer}
          </Text>
        </Box>
        <Box margin="auto" width="50%" display={{ base: "none", md: "block" }}>
          {rubricTable}
        </Box>
      </Stack>
      <HStack
        maxWidth="400px"
        margin="auto"
        justifyContent="space-between"
        padding="30px 15px"
        {...group}
      >
        {questionData.gradingRubric &&
          Object.keys(questionData.gradingRubric).map(key => (
            <ScoreButton key={key} {...getRadioProps({ value: key })}>
              {key}
            </ScoreButton>
          ))}
      </HStack>
      {requiresAiScore && (
        <Box maxWidth="400px" margin="auto" paddingX="15px" paddingBottom="25px">
          <Divider marginBottom="20px" />
          <Text fontWeight="semibold" textAlign="center">
            Likelihood of AI
          </Text>
          <Text fontSize="sm" color="gray.600" textAlign="center" marginTop="4px">
            How much does this sound like AI?
          </Text>
          <HStack justifyContent="space-between" padding="20px 0px" {...aiGroup}>
            {AI_SCORE_OPTIONS.map(option => (
              <ScoreButton key={option.value} {...getAiRadioProps({ value: option.value })}>
                {option.value}
              </ScoreButton>
            ))}
          </HStack>
          <Stack spacing="3px">
            {AI_SCORE_OPTIONS.map(option => (
              <Text key={option.value} fontSize="xs" color="gray.600">
                <b>{option.value}</b>: {option.description}
              </Text>
            ))}
          </Stack>
        </Box>
      )}
      <HStack margin="auto" width="300px" direction="row" justifyContent="space-between">
        <Button disabled={questionData.isCalibrationQuestion} onClick={skipQuestion}>
          Skip Question
        </Button>
        <Button
          isLoading={submitButtonDisabled}
          disabled={!canSubmit || submitButtonDisabled}
          onClick={() =>
            submitReview({
              applicationId: questionData?.applicationId,
              essayId: questionData?.essayId,
              criteria: questionData?.criteria,
              score: parseInt(score),
              aiScore: requiresAiScore ? parseInt(aiScore) : undefined,
              isCalibrationQuestion: questionData?.isCalibrationQuestion,
            })
          }
        >
          Submit Review
        </Button>
      </HStack>
      <Box width="90%" margin="auto" marginTop="30px" display={{ base: "block", md: "none" }}>
        {rubricTable}
      </Box>
    </>
  );
};

export default GradingQuestionPage;
