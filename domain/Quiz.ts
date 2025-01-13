import type { Sign } from './Sign';
import type { Line } from './Line';
import type { Question } from './Question';
import { getQuestion } from './Question';

export type QuizQuestion = {
  question: Question;
  correct: boolean;
  answered: boolean;
};

export function generateQuiz(signsPool: Sign[], linesPool: Line[], questionsAmount: number = 20): QuizQuestion[] {
  const quiz: QuizQuestion[] = [];

  for (let i = 0; i < questionsAmount; i++) {
    quiz.push({
      question: getQuestion(signsPool, linesPool),
      correct: false,
      answered: false,
    });
  }

  return quiz;
}
