<template>
	<section class="h-svh">
		<h1 class="heading-1">Знаки</h1>

		<div class="grid grid-cols-1 gap-3">
			<TheButton
				v-for="(category, i) in categories"
				:key="i"
				@click="() => navigateTo(`/signs/${i + 1}`)"
			>
				{{ category }}
			</TheButton>
		</div>
	</section>
</template>

<script setup lang="ts">
import categories from '~/assets/signs/categories.json';
</script>

<style scoped>

</style>
