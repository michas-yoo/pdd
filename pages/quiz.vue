<template>
  <section>
    quiz
  </section>
</template>

<script setup lang="ts">
const allSigns = ref<any>({});

async function loadSigns() {
  for (let i = 1; i < 9; i++) {
    const group = await import((`~/assets/data/signs/${i}.json`));
    allSigns.value[i] = Object.keys(group.signs).map((el: any) => ({
      key: el,
      title: group.signs[el].title
    }));
  }
}

onMounted(() => {
  loadSigns()
    .then(() => {
      console.log(allSigns.value);
    });


});
</script>

<style scoped>

</style>
