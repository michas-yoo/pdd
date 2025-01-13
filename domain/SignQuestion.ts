import type { Sign } from './Sign';
import type { Question, SignQuestion } from './Question';
import { createQuestion, populateAnswers, QuestionTypes, SignQuestionTypes } from './Question';
import { getRndNumber } from '~/utils';

const keyToKeyConstructor = (sign: Sign, questionAsImage: boolean): SignQuestion => ({
  number: sign.number,
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
  number: sign.number,
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
  number: sign.number,
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

export function getSignQuestion(pool: Sign[], signNumber?: Sign['number']): Question {
  let question: SignQuestion;

  if (signNumber) {
    const selectedSign: Sign = pool.find(sign => sign.number === signNumber)!;
    question = createSignQuestion(selectedSign);
  } else {
    question = createQuestion(pool, createSignQuestion);
  }

  const answerKey = question.signQuestionType === SignQuestionTypes.KeyToTitle ? 'title' : 'number';
  const availableSigns = question.skip.length ? pool.filter(sign => !question.skip.includes(sign.number)) : pool;
  return populateAnswers(question, availableSigns, answerKey);
}
