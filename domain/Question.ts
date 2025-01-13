import type { Line } from './Line';
import type { Sign } from './Sign';
import { getRndArrayIndex, getRndNumber, shuffleArray } from '~/utils';

enum SignQuestionType {
  KeyToKey,
  KeyToTitle,
  TitleToKey,
}

export enum QuestionType {
  SignQuestion,
  LineQuestion,
}

type BaseQuestion<TQuestion, TAnswer> = {
  question: TQuestion;
  answers: TAnswer[];
  correctAnswer: TAnswer;
  type: QuestionType;
  questionAsImage: boolean;
  answersAsImages: boolean;
};

type LineQuestion = BaseQuestion<Line['number'], Line['number']>;
type SignQuestion = BaseQuestion<Sign['number'] | Sign['title'], Sign['number'] | Sign['title']> & {
  signQuestionType: SignQuestionType,
  skip: Sign['number'][]
};

export type Question = SignQuestion | LineQuestion;

const keyToKeyConstructor = (sign: Sign, questionAsImage: boolean): SignQuestion => ({
  question: sign.number,
  answers: [sign.number],
  correctAnswer: sign.number,
  skip: sign.skip || [],
  type: QuestionType.SignQuestion,
  questionAsImage,
  answersAsImages: !questionAsImage,
  signQuestionType: SignQuestionType.KeyToKey,
});

const keyToTitleConstructor = (sign: Sign, questionAsImage: boolean): SignQuestion => ({
    question: sign.number,
    answers: [sign.title],
    correctAnswer: sign.title,
    skip: sign.skip || [],
    type: QuestionType.SignQuestion,
    questionAsImage,
    answersAsImages: false,
    signQuestionType: SignQuestionType.KeyToTitle,
});

const titleToKeyConstructor = (sign: Sign): SignQuestion => ({
  question: sign.title,
  answers: [sign.number],
  correctAnswer: sign.number,
  skip: sign.skip || [],
  type: QuestionType.SignQuestion,
  questionAsImage: false,
  answersAsImages: Math.random() > 0.5,
  signQuestionType: SignQuestionType.TitleToKey,
});

function getSignQuestion(sign: Sign): SignQuestion {
  const questionType = getRndNumber(0, 2);
  const questionAsImage = Math.random() > 0.5;
  const lookupTable: {
    [key: number]: () => SignQuestion;
  } = {
    [SignQuestionType.KeyToKey]: () => keyToKeyConstructor(sign, questionAsImage),
    [SignQuestionType.KeyToTitle]: () => keyToTitleConstructor(sign, questionAsImage),
    [SignQuestionType.TitleToKey]: () => titleToKeyConstructor(sign),
  };

  return lookupTable[questionType]();
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

function populateAnswers<T extends { answers: unknown[], skip?: string[] }, PoolItem>(
  question: T,
  pool: PoolItem[],
  answerKey: keyof PoolItem,
): T {
  let availableItems = [...pool];

  for (let i = 0; i < 3; i++) {
    const rndIndex = getRndArrayIndex(availableItems);
    question.answers.push(availableItems[rndIndex][answerKey]);
    availableItems.splice(rndIndex, 1);
  }

  question.answers = shuffleArray(question.answers);

  return question;
}

function createQuestion<T, Q>(
  pool: T[],
  creationCallback: (item: T) => Q,
): Q {
  const rndIndex = getRndArrayIndex(pool);
  const question = creationCallback(pool[rndIndex]);
  pool.splice(rndIndex, 1);
  return question;
}

function createSignQuestion(pool: Sign[]): Question {
  const question = createQuestion(pool, getSignQuestion);
  const answerKey = question.signQuestionType === SignQuestionType.KeyToTitle ? 'title' : 'number';
  const availableSigns = question.skip.length ? pool.filter(sign => !question.skip.includes(sign.number)) : pool;
  return populateAnswers(question, availableSigns, answerKey);
}

function createLineQuestion(pool: Line[]): Question {
  const question = createQuestion(pool, getLineQuestion);
  return populateAnswers(question, pool, 'number');
}

export function getQuestion(signsPool: Sign[], linesPool: Line[]): Question {
  if (Math.random() > 0.5) {
    return createSignQuestion(signsPool);
  }

  return createLineQuestion(linesPool);
}
