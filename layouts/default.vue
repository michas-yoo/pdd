<template>
  <main>
    <header
      v-if="canShowNavigation"
      :class="['fixed left-0 top-0 w-full border-b bg-white p-2 text-center', 'flex items-center justify-between']"
    >
      <button class="rounded-md border px-4 py-3" @click="navigateTo(header.link)">⬅️️</button>
      <h1 class="heading-1 !mb-0">{{ header.title }}</h1>
      <div class="w-[50px]" />
    </header>
    <slot />
    <footer v-if="canShowNavigation">
      <TheButton v-for="(item, i) in FOOTER_NAVIGATION" :key="i" @click="() => navigateTo(item.path)">
        {{ item.title }}
      </TheButton>
    </footer>
  </main>
</template>

<script setup lang="ts">
type NavigationItem = {
  title: string;
  path: string;
  icon?: string;
};

const FOOTER_NAVIGATION: NavigationItem[] = [
  {
    title: 'Главная',
    path: '/',
  },
  {
    title: 'Учить',
    path: '/learn',
  },
  {
    title: 'Тест',
    path: '/quiz',
  },
  {
    title: 'Избранное',
    path: '/favourites',
  },
];

const route = useRoute();
const header: Ref<{ title: string; link: string }> = useState('header');

const canShowNavigation = computed(() => route.path !== '/');
</script>

<style scoped>
footer {
  @apply fixed bottom-0 left-0 right-0 max-w-full overflow-auto;
  @apply flex items-center justify-around gap-3 border-t bg-white p-3;
}
</style>
