<template>
  <div class="overflow-hidden">
    <div class="logo-container relative min-h-full items-center justify-center flex" :style="{ '--landing-bg-image-url': `url(${bgImageUrl0})` }">
      <ULandingSection
        :ui="{
          wrapper : 'relative z-10 py-8 sm:py-20',
          container: 'gap-8 sm:gap-8 lg:gap-6',
          links:'mt-8 flex flex-wrap gap-x-3 gap-y-1.5'
        }"
      >
        <template #headline>
          リアライズラーニング
        </template>
        <template #title>
          BIZポータルへようこそ
        </template>
        <div class="flex justify-center">
          <NuxtImg :src=bgImageUrl1 class="max-w-svw h-auto lg:max-h-28" alt="リアライズラーニング -REALIZE LEARNING-"/>
        </div>
        <template #links>
          <div class="flex flex-wrap lg:flex-nowrap justify-center gap-6">
            <UButton to="/auth/login" class="min-w-64 max-w-full" block label="ログイン" color="white" size="xl" icon="i-heroicons-arrow-right-end-on-rectangle"/>
          </div>
        </template>
      </ULandingSection>
    </div>
  </div>
</template>

<script setup lang="ts">
// ランディングページ用専用layout読み込み
definePageMeta({
  layout: 'landing',
});

// 上部ロゴ画像
const bgImageUrl0 = useStaticCdnUrl("/img/logo_3_a.png").staticCdnUrl;
const bgImageUrl1 = useStaticCdnUrl("/img/logo_1_a.png").staticCdnUrl;
</script>


<style scoped>
.logo-container {
  position: relative;
}

.logo-container::after {
  content: "";
  position: absolute;
  top: -2rem;
  right: -20%;
  bottom: 0;
  left: 0;
  background-image: var(--landing-bg-image-url);
  background-repeat: no-repeat;
  background-position: right;
  background-size: 80vw;
  z-index: 2;
  pointer-events: none;
  overflow:hidden;
  opacity:0.2;
  }

  @media (min-width: 648px) {
.logo-container::after {
  top: -10%;
  right: -14%;
  bottom: 0;
  left: 0;
  background-size: 60vw;
}
}


</style>