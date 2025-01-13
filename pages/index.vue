<template>
  <section class="centered-section">
    <h1 class="heading-1">Тренировка знаний</h1>
    <div class="grid w-full grid-cols-1 gap-3 px-4">
      <TheButton @click="() => navigateTo('/learn')">Учить</TheButton>
      <TheButton @click="() => navigateTo('/quiz')">Тест</TheButton>
      <TheButton v-if="false" @click="() => navigateTo('/favourites')">Избранное</TheButton>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped></style>
