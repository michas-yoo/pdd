<template>
  <section class="centered-section py-20">
    <div class="grid grid-cols-1 gap-3">
      <TheButton class="mb-5" @click="navigateTo('/signs/popular')"> Самые популярные</TheButton>

      <TheButton v-for="(category, i) in categories" :key="i" @click="() => navigateTo(`/signs/${i + 1}`)">
        {{ category }}
      </TheButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import categories from 'assets/data/signs/categories.json';

const header = useState('header');

onMounted(() => {
  header.value = { title: 'Знаки', link: '/learn' };
});
</script>

<style scoped></style>
