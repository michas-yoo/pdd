<template>
  <section class="py-20">
    <div
      v-for="(quizItem, i) in quiz"
      :key="i"
      class="border rounded-lg p-4 flex justify-center text-center flex-wrap"
    >
      <div class="w-full flex justify-center mb-3">
        <img
          v-if="quizItem.question.questionAsImage"
          :alt="quizItem.question.question"
          :src="getQuestionImage(quizItem.question)"
          :class="{
            'max-h-[106px] max-w-[120px]': quizItem.question.type === QuestionTypes.SignQuestion,
          }"
        />
        <h2 class="font-bold" v-else>{{ quizItem.question.question }}</h2>
      </div>

      <div class="w-full grid grid-cols-2 gap-2">
        <TheButton
          v-for="(answer, j) in quizItem.question.answers"
          :key="`ans-${j}`"
          class="flex items-center justify-center"
        >
          <img
            v-if="quizItem.question.answersAsImages"
            :src="getAnswerImage(quizItem.question, answer)"
            :alt="answer"
            :class="{
              'max-h-[106px] max-w-[120px]': quizItem.question.type === QuestionTypes.SignQuestion,
            }"
          />
          <span v-else>{{ answer }}</span>
        </TheButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Sign } from '~/domain/Sign';
import type { Line } from '~/domain/Line';
import type { Quiz, QuizQuestion } from '~/domain/Quiz';
import { generateQuiz } from '~/domain/Quiz';
import { QuestionTypes } from '~/domain/Question';
import { getLineUrl, getSignUrl } from '~/utils';

const allSigns = ref<Sign[]>([]);
const allLines = ref<Line[]>([]);
const quiz = ref<Quiz>([]);

async function loadSigns() {
  for (let i = 1; i < 9; i++) {
    const group = await import((`~/assets/data/signs/${i}.json`));
    allSigns.value.push(group.signs);
  }

  allSigns.value = allSigns.value.flat();
}

async function loadLines() {
  for (let i = 1; i < 3; i++) {
    const group = await import((`~/assets/data/lines/${i}.json`));
    allLines.value.push(group.lines);
  }

  allLines.value = allLines.value.flat();
}

async function loadDataAndGenerateQuiz() {
  await loadSigns();
  await loadLines();
  quiz.value = generateQuiz({
    mainPool: allSigns.value,
    secondaryPool: allLines.value
  });
}

function getQuestionImage(question: QuizQuestion['question']) {
  if (question.type === QuestionTypes.SignQuestion) {
    return getSignUrl(question.question);
  }

  return getLineUrl(question.question);
}

function getAnswerImage(question: QuizQuestion['question'], answer: string) {
  if (question.type === QuestionTypes.SignQuestion) {
    return getSignUrl(answer);
  }

  return getLineUrl(answer);
}

onMounted(() => {
  loadDataAndGenerateQuiz();
});
</script>

<style scoped>

</style>
