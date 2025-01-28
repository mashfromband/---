<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 250, max: 500 }"
      collapsible
    >
      <UDashboardSidebar>
        <AppHeader />
        <UDivider class="sticky bottom-0" />
        <UDashboardSidebarLinks v-if="isLogin" :links="links" />
        <div class="flex-1"></div>
        <UDivider class="sticky bottom-0" />
        <UDashboardSidebarLinks v-if="isLogin" :links="footerLinks" />
        <UButton v-if="isLogin"
          label="ログアウト"
          to= "/auth/logout"
          color="gray"
          icon= "i-heroicons-arrow-right-on-rectangle"
          variant="ghost"
          class="hidden lg:flex"
        />
        <AppFooter />
      </UDashboardSidebar>
    </UDashboardPanel>
    <slot />
  </UDashboardLayout>
  <CommonAlert />
</template>

<script setup lang="ts">
import { _container } from '#tailwind-config/theme';


const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);


</script>
