<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="管理者トップ" />
    <UDashboardPanelContent>
    
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["admin-only"], // 管理者しか見れないページ
  layout: 'admin'
});


//const links  =  useState('links', () => [{
/*
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
*/
</script>
