<template>
  <section class="py-20 overflow-x-hidden">
    <div class="no-scrollbar flex gap-2 overflow-x-auto mb-5">
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
    <TheLoading v-if="!quiz.length" />
    <ClientOnly>
      <swiper-container ref="swiperRef" :init="false">
        <swiper-slide v-for="quizItem in quiz">
          <div class="border rounded-lg p-4 flex justify-center text-center flex-wrap">
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
                <span v-else class="break-words">{{ answer }}</span>
              </TheButton>
            </div>
            <div v-if="quizItem.answered && !quizItem.correct" class="mt-5">
              <NuxtLink
                :to="
              quizItem.question.type === QuestionTypes.SignQuestion
               ? `/signs/${quizItem.question.number.slice(0, 1)}/#i${quizItem.question.number.replaceAll('.', '-')}`
               : `/lines/${quizItem.question.number.slice(0, 1)}/#i${quizItem.question.number.replaceAll('.', '-')}`
            "
                class="text-blue-500"
              >
                Подробнее
              </NuxtLink>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
    <div class="grid gap-3 mt-5">
      <TheButton
        v-if="canGoNext"
        class="bg-blue-400 text-white border-none"
        @click="() => showNextQuestion()"
      >
        Дальше
      </TheButton>
      <TheButton
        v-if="canShowErrors"
        class="bg-blue-400 text-white border-none"
        @click="() => showOnlyErrors()"
      >
        Посмотреть ошибки
      </TheButton>
      <TheButton
        v-if="canRestart"
        class="bg-green-600 text-white border-none"
        @click="() => runQuizConstructor()"
      >
        Ещё раз
      </TheButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Sign } from '~/domain/Sign';
import type { Line } from '~/domain/Line';
import {
  generateQuizFromOnePool,
  generateQuizFromTwoPools,
  getSkippedQuestion,
  nextElementExists,
  type Quiz,
  type QuizQuestion,
} from '~/domain/Quiz';
import { QuestionTypes } from '~/domain/Question';
import { getAnswerImage, getQuestionImage } from '~/utils';

const MAX_QUESTIONS = 10;

const route = useRoute();
const header = useState('header');

const allSigns = ref<Sign[]>([]);
const allLines = ref<Line[]>([]);
const quiz = ref<Quiz>([]);
const errors = ref<QuizQuestion[]>([]);

const currentId = ref(0);
const isQuestionShown = ref(false);
const canGoNext = ref(false);
const canRestart = ref(false);
const canShowErrors = ref(false);

const swiper = ref();
const swiperRef = ref();

useSwiper(swiperRef, {
  on: {
    init: (sw) => (swiper.value = sw),
    activeIndexChange: ({ activeIndex }) => setActiveQuestion(activeIndex),
  },
});

// Loaders
async function loadAllSigns() {
  for (let i = 1; i < 9; i++) {
    const group = await import((`~/assets/data/signs/${i}.json`));
    allSigns.value.push(group.signs);
  }

  allSigns.value = allSigns.value.flat();
}

async function loadAllLines() {
  for (let i = 1; i < 3; i++) {
    const group = await import((`~/assets/data/lines/${i}.json`));
    allLines.value.push(group.lines);
  }
  allLines.value = allLines.value.flat();
}

async function loadData(type: string, id: string) {
  const data = await import((`~/assets/data/${type}/${id}.json`));
  return data[type];
}

// Store
function resetData() {
  errors.value = [];
  currentId.value = 0;
  canGoNext.value = false;
  canRestart.value = false;
  canShowErrors.value = false;
}

function showNextQuestion() {
  canGoNext.value = false;

  if (nextElementExists(currentId.value, quiz.value)) {
    currentId.value = currentId.value + 1;
    return;
  }

  const skippedQuestion = getSkippedQuestion(quiz.value);
  if (skippedQuestion) {
    currentId.value = skippedQuestion;
  } else {
    canGoNext.value = false;
    canRestart.value = true;
    canShowErrors.value = errors.value.length > 0;
  }
}

function selectAnswer(quizItem: QuizQuestion, answer: number) {
  quizItem.answered = true;
  quizItem.clickedAnswer = answer;
  quizItem.correct = answer === quizItem.correctId;

  if (nextElementExists(currentId.value, quiz.value) || getSkippedQuestion(quiz.value) >= 0) {
    canGoNext.value = true;
  } else {
    canRestart.value = true;
    canShowErrors.value = errors.value.length > 0;
  }

  if (!quizItem.correct) {
    errors.value.push(quizItem);
  }
}

function showOnlyErrors() {
  currentId.value = 0;
  quiz.value = errors.value;
  canShowErrors.value = false;
  canRestart.value = true;
}

function setActiveQuestion(i: number) {
  currentId.value = i;
}

// Utils
function scrollToCurrent() {
  setTimeout(() => {
    document.querySelector('.current')?.scrollIntoView({
      block: 'center',
      inline: 'center',
      behavior: 'smooth',
    });
  }, 100);
}

// Generators
function generateQuizQuestions() {
  resetData();
  quiz.value = generateQuizFromTwoPools({
    mainPool: allSigns.value,
    secondaryPool: allLines.value,
    maxQuestions: MAX_QUESTIONS,
  });
  isQuestionShown.value = true;
}

function setupQuizFromOnePool(pool: Sign[] | Line[], type: QuestionTypes) {
  resetData();
  quiz.value = generateQuizFromOnePool({
    mainPool: pool,
    poolType: type,
    maxQuestions: MAX_QUESTIONS,
  });
  isQuestionShown.value = true;
}

async function setupDefaultQuiz() {
  await loadAllSigns();
  await loadAllLines();
  generateQuizQuestions();
}

async function runQuizConstructor() {
  if (route.query.signGroup) {
    allSigns.value = await loadData('signs', route.query.signGroup.toString());
    return setupQuizFromOnePool(allSigns.value, QuestionTypes.SignQuestion);
  }

  if (route.query.lineGroup) {
    allLines.value = await loadData('lines', route.query.lineGroup.toString());
    return setupQuizFromOnePool(allLines.value, QuestionTypes.LineQuestion);
  }

  await setupDefaultQuiz();
}

watch(currentId, (val) => {
  scrollToCurrent();
  swiper.value?.slideTo(val);
});

onMounted(() => {
  header.value = { title: 'Тест', link: '/' };
  runQuizConstructor();
});
</script>

<style scoped>

</style>
