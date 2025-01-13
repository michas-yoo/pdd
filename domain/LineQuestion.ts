import type { Line } from './Line';
import type { LineQuestion, Question } from './Question';
import { createQuestion, populateAnswers, QuestionTypes } from './Question';

function createLineQuestion(line: Line): LineQuestion {
  const questionAsImage = Math.random() > 0.5;

  return {
    question: line.number,
    answers: [line.number],
    correctAnswer: line.number,
    type: QuestionTypes.LineQuestion,
    questionAsImage,
    answersAsImages: !questionAsImage,
  };
}

export function getLineQuestion(pool: Line[]): Question {
  const question = createQuestion(pool, createLineQuestion);
  return populateAnswers(question, pool, 'number');
}
