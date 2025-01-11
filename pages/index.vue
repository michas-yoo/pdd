<template>
	<section class="centered-section">
		<h1 class="heading-1">Тренировка знаний</h1>
		<div class="grid grid-cols-2 gap-3 w-full px-4">
			<TheButton class="col-span-2" @click="() => navigateTo('/learn')">Учить</TheButton>
			<TheButton class="col-span-2">Тест</TheButton>
			<TheButton>Мои ошибки</TheButton>
			<TheButton>Избранное</TheButton>
		</div>
	</section>
</template>

<script setup lang="ts">
</script>

<style scoped>

</style>
