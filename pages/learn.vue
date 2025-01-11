<template>
	<section class="centered-section">
		<h1 class="heading-1">Тренировка знаний</h1>

		<div class="grid grid-cols-1 gap-3 w-full px-4">
			<TheButton @click="() => navigateTo('/signs')">Знаки</TheButton>
			<TheButton @click="() => navigateTo('/lines')">Разметка</TheButton>
		</div>
	</section>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
