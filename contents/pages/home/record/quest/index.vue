<template>
  <UPageCard
    class="overflow-hidden"
    :ui="{
      header: { base:'', background:'', padding:'px-0 py-0 sm:px-0'},
      footer: { base:'', background:'', padding:'px-0 py-0 sm:px-0'}
    }"
  >
    <template #header>
      <div class="bg-primary-500 p-3 lg:p-4">
      </div>
    </template>
    <div class="border-b-2 pb-4">
      <div class="justify-between flex gap-3 min-w-0">
        <div class="inline-flex items-center">
          <UIcon name="i-heroicons-bars-arrow-up" class="w-10 h-10"/>
          <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">クエストクリア履歴</span>
        </div>
      </div>
    </div>
    <UTabs :items="tabs"  @change="onTagsChange" class="mt-4"/>
    <FeedQuestHistory
      class="lg:min-h-[60vh]"
      size="long"
      :limit="pagination.pageCount"
      :offset="(pagination.page - 1) * pagination.pageCount"
      :isClearOnly="isClearOnly"
      @update:totalPage="updateTotalPage"
    />
    <Pagination v-bind="pagination" />

  </UPageCard>
  <div class="mt-4 lg:hidden">
    <UButton to="/home/record/" label="成績トップに戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'profile'
})

const pagination = reactive(useRoutePagination({
  pageCount:30
}));
const updateTotalPage = (total:number) => {
  pagination.total = total;
};
const isClearOnly = ref(false);

const links : BreadcrumbLinkItem[] = [
  {
    to: "/home",
    icon:"i-heroicons-home-20-solid"
  },
  {
    label: "成績",
    to: "/home/record",
  },
  {
    label: "クエストクリア履歴",
  },
];

const tabs =[
  {
    label:'すべて',
    alias: 'ALL'
  },
  {
    label:'クリアのみ',
    alias: 'CLEARED_ONLY'
  }
]

const onTagsChange = (index:number) => {
  const tab = tabs[index];
  if(tab.alias == "ALL") {
    isClearOnly.value=false;
    return;
  }

  if(tab.alias == "CLEARED_ONLY") {
    isClearOnly.value=true;
    return;
  }
}

const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);
onMounted(() => {
  breadcrumblinks.value = [...links];
});
</script>
