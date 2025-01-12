<template>
  <section class="centered-section">
    <div class="grid w-full grid-cols-1 gap-3 px-4">
      <TheButton @click="() => navigateTo('/signs')">Знаки</TheButton>
      <TheButton @click="() => navigateTo('/lines')">Разметка</TheButton>
    </div>
  </section>
</template>

<script setup lang="ts">
const header = useState('header');

onMounted(() => {
  header.value = { title: 'Учить', link: '/' }
});
</script>

<style scoped></style>
