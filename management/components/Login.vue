<template>
  <div v-if="isLogin">
    <UHorizontalNavigation :links="devMenuIsLogin" class="border-b border-gray-200 dark:border-gray-800" />
  </div>
  <div v-else>
    <UHorizontalNavigation :links="devMenu" class="border-b border-gray-200 dark:border-gray-800" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/composables/user';

const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);



// 開発用メニュー　ayan
const route = useRoute()
const devMenuIsLogin = [{
  label: 'トップ',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: '会員ページ',
  icon: 'i-heroicons-user',
  to: '/home'
}, {
  label: 'ログアウト',
  icon: 'i-heroicons-arrow-right-start-on-rectangle',
  to: '/auth/logout',
}]
const devMenu = [{
  label: 'トップ',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'ログイン',
  icon: 'i-heroicons-arrow-left-end-on-rectangle',
  to: '/auth/login'
}]

</script>
