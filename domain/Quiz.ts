import type { Sign } from './Sign';
import type { Line } from './Line';
import type { Question } from './Question';
import { QuestionTypes } from './Question';
import { getSignQuestion } from './SignQuestion';
import { getLineQuestion } from './LineQuestion';

type AnyPoolCallback = (x: any, y?: any) => Question;

type QuizParams = {
  mainPool: Sign[] | Line[];
  secondaryPool?: Sign[] | Line[];
  useOnePool?: boolean;
  questionsAmount?: number;
  singlePoolName?: '' | QuestionTypes;
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
    const question = {
      question: questionCallback(mainPool, secondaryPool),
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
