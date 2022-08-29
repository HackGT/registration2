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
import { ErrorScreen, LoadingScreen } from "@hex-labs/core";

import { apiUrl, Service } from "../../../util/apiUrl";
import ApplicantAnswer from "./ApplicantAnswer";
import ScoreButton from "./ScoreButton";

const GradeQuestion: React.FC = () => {
  const { hexathonId } = useParams();
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
  const [error, setError] = useState<any>();

  const { setValue, getRootProps, getRadioProps } = useRadioGroup({
    onChange: setScore,
  });

  const group = getRootProps();

  const retrieveQuestion = async () => {
    try {
      const response = await axios.post(apiUrl(Service.REGISTRATION, "/grading/actions/retrieve-question"),{
        hexathon: hexathonId,
      });
      setQuestionData(response.data);
    } catch(e) {
      setError(e);
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
    hexathon?: string;
    score: number;
    isCalibrationQuestion: boolean;
  }) => {
    await axios.post(apiUrl(Service.REGISTRATION, "/grading/actions/submit-review"), payload);
    setLoading(true);
    retrieveQuestion();
  };

  useEffect(() => {
    retrieveQuestion();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
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
        <Box
          width={{ base: "100%", md: "50%" }}
          maxHeight="425px"
          overflowY="auto"
          marginBottom="10px"
        >
          <Heading
            paddingTop="5px"
            position="sticky"
            top="0"
            fontSize="20px"
            width="100%"
            bg="white"
          >
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
              {questionData.gradingRubric
                ? Object.keys(questionData.gradingRubric).map(key => (
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
                  ))
                : null}
            </Tbody>
          </Table>
        </Box>
      </Stack>
      <HStack margin="auto" width="400px" justifyContent="space-between" paddingY="30px" {...group}>
        {questionData.gradingRubric
          ? Object.keys(questionData.gradingRubric).map(key => {
              const radio = getRadioProps({ value: key });
              return (
                <ScoreButton key={key} {...radio}>
                  {key}
                </ScoreButton>
              );
            })
          : null}
      </HStack>
      <HStack margin="auto" width="300px" direction="row" justifyContent="space-between">
        <Button disabled={questionData.isCalibrationQuestion} onClick={skipQuestion}>
          Skip Question
        </Button>
        <Button
          disabled={score.length === 0}
          onClick={() => {
            const scoreNumber: number = +score;
            submitReview({
              applicationId: questionData?.applicationId,
              essayId: questionData?.essayId,
              hexathon: hexathonId,
              score: scoreNumber,
              isCalibrationQuestion: questionData?.isCalibrationQuestion,
            });
            setValue("");
            setScore("");
          }}
        >
          Submit Review
        </Button>
      </HStack>
    </>
  );
};

export default GradeQuestion;
