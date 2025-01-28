<template>
  <BreadcrumbLinks v-bind:links="links" />
  <UContainer>
  <UPage>
    <UPageBody prose>
      <ContentDoc />
    </UPageBody>
  </UPage>

  <!-- 広告 -->
  <div class="hidden lg:flex justify-center">
    <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/963c574ffea178861d7c683064cd0117" />
  </div>
  <div class="lg:hidden flex justify-center">
    <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/c9309190c366931a188ffa3b81dd0458" />
  </div>

</UContainer>
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
    label: "プライバシーポリシー",
  },
];
</script>
