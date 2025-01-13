import type { Line } from './Line';
import type { Sign } from './Sign';
import { getRndArrayIndex, getRndNumber, shuffleArray } from '~/utils';

enum SignQuestionType {
  SignGetKeyFromKey,
  SignGetTitleFromKey,
  SignGetKeyFromTitle,
}

export enum QuestionType {
  SignQuestion,
  LineQuestion,
}

type BaseSignQuestion<TQuestion, TAnswer> = {
  question: TQuestion;
  answers: TAnswer[];
  correctAnswer: TAnswer;
  skip: Sign['number'][];
  type: QuestionType;
  signQuestionType: SignQuestionType;
  questionAsImage: boolean;
  answersAsImages: boolean;
};

type SignGetKeyFromKey = BaseSignQuestion<Sign['number'], Sign['number']>;
type SignGetTitleFromKey = BaseSignQuestion<Sign['number'], Sign['title']>;
type SignGetKeyFromTitle = BaseSignQuestion<Sign['title'], Sign['number']>;

type SignQuestion = SignGetKeyFromKey | SignGetTitleFromKey | SignGetKeyFromTitle;

type LineQuestion = {
  question: Line['number'];
  answers: Line['number'][];
  correctAnswer: Line['number'];
  type: QuestionType;
  questionAsImage: boolean;
  answersAsImages: boolean;
}

export type Question = SignQuestion | LineQuestion;

function getSignQuestion(sign: Sign): SignQuestion {
  const questionType = getRndNumber(0, 2);
  const questionAsImage = Math.random() > 0.5;

  switch (questionType) {
    case 0: // SignGetKeyFromKey
      return {
        question: sign.number,
        answers: [sign.number],
        correctAnswer: sign.number,
        skip: sign.skip || [],
        type: QuestionType.SignQuestion,
        questionAsImage,
        answersAsImages: !questionAsImage,
        signQuestionType: SignQuestionType.SignGetKeyFromKey,
      };
    case 1: // SignGetTitleFromKey
      return {
        question: sign.number,
        answers: [sign.title],
        correctAnswer: sign.title,
        skip: sign.skip || [],
        type: QuestionType.SignQuestion,
        questionAsImage,
        answersAsImages: false,
        signQuestionType: SignQuestionType.SignGetTitleFromKey,
      };
    default: // SignGetKeyFromTitle
      return {
        question: sign.title,
        answers: [sign.number],
        correctAnswer: sign.number,
        skip: sign.skip || [],
        type: QuestionType.SignQuestion,
        questionAsImage: false,
        answersAsImages: Math.random() > 0.5,
        signQuestionType: SignQuestionType.SignGetKeyFromTitle,
      };
  }
}

function getLineQuestion(line: Line): LineQuestion {
  const questionAsImage = Math.random() > 0.5;

  return {
    question: line.number,
    answers: [line.number],
    correctAnswer: line.number,
    type: QuestionType.LineQuestion,
    questionAsImage,
    answersAsImages: !questionAsImage,
  };
}

function populateSignQuestionAnswers(question: SignQuestion, signsPool: Sign[]) {
  const availableSigns: Sign[] = question.skip.length
    ? signsPool.filter(sign => !question.skip.includes(sign.number))
    : [...signsPool];

  for (let i = 0; i < 3; i++) {
    const rndIndex = getRndArrayIndex(availableSigns);
    const probableSign = availableSigns[rndIndex];
    const answer = question.signQuestionType === SignQuestionType.SignGetTitleFromKey
      ? probableSign.title
      : probableSign.number;

    question.answers.push(answer);
    availableSigns.splice(rndIndex, 1);
  }

  question.answers = shuffleArray(question.answers);

  return question;
}

function populateLineQuestionAnswers(question: LineQuestion, linesPool: Line[]) {
  const availableLines: Line[] = [...linesPool];

  for (let i = 0; i < 3; i++) {
    const rndIndex = getRndArrayIndex(availableLines);
    question.answers.push(availableLines[rndIndex].number);
    availableLines.splice(rndIndex, 1);
  }

  question.answers = shuffleArray(question.answers);

  return question;
}

export function getQuestion(signsPool: Sign[], linesPool: Line[]): Question {
  let question: SignQuestion | LineQuestion;

  if (Math.random() > 0.5) {
    const rndIndex = getRndArrayIndex(signsPool);
    const signQuestion = getSignQuestion(signsPool[rndIndex]);
    signsPool.splice(rndIndex, 1);
    question = populateSignQuestionAnswers(signQuestion, signsPool);
  } else {
    const rndIndex = getRndArrayIndex(linesPool);
    const lineQuestion = getLineQuestion(linesPool[rndIndex]);
    linesPool.splice(rndIndex, 1);
    question = populateLineQuestionAnswers(lineQuestion, linesPool);
  }

  return question;
}
