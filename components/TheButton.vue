<template>
  <button class="w-full rounded-[10px] border border-black px-5 py-3" :class="props.class">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();
</script>

<style scoped></style>
