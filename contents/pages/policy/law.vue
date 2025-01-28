<template>
  <BreadcrumbLinks v-bind:links="links" />
  <UPage>
    <UPageBody prose>
      <ContentDoc />
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
definePageMeta({
  noAuthRequired: true
});

const links = [
  {
    icon: "i-heroicons-home-20-solid",
    to: { name: "home" },
  },
  {
    label: "〇〇法による表示",
  },
];
</script>
