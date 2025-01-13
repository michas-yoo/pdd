import type { Sign } from './Sign';
import type { SignQuestion, Question } from './Question';
import { createQuestion, populateAnswers, QuestionTypes, SignQuestionTypes } from './Question';
import { getRndNumber } from '~/utils';

const keyToKeyConstructor = (sign: Sign, questionAsImage: boolean): SignQuestion => ({
  question: sign.number,
  answers: [sign.number],
  correctAnswer: sign.number,
  skip: sign.skip || [],
  type: QuestionTypes.SignQuestion,
  questionAsImage,
  answersAsImages: !questionAsImage,
  signQuestionType: SignQuestionTypes.KeyToKey,
});

const keyToTitleConstructor = (sign: Sign, questionAsImage: boolean): SignQuestion => ({
  question: sign.number,
  answers: [sign.title],
  correctAnswer: sign.title,
  skip: sign.skip || [],
  type: QuestionTypes.SignQuestion,
  questionAsImage,
  answersAsImages: false,
  signQuestionType: SignQuestionTypes.KeyToTitle,
});

const titleToKeyConstructor = (sign: Sign): SignQuestion => ({
  question: sign.title,
  answers: [sign.number],
  correctAnswer: sign.number,
  skip: sign.skip || [],
  type: QuestionTypes.SignQuestion,
  questionAsImage: false,
  answersAsImages: Math.random() > 0.5,
  signQuestionType: SignQuestionTypes.TitleToKey,
});

function createSignQuestion(sign: Sign): SignQuestion {
  const questionType = getRndNumber(0, 2);
  const questionAsImage = Math.random() > 0.5;
  const lookupTable: {
    [key: number]: () => SignQuestion;
  } = {
    [SignQuestionTypes.KeyToKey]: () => keyToKeyConstructor(sign, questionAsImage),
    [SignQuestionTypes.KeyToTitle]: () => keyToTitleConstructor(sign, questionAsImage),
    [SignQuestionTypes.TitleToKey]: () => titleToKeyConstructor(sign),
  };

  return lookupTable[questionType]();
}

export function getSignQuestion(pool: Sign[]): Question {
  const question = createQuestion(pool, createSignQuestion);
  const answerKey = question.signQuestionType === SignQuestionTypes.KeyToTitle ? 'title' : 'number';
  const availableSigns = question.skip.length ? pool.filter(sign => !question.skip.includes(sign.number)) : pool;
  return populateAnswers(question, availableSigns, answerKey);
}
