import type { Line } from './Line';
import type { LineQuestion, Question } from './Question';
import { createQuestion, populateAnswers, QuestionTypes } from './Question';

function createLineQuestion(line: Line): LineQuestion {
  const questionAsImage = Math.random() > 0.5;

  return {
    number: line.number,
    question: line.number,
    answers: [line.number],
    correctAnswer: line.number,
    type: QuestionTypes.LineQuestion,
    questionAsImage,
    answersAsImages: !questionAsImage,
  };
}

export function getLineQuestion(pool: Line[], lineNumber?: Line['number']): Question {
  let question: LineQuestion;

  if (lineNumber) {
    const selectedLine = pool.find(line => line.number === lineNumber)!;
    question = createLineQuestion(selectedLine);
  } else {
    question = createQuestion(pool, createLineQuestion);
  }

  return populateAnswers(question, pool, 'number');
}
