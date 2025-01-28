<template>
  <UHorizontalNavigation
    class="lg:hidden"
    :links="isLogin ? linksIsLogin : linksNoLogin"
    :ui="{
      wrapper: 'h-24 bg-white dark:bg-gray-900 backdrop-blur border-t border-gray-300 dark:border-gray-800 fixed bottom-[50px] z-10 justify-center',
      container: 'items-end',
      inner: dynamicWidthClass,
      base: 'flex-col tracking-tighter text-[10px]',
      active: 'text-secondary-500 dark:text-secondary-500',
      inactive: 'text-gray-500',
      icon: {
        active: 'text-secondary-500 dark:text-secondary-500',
        base: 'w-10 h-10 max-h-[6vh]',
        inactive: 'text-gray-500'
      }
    }"
  >
  <template #icon="{ link }">
      <div v-if="link.img" class="flex justify-center flex-shrink-0 relative w-12 h-12 max-h-[6vh]">
        <NuxtImg :src="link.img" class="max-h-[6vh]"/>
      </div>
    </template>
  </UHorizontalNavigation>
    <!-- 広告SP -->
    <div class="fixed bottom-0 bg-white dark:bg-gray-800 w-full z-10">
      <div class="lg:hidden flex justify-center">
        <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/e75c11052813a0c07e56527b434cb46b" />
      </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/composables/user';

const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);

const bgImageUrl = useStaticCdnUrl("/img/logo_3_a.png").staticCdnUrl;

const linksIsLogin = [{
  label: 'お知らせ',
  to: '/news/',
  icon: 'i-heroicons-newspaper',
}, {
  label: 'プロフィール',
  to: '/home/profile',
  icon: 'i-heroicons-user',
}, {
  label: 'クエスト',
  to: '/genre/',
  img: bgImageUrl.value
}, {
  label: '求人',
  to: '/wanted_ads/',
  icon: 'i-heroicons-building-office-2',
}, {
  label: 'メッセージ',
  to: '/home/message',
  icon: 'i-heroicons-envelope-open',
}]

const linksNoLogin = [{
  label: 'お知らせ',
  to: '/news/',
  icon: 'i-heroicons-newspaper',
}, {
  label: 'ログイン',
  to: '/auth/login',
  icon: 'i-heroicons-arrow-right-end-on-rectangle',
}, {
  label: 'クエスト',
  to: '/genre/',
  img: bgImageUrl.value
}, {
  label: '求人',
  to: '/wanted_ads/',
  icon: 'i-heroicons-building-office-2',
}, {
  label: 'メッセージ',
  to: '/home/message',
  icon: 'i-heroicons-envelope-open',
}]

const dynamicWidthClass = computed(() => {
  const linksCount = isLogin ? linksIsLogin.length : linksNoLogin.length;
  return `w-1/${linksCount}`;
});

</script>
