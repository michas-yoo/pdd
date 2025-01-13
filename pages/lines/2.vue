<template>
  <section class="py-20">
    <div v-if="!lines" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">Загрузка...</div>
    <div v-else>
      <div
        v-for="line in lines"
        :key="line.number"
        :id="`i${line.number.replaceAll('.', '-')}`"
        class="mb-6 flex items-center gap-3"
      >
        <div class="image-container">
          <img :src="getLineUrl(line.number)" :alt="line.number" class="max-h-full max-w-full" />
        </div>
        <div>
          <h2 class="mb-2 text-lg font-bold">{{ line.number }}</h2>
          <p>{{ line.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Line } from '~/domain/Line';
import { getLineUrl } from '~/utils';
import data from '~/assets/data/lines/2.json';

const route = useRoute();
const header = useState('header');

const lines = ref<Line[]>(data.lines);

onMounted(() => {
  header.value = { title: data.groupName, link: '/lines' };

  setTimeout(() => {
    if (!route.hash) return;
    document.querySelector(route.hash)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
});
</script>

<style scoped>
.image-container {
  @apply h-[106px] max-h-[106px] min-h-[106px] w-[120px] min-w-[120px] max-w-[120px];
  @apply flex items-center justify-center;
}
</style>
