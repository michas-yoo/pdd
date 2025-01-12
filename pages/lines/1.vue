<template>
  <section class="py-20">
    <div v-if="!groupData" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">Загрузка...</div>
    <div v-else>
      <div
        v-for="(value, key) in groupData"
        :key="key"
        class="mb-6 flex items-center gap-3 flex-wrap"
      >
        <h2 class="mb-2 text-lg font-bold">{{ key }}</h2>
        <div class="image-container horizontal">
          <img :src="getLineUrl(key as string)" :alt="key as string" class="max-h-full max-w-full" />
        </div>
        <p v-if="value.description">{{ value.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getLineUrl } from '~/utils';
import data from '~/assets/data/lines/1.json';

type LineGroup = {
  [groupKey: string]: {
    description?: string;
  };
};

const header = useState('header');

const groupData = ref<LineGroup | null>(data.lines);

onMounted(() => {
  header.value = { title: data.groupName, link: '/lines' }
});
</script>

<style scoped>
.image-container {
  @apply h-[106px] max-h-[106px] min-h-[106px] w-[120px] min-w-[120px] max-w-[120px];
  @apply flex items-center justify-center;

  &.horizontal {
    @apply max-w-full w-full h-[50px] min-h-[50px];
  }
}
</style>
