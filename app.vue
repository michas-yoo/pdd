<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
useState('header', () => ({ title: '', link: '' }));
</script>
