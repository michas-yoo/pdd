import type { Sign } from './Sign';
import type { Line } from './Line';
import { getRndArrayIndex, shuffleArray } from '~/utils';

export enum SignQuestionTypes {
  KeyToKey,
  KeyToTitle,
  TitleToKey,
}

export enum QuestionTypes {
  SignQuestion,
  LineQuestion,
}

type BaseQuestion<TQuestion, TAnswer> = {
  question: TQuestion;
  answers: TAnswer[];
  correctAnswer: TAnswer;
  number: string;
  type: QuestionTypes;
  questionAsImage: boolean;
  answersAsImages: boolean;
};

export type LineQuestion = BaseQuestion<Line['number'], Line['number']>;
export type SignQuestion = BaseQuestion<Sign['number'] | Sign['title'], Sign['number'] | Sign['title']> & {
  signQuestionType: SignQuestionTypes,
  skip: Sign['number'][]
};
export type Question = LineQuestion | SignQuestion;

export function populateAnswers<T extends { answers: unknown[]; skip?: Sign['skip'] }, PoolItem>(
  question: T,
  pool: PoolItem[],
  answerKey: keyof PoolItem,
): T {
  const availableItems = pool.filter(
    item => !question.skip || !question.skip.includes(item[answerKey] as string),
  );

  for (let i = 0; i < 3; i++) {
    const rndIndex = getRndArrayIndex(availableItems);
    question.answers.push(availableItems[rndIndex][answerKey]);
    availableItems.splice(rndIndex, 1);
  }

  question.answers = shuffleArray(question.answers);

  return question;
}
