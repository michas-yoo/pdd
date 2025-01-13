<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useState('header', () => ({ title: '', link: '' }));
useState('favourites', () => ({ signs: [], lines: [] }));
</script>
