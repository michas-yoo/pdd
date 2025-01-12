<template>
	<section class="pt-20">
		<div
			v-if="!groupData"
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl"
		>
			Загрузка...
		</div>
		<div v-else>
			<div
				v-for="(value, key) in groupData"
				:key="key"
				class="flex items-center gap-3 mb-6"
			>
				<div class="image-container">
					<img :src="getImage(key as string, value)" :alt="value.title" class="max-w-full max-h-full" />
				</div>
				<div>
					<h2 class="mb-2 font-bold text-lg">{{ key }} {{ value.title }}</h2>
					<p v-if="value.description">{{ value.description }}</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { getSignUrl } from "~/utils";

type SignInfo = {
	title: string;
	versions?: string[];
	description?: string;
};

type SignGroup = {
	[groupKey: string]: SignInfo;
};

const route = useRoute();
const header = useState('header');

const groupData = ref<SignGroup | null>(null);

async function loadData() {
	const data = await import((`~/assets/signs/${route.params.id}.json`));
	groupData.value = data.signs;
	header.value = { name: data.groupName, link: '/signs' };
}

function getImage(key: string, sign: SignInfo): string {
	let signName: string = key;

	if (sign.versions) {
		const version = sign.versions[Math.floor(Math.random() * sign.versions.length)];
		signName = `${signName}${version}`;
	}

	return getSignUrl(signName);
}

onMounted(() => {
	loadData();
});
</script>

<style scoped>
.image-container {
	@apply h-[106px] w-[120px] min-h-[106px] min-w-[120px] max-h-[106px] max-w-[120px];
	@apply flex items-center justify-center;
}
</style>
