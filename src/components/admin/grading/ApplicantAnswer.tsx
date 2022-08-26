export default class ApplicantAnswer {
  applicationId?: string;
  essayId: string;
  branch: string;
  criteria: string;
  question: string;
  answer: string;
  rubricLink: string;
  gradingRubric: any;
  isCalibrationQuestion: boolean;

  constructor(
    data: {
      applicationId?: string,
      essayId: string,
      branch: string,
      question: string,
      criteria: string,
      answer: string,
      rubricLink: string,
      gradingRubric: object,
      isCalibrationQuestion: boolean
    }
  ) {
    this.applicationId = data.applicationId;
    this.essayId = data.essayId;
    this.branch = data.branch;
    this.question = data.question;
    this.criteria = data.criteria;
    this.answer = data.answer;
    this.rubricLink = data.rubricLink;
    this.gradingRubric = data.gradingRubric;
    this.isCalibrationQuestion = data.isCalibrationQuestion;
  }
}