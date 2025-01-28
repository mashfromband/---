<template>
  <div>
    <UContainer>
    <UDivider />
      <UFooter class="pb-28 lg:pb-0">
        <template #left>
        </template>
        <template #right>
          
        </template>
        <template #top>
          <!--
          <UFooterLinks :links="footerMenu" class="custom-footer-links"
            :ui="{
              wrapper:'md:flex-col lg:flex-row lg:gap-0'
            }"
          />
          -->
          <div class="flex justify-center ">
          <UFooterColumns :links="footerMenuColumn"
            :ui="{
              center: 'xl:col-span-3',
            }"
          />
          </div>
        </template>
        <template #center>
          © {{ new Date().getFullYear() }} BESTPRACTICE Inc.
        </template>
      </UFooter>
    </UContainer>
  </div>
</template>

<script setup lang="ts">

const managementToolsUrl = useRuntimeConfig().public.managementToolsUrl as string;

const footerMenu = [{
  label: 'トップ',
  to: '/'
}, {
  label: 'お問い合わせ',
  to: '/contact'
}, {
  label: '利用規約',
  to: '/policy/terms'
}, {
  label: 'プライバシーポリシー',
  to: '/policy/privacy'
}, {
  label: '会社概要',
  to: 'https://www.best-practice.co.jp/',
  target: '_blank'
}]

const footerMenuColumn =[
{
label: '一般会員のみなさま',
children: [{
  label: 'お問い合わせ',
  to: '/contact'
}, {
  label: '利用規約',
  to: '/policy/terms'
}, {
  label: 'プライバシーポリシー',
  to: '/policy/privacy'
}]},
{
label: '企業のみなさま',
children: [{
  label: '企業ログイン',
  to: managementToolsUrl,
  target: '_blank',
}]},
{
label: 'リアライズラーニングについて',
children: [{
  label: '会社概要',
  to: 'https://www.best-practice.co.jp/',
  target: '_blank'
}]
}]

</script>



<style scoped>
@media (min-width:1024px) {
  .custom-footer-links > *:not(:last-child)::after {
    content: '|';
    margin: 0 3rem;
  }
}
</style>


