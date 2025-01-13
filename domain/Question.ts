import type { Line, } from './Line';
import type { Sign } from './Sign';
import { getRndArrayElement, getRndNumber } from '~/utils';

type SignGetKeyFromKey = {
  question: Sign['number'];
  answers: Sign['number'][];
  correctAnswer: Sign['number'];
  hasImage: boolean;
  questionType: number;
};

type SignGetTitleFromKey = {
  question: Sign['number'];
  answers: Sign['title'][];
  correctAnswer: Sign['title'];
  hasImage: boolean;
  questionType: number;
}

type SignGetKeyFromTitle = {
  question: Sign['title'];
  answers: Sign['number'];
  correctAnswer: Sign['number'];
  hasImage: boolean;
  questionType: number;
};

type SignQuestion = SignGetKeyFromKey | SignGetTitleFromKey | SignGetKeyFromTitle;

type LineQuestion = {
  question: Line['number'];
  answers: Line['number'][];
  correctAnswer: Line['number'];
  hasImage: boolean;
}

function getSignQuestion(sign: Sign): SignQuestion {
  const questionType = getRndNumber(0, 2);

  switch (questionType) {
    case 0: // SignGetKeyFromKey
      return {
        question: sign.number,
        answers: [sign.number],
        correctAnswer: sign.number,
        hasImage: Math.random() > 0.5,
        questionType,
      };
    case 1: // SignGetTitleFromKey
      return {
        question: sign.number,
        answers: [sign.title],
        correctAnswer: sign.title,
        hasImage: Math.random() > 0.5,
        questionType,
      };
    default: // SignGetKeyFromTitle
      return {
        question: sign.title,
        answers: [sign.number],
        correctAnswer: sign.number,
        hasImage: Math.random() > 0.5,
        questionType,
      };
  }
}

function getLineQuestion(line: Line): LineQuestion {
  return {
    question: line.number,
    answers: [line.number],
    correctAnswer: line.number,
    hasImage: Math.random() > 0.5,
  };
}

function populateSignQuestionAnswers(question: SignQuestion, signsPool: Sign[]) {}

function populateLineQuestionAnswers(question: LineQuestion, linesPool: Line[]) {}

export function getQuestion(signsPool: Sign[], linesPool: Line[]): SignQuestion | LineQuestion {
  return Math.random() > 0.5
    ? getSignQuestion(getRndArrayElement(signsPool))
    : getLineQuestion(getRndArrayElement(linesPool));
}
