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
const links  =  useState('links', () => [{
  id: 'company',
  label: '求人企業',
  icon: 'i-heroicons-cog-8-tooth',
  children: [{
    label: '情報閲覧',
    to: {'name': 'recruit_company-my_recruit_company'},
    exact: true
  }]
},{
  id: 'ads',
  label: '求人広告',
  icon: 'i-heroicons-cog-8-tooth',
  children: [{
    label: '一覧',
    to: {'name': 'recruit_company-my_wanted_ads'},
    exact: true
  }, {
    label: '新規追加',
    to: {'name': 'recruit_company-my_wanted_ads-add'}
  }]
},{
  id: 'message',
  label: 'メッセージ',
  to: {'name':'recruit_company-message'},
  icon: 'i-heroicons-cog-8-tooth',
  children: [{
    label: 'メッセージ一覧',
    to: {'name':'recruit_company-message'},
    exact: true
  }, {
    label: '新規オファー',
    to: {'name': 'recruit_company-message-offer'},
  }],
}, {
  id: 'message_readonly',
  label: '求人メッセージ(読み取り専用)',
  to: {'name':'recruit_company-message'},
  icon: 'i-heroicons-cog-8-tooth',
  children: [{
    label: 'メッセージ一覧',
    to: {'name':'recruit_company-message-readonly'},
    exact: true
  }],
}
]);

const footerLinks = useState('footerLinks');

</script>
