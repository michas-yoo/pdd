import type { Sign } from './Sign';
import type { Line } from './Line';
import type { Question } from './Question';
import { QuestionTypes } from './Question';
import { getSignQuestion } from './SignQuestion';
import { getLineQuestion } from './LineQuestion';

type QuizFromOnePoolParams = {
  mainPool: Sign[] | Line[];
  poolType: QuestionTypes;
  maxQuestions?: number;
};

type QuizFromSelectedParams = QuizFromOnePoolParams & {
  poolForAnswers: Sign[] | Line[];
};

type QuizFromTwoPoolsParams = {
  mainPool: Sign[] | Line[];
  secondaryPool?: Sign[] | Line[];
  useOnePool?: boolean;
  maxQuestions?: number;
  singlePoolName?: '' | QuestionTypes;
  predefinedNumber?: string;
};

export type QuizQuestion = {
  question: Question;
  correct: boolean;
  answered: boolean;
  clickedAnswer: number;
  correctId: number;
};

export type Quiz = QuizQuestion[];

export function getQuestionFromTwoPools(signsPool: Sign[], linesPool: Line[]): Question {
  if (Math.random() > 0.5) return getSignQuestion(signsPool);
  return getLineQuestion(linesPool);
}

export function nextElementExists(currentId: number, quiz: Quiz): boolean {
  return currentId + 1 < quiz.length && !quiz[currentId + 1].answered;
}

export function getSkippedQuestion(quiz: Quiz): number {
  return quiz.findIndex((question: QuizQuestion) => !question.answered);
}

export function generateQuizFromOnePool({
  mainPool,
  poolType,
  maxQuestions = mainPool.length,
}: QuizFromOnePoolParams): Quiz {
  const quiz: Quiz = [];

  for (let i = 0; i < Math.min(maxQuestions, mainPool.length); i++) {
    const question = {
      question: poolType === QuestionTypes.SignQuestion
        ? getSignQuestion(mainPool as Sign[])
        : getLineQuestion(mainPool as Line[]),
      correct: false,
      answered: false,
      clickedAnswer: 0,
      correctId: 0,
    };
    question.correctId = question.question.answers.findIndex((x) => x === question.question.correctAnswer);
    quiz.push(question);
  }

  return quiz;
}

export function generateQuizFromSelected({
  mainPool,
  poolType,
  poolForAnswers,
}: QuizFromSelectedParams) {
  const quiz: Quiz = [];

  for (let i = 0; i < mainPool.length; i++) {
    const question = {
      question: poolType === QuestionTypes.SignQuestion
        ? getSignQuestion(poolForAnswers as Sign[], mainPool[i].number)
        : getLineQuestion(poolForAnswers as Line[], mainPool[i].number),
      correct: false,
      answered: false,
      clickedAnswer: 0,
      correctId: 0,
    };
    question.correctId = question.question.answers.findIndex((x) => x === question.question.correctAnswer);
    quiz.push(question);
  }

  return quiz;
}

export function generateQuizFromTwoPools({
  mainPool,
  secondaryPool = [],
  maxQuestions = 20,
}: QuizFromTwoPoolsParams): Quiz {
  const quiz: Quiz = [];

  for (let i = 0; i < maxQuestions; i++) {
    const question = {
      question: getQuestionFromTwoPools(mainPool as Sign[], secondaryPool as Line[]),
      correct: false,
      answered: false,
      clickedAnswer: 0,
      correctId: 0,
    };
    question.correctId = question.question.answers.findIndex((x) => x === question.question.correctAnswer);
    quiz.push(question);
  }

  return quiz;
}
