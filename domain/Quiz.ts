import type { Sign } from './Sign';
import type { Line } from './Line';
import type { Question } from './Question';
import { getSignQuestion } from '~/domain/SignQuestion';
import { getLineQuestion } from '~/domain/LineQuestion';
import { QuestionTypes } from './Question';

export type QuizQuestion = {
  question: Question;
  correct: boolean;
  answered: boolean;
};

export type Quiz = QuizQuestion[];

type QuizParams = {
  mainPool: Sign[] | Line[];
  secondaryPool?: Sign[] | Line[];
  useOnePool?: boolean;
  questionsAmount?: number;
  singlePoolName?: '' | QuestionTypes;
};

type AnyPoolCallback = (x: any, y?: any) => Question;

export function getQuestionFromTwoPools(signsPool: Sign[], linesPool: Line[]): Question {
  if (Math.random() > 0.5) return getSignQuestion(signsPool);

  return getLineQuestion(linesPool);
}

export function generateQuiz({
  mainPool,
  secondaryPool = [],
  useOnePool = false,
  singlePoolName = '',
  questionsAmount = 20,
}: QuizParams): Quiz {
  const quiz: QuizQuestion[] = [];
  let questionCallback: AnyPoolCallback = getQuestionFromTwoPools;

  if (useOnePool) {
    questionCallback = singlePoolName === QuestionTypes.SignQuestion ? getSignQuestion : getLineQuestion;
  }

  for (let i = 0; i < questionsAmount; i++) {
    quiz.push({
      question: questionCallback(mainPool, secondaryPool),
      correct: false,
      answered: false,
    });
  }

  return quiz;
}
