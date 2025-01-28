<template>
  <BreadcrumbLinks v-bind:links="links" />
<UContainer>
<UPage>
  <UPageHeader
    headline="一般会員"
    title="アイテム"
    description="アイテムです。"
  />
  <UPageBody prose>
  <!--仮の会員ページエリア　ayan-->
  <UCard>
  <div class="flex items-center space-x-4">
    <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
    コンテンツ
      <div class="space-y-2">
        <USkeleton class="h-4 w-[250px]" />
        <USkeleton class="h-4 w-[200px]" />
        <USkeleton class="h-4 w-[200px]" />
        <USkeleton class="h-4 w-[200px]" />
        <USkeleton class="h-4 w-[250px]" />
        <USkeleton class="h-4 w-[200px]" />
        <USkeleton class="h-4 w-[200px]" />
        <USkeleton class="h-4 w-[200px]" />
      </div>
  </div>
  </UCard>
  <!--仮の会員ページここまで　ayan-->
  </UPageBody>
</UPage>
</UContainer>
</template>

<script setup lang="ts">
const links = [
  {
    to: "/home",
    icon:"i-heroicons-home-20-solid"
  },
  {
    label: "アイテム",
  },
];
</script>
