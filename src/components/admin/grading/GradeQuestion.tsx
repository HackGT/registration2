import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
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
  useRadioGroup,
} from "@chakra-ui/react";
import { apiUrl, handleAxiosError, LoadingScreen, Service } from "@hex-labs/core";

import ApplicantAnswer from "./ApplicantAnswer";
import ScoreButton from "./ScoreButton";

const GradeQuestion: React.FC = () => {
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

  const retrieveQuestion = async () => {
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
  };

  const skipQuestion = async () => {
    await axios.post(apiUrl(Service.REGISTRATION, "/grading/actions/skip-question"), {
      hexathon: hexathonId,
    });
    setLoading(true);
    retrieveQuestion();
  };

  const submitReview = async (payload: {
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
    retrieveQuestion();
    window.scrollTo(0, 0);
  };

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
          disabled={score.length === 0 || submitButtonDisabled}
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

export default GradeQuestion;
