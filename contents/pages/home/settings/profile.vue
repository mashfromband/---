<template>
  <UDashboardPanelContent class="pb-24"
    :ui="{
      wrapper:'p-0 bg-white/80 dark:bg-gray-800/50'
    }"
  >
    <UDashboardSection
        title="公開設定"
        description="プロフィールの公開設定です"
        icon="i-heroicons-globe-alt"
    >

      <template #links>
      <SubmitButton
          label="更新する"
          color="black"
      />
      </template>

      <UDashboardSection
        v-for="(section, index) in sections"
        :key="index"
        :title="section.title"
        :description="section.description"
        orientation="horizontal"
        class="px-4 py-6"
      >
        <UCard :ui="{ body: { base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col' } }">
          <UFormGroup
            v-for="field in section.fields"
            :key="field.name"
            :name="field.name"
            :label="field.label"
            :description="field.description"
            class="flex items-center justify-between pt-4 first:pt-0 gap-2"
            :ui="{ container: 'flex' }"
          >
            <UToggle
              v-model="state[field.name]"
              size="md"
              @update:model-value="onChange"
              :disabled="disabledFields.includes(field.name)"
            />
          </UFormGroup>
        </UCard>
      </UDashboardSection>
    </UDashboardSection>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'settings'
})

const state = reactive<{ [key: string]: boolean }>({
  web_prof: false,
  member_prof: true,
  company_prof: true,
  web_learning: false,
  member_learning: false,
  company_learning: false,
  web_history: false,   
  member_history: false, 
  company_history: false,
  company_personal: true,
})

const sections = [{
  title: '基本情報',
  description: 'ニックネーム・称号・自己紹介文・プロフィールアイコンの公開設定です',
  fields: [{
    name: 'web_prof',
    label: 'インターネット全体',
  }, {
    name: 'member_prof',
    label: 'リアライズラーニング会員',
  }, {
    name: 'company_prof',
    label: '求人・スカウト企業',
  }]
}, {
  title: '学習目標',
  description: '学習目標・目標とするスキル・身につけたい知識の公開設定です',
  fields: [{
    name: 'web_learning',
    label: 'インターネット全体'
  }, {
    name: 'member_learning',
    label: 'リアライズラーニング会員'
  }, {
    name: 'company_learning',
    label: '求人・スカウト企業',
    description: '企業からスカウト検索されます（ダミー）'
  }]
}, {
  title: '学習履歴',
  description: '所持スキル・クエストクリア履歴の公開設定です',
  fields: [{
    name: 'web_history',
    label: 'インターネット全体に公開'
  }, {
    name: 'member_history',
    label: 'リアライズラーニング会員',
    description: 'ランキング集計対象者になります（ダミー）'
  }, {
    name: 'company_history',
    label: '求人・スカウト企業',
    description: '企業スカウトされる対象者になります（ダミー）'
  }]
}, {
  title: '履歴書',
  description: '求人広告への応募やスカウトを受諾した際に、対象企業に公開されます。',
  fields: [{
    name: 'company_personal',
    label: '求人・スカウト企業',
    description: '※必ず公開されます。編集できません'
  }]
}]

const disabledFields = ['company_personal']

async function onChange() {
  // Do something with data
  console.log(state)
}


const links: BreadcrumbLinkItem[] = [
{
  to: "/home",
  icon: "i-heroicons-home-20-solid",
},
{
  to: "/home/settings",
  label: "アカウント設定",
},
{
  label: "プロフィール公開設定",
},
];
const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);
onMounted(() => {
  breadcrumblinks.value = [...links];
});


</script>