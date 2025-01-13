<template>
  <section class="py-20">
    <div v-if="!signs" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">Загрузка...</div>
    <div v-else>
      <div v-for="sign in signs" :key="sign.number" class="mb-6 flex items-center gap-3">
        <div class="image-container">
          <img :src="getImage(sign)" :alt="sign.title" class="max-h-full max-w-full" />
        </div>
        <div>
          <h2 class="mb-2 text-lg font-bold">{{ sign.number }} {{ sign.title }}</h2>
          <p v-if="sign.description">{{ sign.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Sign } from '~/domain/Sign';
import { getSignUrl } from '~/utils';

const route = useRoute();
const header = useState('header');

const signs = ref<Sign[] | null>(null);

async function loadData() {
  const data = await import((`~/assets/data/signs/${route.params.id}.json`));
  signs.value = data.signs;
  header.value = { title: data.groupName, link: '/signs' };
}

function getImage(sign: Sign): string {
  let signName = sign.number;

  if (sign.versions) {
    const version = sign.versions[Math.floor(Math.random() * sign.versions.length)];
    signName = `${signName}${version}`;
  }

  return getSignUrl(signName);
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.image-container {
  @apply h-[106px] max-h-[106px] min-h-[106px] w-[120px] min-w-[120px] max-w-[120px];
  @apply flex items-center justify-center;
}
</style>
