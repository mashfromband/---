<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="求人企業トップ" />
    <UDashboardPanelContent>
    
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'company'
});

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

</script>
