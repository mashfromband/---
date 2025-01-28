<!--
<template #footer>
  <div>
    <UButton v-if="isLogin"
      label="ログアウト"
      to= "/auth/logout"
      color="gray"
      icon= "i-heroicons-arrow-right-on-rectangle"
      variant="ghost"
      class="hidden lg:flex"
    />
  </div>
</template>
-->
<template>

</template>

<script setup lang="ts">
const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);



const footerMenu = [{
  label: '会社概要',
  to: 'https://www.best-practice.co.jp/',
  target: '_blank'
}]

</script>
