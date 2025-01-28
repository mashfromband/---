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

//const links = useState('links');

//const links  =  useState('links', () => [{
  const links = [{
  id: 'news',
  label: 'お知らせ',
  to: {'name': 'admin-news'},
  icon: 'i-heroicons-cog-8-tooth',
  children: [{
    label: '一覧',
    to: {'name': 'admin-news'},
    exact: true
  }, {
    label: '新規追加',
    to: {'name': 'admin-news-add'}
  }]
},{
  id: 'company',
  label: '求人企業',
  to: {'name': 'admin-company'},
  icon: 'i-heroicons-cog-8-tooth',
  children: [{
    label: '一覧',
    to: {'name': 'admin-company'},
    exact: true
  }, {
    label: '新規追加',
    to: {'name': 'admin-company-add'}
  }]
},{
  id: 'ads',
  label: '求人広告',
  to: {'name': 'admin-wanted_ads'},
  icon: 'i-heroicons-cog-8-tooth',
  children: [{
    label: '一覧',
    to: {'name': 'admin-wanted_ads'},
    exact: true
  }, {
    label: '新規追加',
    to: {'name': 'admin-wanted_ads-add'}
  }]
}];

const footerLinks = useState('footerLinks');

</script>
