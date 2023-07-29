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
  const [loading, setLoading] = useState<boolean>(true);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const toast = useToast();
  const [isDesktop] = useMediaQuery("(min-width: 600px)");

  // Create timer based on length of answer to disable submit button
  useEffect(() => {
    if (questionData.answer) {
      const readingSpeed = 700; // Words per minute constant
      const numWords = questionData.answer.split(" ").length;
      const timer = setTimeout(
        () => setSubmitButtonDisabled(false),
        (numWords / readingSpeed) * 60 * 1000
      );

      // Clear timeout on unmount
      return () => {
        clearTimeout(timer);
      };
    }

    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }, [questionData]);

  const { setValue, getRootProps, getRadioProps } = useRadioGroup({
    onChange: setScore,
  });

  const group = getRootProps();

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
    retrieveQuestion();
  }, [hexathonId, retrieveQuestion]);

  const submitReview = useCallback(
    async (payload: {
      applicationId?: string;
      essayId: string;
      score: number;
      isCalibrationQuestion: boolean;
    }) => {
      await axios.post(apiUrl(Service.REGISTRATION, "/grading/actions/submit-review"), {
        ...payload,
        hexathon: hexathonId,
        gradingGroup,
      });
      setLoading(true);
      setValue("");
      setScore("");
      setSubmitButtonDisabled(true);
      retrieveQuestion();
      window.scrollTo(0, 0);
    },
    [gradingGroup, hexathonId, setValue, retrieveQuestion]
  );

  useEffect(() => {
    const keyUpHandler = ({ key }: any) => {
      if (key === "1" || key === "2" || key === "3" || key === "4") {
        setScore(key);
        setValue(key);
      } else if (key === "Enter" && !!score) {
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
            score: parseInt(score),
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
  }, [questionData, score, setValue, submitButtonDisabled, submitReview, toast]);

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

  return (
    <>
      {isDesktop && (
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>Tip</AlertTitle>
          <AlertDescription>
            Try using the keyboard (1, 2, 3, 4) + Enter to submit your scores quicker!
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
        <Box margin="auto" width={{ base: "100%", md: "50%" }}>
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
      <HStack margin="auto" width="300px" direction="row" justifyContent="space-between">
        <Button disabled={questionData.isCalibrationQuestion} onClick={skipQuestion}>
          Skip Question
        </Button>
        <Button
          disabled={!score || submitButtonDisabled}
          onClick={() =>
            submitReview({
              applicationId: questionData?.applicationId,
              essayId: questionData?.essayId,
              score: parseInt(score),
              isCalibrationQuestion: questionData?.isCalibrationQuestion,
            })
          }
        >
          Submit Review
        </Button>
      </HStack>
    </>
  );
};

export default GradingQuestionPage;
