export default interface ApplicantAnswer {
  applicationId?: string;
  essayId: string;
  branch: string;
  criteria: string;
  question: string;
  answer: string;
  rubricLink: string;
  gradingRubric: any;
  isCalibrationQuestion: boolean;
}