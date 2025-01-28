<template>
  <UHeader
    to="/"
    :ui="{
      wrapper: 'bg-secondary-500 backdrop-blur border-b border-secondary-500 dark:border-secondary-500 -mb-px sticky top-0 z-50',
      left: 'lg:flex-none',
      right: 'flex flex-row-reverse items-center justify-start lg:flex-1 gap-1.5',
      button: {base: 'text-white'}
    }"
  >
    <template #logo>
      <Logo />
    </template>
    <template #center>
    </template>

    <template #right>
      <div v-if="isLogin">
        <MemberMenu :addItems="[memberLink,subLink]" class="hidden lg:flex" />
      </div>
      <div v-else class="flex-none">
        <UButton class="hidden lg:flex m-0" label="ログイン" to= "/auth/login" color="primary" icon= "i-heroicons-arrow-right-end-on-rectangle" variant="solid" size="xl" />
      </div>
      <!--right justified main links-->
      <div class="hidden lg:flex">
        <UHorizontalNavigation :links="links" 
          :ui="{
            base: 'text-white dark:text-white',
            before: 'hover:before:bg-white/20 dark:hover:before:bg-gray-800/50',
              icon: {
                active: 'text-white dark:text-white',
                inactive: 'text-white dark:text-white',
              }
          }"
        >
          <template #default="{ link }">
            <span class="group-hover:text-gray relative">{{ link.label }}</span>
          </template>
        </UHorizontalNavigation>
      </div>
    </template>

    <!--sm size-->
    <template #panel>      
      <div v-if="isLogin">
        <UAsideLinks :links="homeLinks" />
        <UDivider class="my-4"/>
        <UAsideLinks :links="links" />
        <UDivider class="my-4"/>
        <UAsideLinks :links="memberLink" />
        <UDivider class="my-4"/>
        <UAsideLinks :links="subLink" />
      </div>
      <div v-else>
        <UButton
          label="新規会員登録"
          to= "/auth/mail_regist"
          icon="i-heroicons-user-plus"
          size="xl"
          block
          class="my-4"
        />
        <UButton
          label="ログイン"
          to= "/auth/login"
          icon="i-heroicons-arrow-right-end-on-rectangle"
          size="xl"
          color="white"
          block
        />
      </div>
      <UDivider class="my-4"/>
      <UPageLinks :links="footerLink"/>
      <UDivider class="my-4"/>
      <UPageLinks :links="companyLink"/>
    </template>
  </UHeader>

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/composables/user';

const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);



const homeLinks =[{
  label: 'ホーム',
  to: '/home',
  icon: "i-heroicons-home-20-solid", 
}]

const links = computed(() => [{
  label: 'お知らせ',
  to: '/news/',
  icon: 'i-heroicons-newspaper',
}, {
  label: 'クエスト',
  to: '/genre/',
  icon: 'i-heroicons-academic-cap',
}, {
  label: '求人',
  to: '/wanted_ads/',
  icon: 'i-heroicons-building-office-2',
}])

const memberLink =  [{
    label: 'プロフィール',
    icon: 'i-heroicons-face-smile',
    to: '/home/profile',
  }, {
  label: '成績',
    icon: 'i-heroicons-presentation-chart-line',
    to: '/home/record',
  }, {
    label: 'EFO',
    icon: 'i-heroicons-circle-stack',
    to: '/home/efo',
  }, {
    label: 'メッセージ',
    icon: 'i-heroicons-envelope',
    to: '/home/message',
  }, {
    label: 'アイテム',
    icon: 'i-heroicons-shopping-bag',
    to: '/home/item',
    disabled : true
  }]

const subLink =  [{
    label: 'アカウント設定',
    to : '/home/settings',
    icon:'i-heroicons-cog-8-tooth'
  }, {
    label: 'ログアウト',
    to : '/auth/logout',
    icon :'i-heroicons-arrow-right-start-on-rectangle'
}]

const footerLink =  [{
  label: 'お問い合わせ',
  to : '/contact',
}, {
  label: '利用規約',
  to : '/policy/terms',
}, {
  label: 'プライバシーポリシー',
  to : '/policy/privacy',
}, {
  label: '会社概要',
  to: 'https://www.best-practice.co.jp/',
  target: '_blank'
}]

const companyLink =  [{
  label: '企業ログイン',
  to : '/',
  target: '_blank'
}]

</script>

<style scoped>
:deep(a[aria-disabled="true"]) {
  color: #aaa;
  cursor: not-allowed;
  pointer-events: none;
  text-decoration: none;
}
</style>