<template>
  <section class="py-20">
    <TheLoading v-if="!signs" />
    <div v-else>
      <div
        v-for="sign in signs"
        :key="sign.number"
        :id="`i${sign.number.replaceAll('.', '-')}`"
        class="mb-6 flex items-center gap-3"
      >
        <div class="image-container">
          <img :src="getSignUrl(sign.number)" :alt="sign.title" class="max-h-full max-w-full" />
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
import data from '~/assets/data/signs/popular.json';

const header = useState('header');

const signs = ref<Sign[]>(data);

onMounted(() => {
  header.value = { title: 'Популярные знаки', link: '/signs' };
});
</script>

<style scoped>
.image-container {
  @apply h-[106px] max-h-[106px] min-h-[106px] w-[120px] min-w-[120px] max-w-[120px];
  @apply flex items-center justify-center;
}
</style>
