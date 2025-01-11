<template>
	<button
		class="w-full py-3 px-5 rounded-[10px] border border-black"
		:class="props.class"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
const props = defineProps<{
	class?: string
}>();
</script>

<style scoped>

</style>
