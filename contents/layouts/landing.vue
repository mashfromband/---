<template>
<div
  class="bg-fixed bg-auto"
  :style="{
    backgroundImage: `url('${bgImageUrl}')`,

    backgroundPosition: 'right -10px bottom -30px',
    backgroundRepeat: 'no-repeat'
  }">
  <slot />
  <AppAd />
  <AppFooter />
  <CommonAlert />
</div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

// 背景画像
const bgImageUrl = useStaticCdnUrl("/img/parts_1_50.png").staticCdnUrl;
</script>
