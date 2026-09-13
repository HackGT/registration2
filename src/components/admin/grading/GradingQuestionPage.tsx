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
  useToast,
} from "@chakra-ui/react";
import { apiUrl, handleAxiosError, LoadingScreen, Service } from "@hex-labs/core";

import ApplicantAnswer from "./ApplicantAnswer";
import { AI_SCORE_OPTIONS, ScoreButtons } from "./ScoreButtons";



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
    setScore("");
    setAiScore("");
    retrieveQuestion();
  }, [hexathonId, retrieveQuestion]);

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
      setScore("");
      setAiScore("");
      retrieveQuestion();
      window.scrollTo(0, 0);
      setSubmitButtonDisabled(false);
    },
    [gradingGroup, hexathonId, retrieveQuestion]
  );

  useEffect(() => {
    const keyUpHandler = ({ key }: any) => {
      if (key === "1" || key === "2" || key === "3" || key === "4") {
        setScore(key);
      } else if (requiresAiScore && AI_SCORE_KEYS[key?.toLowerCase()]) {
        const value = AI_SCORE_KEYS[key.toLowerCase()];
        setAiScore(value);
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
    submitButtonDisabled,
    submitReview,
    toast,
  ]);

  useEffect(() => {
    retrieveQuestion();
  }, [retrieveQuestion]);

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

  const aiScoreRubric = (
    <Box marginTop="10px" fontSize="md" color="gray.600">
      <Text fontWeight="semibold" marginBottom="5px">
        AI Scoring Guide
      </Text>
      {AI_SCORE_OPTIONS.map(option => (
        <Text key={option.value}>
          <b>{option.value}:</b> {option.description}
        </Text>
      ))}
    </Box>
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
          {aiScoreRubric}
        </Box>
      </Stack>

      <ScoreButtons
      essayScore={score}
      setEssayScore={setScore}
      aiScore={aiScore}
      setAiScore={setAiScore}
      gradingRubric={questionData.gradingRubric}
      requiresAiScore={requiresAiScore} />

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
        {aiScoreRubric}
      </Box>
    </>
  );
};

export default GradingQuestionPage;
