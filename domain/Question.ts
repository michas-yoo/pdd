import type { Line, LineKey } from './Line';
import type { Sign, SignInfo, SignKey } from './Sign';
import { getRndArrayElement, getRndNumber } from '~/utils';

type SignGetKeyFromKey = {
  question: SignKey;
  answers: SignKey[];
  correctAnswer: SignKey;
  hasImage: boolean;
  questionType: number;
};

type SignGetTitleFromKey = {
  question: SignKey;
  answers: SignInfo['title'][];
  correctAnswer: SignInfo['title'];
  hasImage: boolean;
  questionType: number;
}

type SignGetKeyFromTitle = {
  question: SignInfo['title'];
  answers: SignKey;
  correctAnswer: SignKey;
  hasImage: boolean;
  questionType: number;
};

type SignQuestion = SignGetKeyFromKey | SignGetTitleFromKey | SignGetKeyFromTitle;

type LineQuestion = {
  question: LineKey;
  answers: LineKey[];
  correctAnswer: LineKey;
  hasImage: boolean;
}

function getSignQuestion(sign: Sign): SignQuestion {
  const signKey: SignKey = Object.keys(sign)[0];
  const signInfo: SignInfo = sign[signKey];
  const questionType = getRndNumber(0, 2);

  switch (questionType) {
    case 0: // SignGetKeyFromKey
      return {
        question: signKey,
        answers: [signKey],
        correctAnswer: signKey,
        hasImage: Math.random() > 0.5,
        questionType,
      };
    case 1: // SignGetTitleFromKey
      return {
        question: signKey,
        answers: [signInfo.title],
        correctAnswer: signInfo.title,
        hasImage: Math.random() > 0.5,
        questionType,
      };
    default: // SignGetKeyFromTitle
      return {
        question: signInfo.title,
        answers: [signKey],
        correctAnswer: signKey,
        hasImage: Math.random() > 0.5,
        questionType,
      };
  }
}

function getLineQuestion(line: Line): LineQuestion {
  const lineKey: SignKey = Object.keys(line)[0];

  return {
    question: lineKey,
    answers: [lineKey],
    correctAnswer: lineKey,
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
