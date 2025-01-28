<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/composables/user";

const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);

const refreshTokenCookie = useCookie<string | null>("RL_M_RFT");
if (refreshTokenCookie.value) {
  isLogin.value = true;
}
else {
  isLogin.value = false;
}



useSeoMeta({
  titleTemplate: '- REALIZE LEARNING - リアライズラーニング',
//  ogImage: 'https://saas-template.nuxt.dev/social-card.png',
//  twitterImage: 'https://saas-template.nuxt.dev/social-card.png',
//  twitterCard: 'summary_large_image'
})
</script>
