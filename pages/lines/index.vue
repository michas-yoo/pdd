<template>
  <section class="centered-section h-svh py-20">
    <div class="grid grid-cols-1 gap-3">
      <TheButton v-for="(category, i) in categories" :key="i" @click="() => navigateTo(`/lines/${i + 1}`)">
        {{ category }}
      </TheButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import categories from 'assets/data/lines/categories.json';

const header = useState('header');

onMounted(() => {
  header.value = { title: 'Разметка', link: '/learn' };
});
</script>

<style scoped></style>
