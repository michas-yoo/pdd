import type { Sign } from './Sign';
import type { Line } from './Line';
import type { Question } from './Question';
import { QuestionTypes } from './Question';
import { getSignQuestion } from './SignQuestion';
import { getLineQuestion } from './LineQuestion';

type QuizParams = {
  mainPool: Sign[] | Line[];
  secondaryPool?: Sign[] | Line[];
  useOnePool?: boolean;
  questionsAmount?: number;
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

export function getQuestionFromTwoPools(signsPool: Sign[], linesPool: Line[], id?: string): Question {
  if (Math.random() > 0.5) return getSignQuestion(signsPool, id);
  return getLineQuestion(linesPool, id);
}

export function nextElementExists(currentId: number, quiz: Quiz): boolean {
  return currentId + 1 < quiz.length && !quiz[currentId + 1].answered;
}

export function getSkippedQuestion(quiz: Quiz): number {
  return quiz.findIndex((question: QuizQuestion) => !question.answered);
}

export function generateQuiz({
  mainPool,
  secondaryPool = [],
  useOnePool = false,
  singlePoolName = '',
  questionsAmount = 20,
  predefinedNumber = undefined,
}: QuizParams): Quiz {
  const quiz: QuizQuestion[] = [];

  for (let i = 0; i < questionsAmount; i++) {
    const question = {
      question:
        useOnePool
          ? singlePoolName === QuestionTypes.SignQuestion
            ? getSignQuestion(mainPool as Sign[], predefinedNumber)
            : getLineQuestion(mainPool as Line[], predefinedNumber)
          : getQuestionFromTwoPools(mainPool as Sign[], secondaryPool as Line[], predefinedNumber),
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
