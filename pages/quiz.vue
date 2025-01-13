<template>
  <section class="py-20">
    <div class="flex gap-2 overflow-x-auto mb-5">
      <TheButton
        v-for="i in quiz.length"
        :key="`nav-${i}`"
        :class="`${
          quiz[i - 1].answered
            ? quiz[i - 1].correct
              ? 'bg-green-300'
              : 'bg-red-300'
            : i - 1 === currentId
              ? 'bg-white current'
              : 'bg-gray-300'
        }`"
        @click="() => setActiveQuestion(i - 1)"
      >
        {{ i }}
      </TheButton>
    </div>
    <div
      v-if="quizItem"
      class="border rounded-lg p-4 flex justify-center text-center flex-wrap mb-10"
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

      <div
        class="w-full grid gap-2"
        :class="[
          quizItem.question.type === QuestionTypes.LineQuestion && quizItem.question.answersAsImages
            ? 'grid-cols-1'
            : 'grid-cols-2',
        ]"
      >
        <TheButton
          v-for="(answer, j) in quizItem.question.answers"
          :key="`ans-${j}`"
          :class="`min-h-20 flex items-center justify-center ${
            quizItem.answered
            ? quizItem.clickedAnswer === j
              ? quizItem.correct ? `bg-green-300` : `bg-red-300`
              : quizItem.correctId === j ? 'bg-green-300' : 'bg-gray-300'
            : ''
          }`"
          @click="() => selectAnswer(quizItem, j)"
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
    <TheButton
      v-if="canGoNext"
      class="bg-blue-400 text-white border-none"
      @click="() => showNextQuestion()"
    >
      Дальше
    </TheButton>
    <TheButton
      v-if="isFinal"
      class="bg-blue-400 text-white border-none"
      @click="() => navigateTo('/')"
    >
      На главную
    </TheButton>
  </section>
</template>

<script setup lang="ts">
import type { Sign } from '~/domain/Sign';
import type { Line } from '~/domain/Line';
import type { Quiz, QuizQuestion } from '~/domain/Quiz';
import { QuestionTypes } from '~/domain/Question';
import { getSkippedQuestion, nextElementExists, generateQuiz } from '~/domain/Quiz';
import { getAnswerImage, getQuestionImage } from '~/utils';

const allSigns = ref<Sign[]>([]);
const allLines = ref<Line[]>([]);
const quiz = ref<Quiz>([]);

const currentId = ref(0);
const canGoNext = ref(false);
const isFinal = ref(false);

const quizItem = computed(() => quiz.value[currentId.value] || null);

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
    secondaryPool: allLines.value,
    questionsAmount: 20,
  });
}

function setActiveQuestion(i: number) {
  currentId.value = i;
}

function scrollToCurrent() {
  setTimeout(() => {
    document.querySelector('.current')?.scrollIntoView({
      block: 'center',
      inline: 'center',
      behavior: 'smooth',
    });
  }, 100);
}

function showNextQuestion() {
  canGoNext.value = false;

  if (nextElementExists(currentId.value, quiz.value)) {
    currentId.value = currentId.value + 1;
    scrollToCurrent();
    return;
  }

  const skippedQuestion = getSkippedQuestion(quiz.value);
  if (skippedQuestion) {
    currentId.value = skippedQuestion;
    scrollToCurrent();
  } else {
    isFinal.value = true;
    canGoNext.value = false;
  }
}

function selectAnswer(quizItem: QuizQuestion, answer: number) {
  quizItem.answered = true;
  quizItem.clickedAnswer = answer;
  quizItem.correct = answer === quizItem.correctId;

  if (nextElementExists(currentId.value, quiz.value) || getSkippedQuestion(quiz.value) >= 0) {
    canGoNext.value = true
  } else {
    isFinal.value = true;
  }
}

onMounted(() => {
  loadDataAndGenerateQuiz();
});
</script>

<style scoped>

</style>
