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
    <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/1bc00ed132350ef5339879d9e7356aa1" />
  </div>
  <div class="lg:hidden flex justify-center">
    <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/edb3fabddf767882bc8ae01dd6bb1baa" />
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
    label: "利用規約",
  },
];
</script>
