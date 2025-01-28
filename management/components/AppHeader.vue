<template #header>
  <NuxtLink to="/">
    <Logo />
  </NuxtLink>
  <UBadge
    v-if="isRecruitCompany"
    label="企業"
    variant="subtle"
    class="mb-0.5"
    color="blue"
  />
  <UBadge
    v-if="isAdmin"
    label="管理者"
    variant="subtle"
    class="mb-0.5"
    color="purple"
  />
  <div v-if="isLogin">
    <!-- ここにログインメールアドレス -->
    <!-- アカウント設定ボタンにする（予定） -->
    <!--
    <UButton label="(アカウント設定)" variant="ghost" color="gray" icon="i-heroicons-cog-8-tooth" />
    -->
  </div>
</template>


<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/composables/user';

const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);

const userRoles = useUserRoleStore();
const { isAdmin, isRecruitCompany } = storeToRefs(userRoles);
</script>
