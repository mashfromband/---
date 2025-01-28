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
          <UIcon name="i-heroicons-arrows-right-left" class="w-10 h-10"/>
          <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">EFO獲得・交換履歴</span>
        </div>
      </div>
    </div>
    <div>
      <UTabs :items="tabs" class="mt-4" @change="onTabChange">
        <template #earn="{ item }">
          <div v-if="earnItems?.length">
            <FeedAddDate v-for="(item, index) in earnItems" :key="index" v-bind="item" size="long"/>
            <Pagination v-bind="pagination"/>
          </div>
          <div v-else-if="earnItems && earnItems.length == 0" class="h-[160px] flex items-center justify-center text-center">
            獲得履歴がありません。
          </div>
          <div v-else class="h-[160px] flex items-center justify-center text-center animate-pulse">
            読み込み中...
          </div>
        </template>

        <template #redeem="{ item }">
          <div v-if="redeemItems?.length">
            <FeedAddDate  v-for="(item, index) in redeemItems" :key="index" v-bind="item" size="long" />
            <Pagination v-bind="pagination"/>
          </div>
          <div v-else-if="redeemItems && redeemItems.length == 0" class="h-[160px] flex items-center justify-center text-center">
            交換履歴がありません。
          </div>
          <div v-else class="h-[160px] flex items-center justify-center text-center animate-pulse">
            読み込み中...
          </div>
        </template>
      </UTabs>
    </div>
  </UPageCard>
  <div class="mt-4 lg:hidden">
    <UButton to="/home/efo" label="EFOトップに戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
  </div>
</template>

<script setup lang="ts">
import type { components, paths } from '~/types/api/contents';

definePageMeta({
  layout: 'profile'
})

const links : BreadcrumbLinkItem[] = [
  { to: "/home", icon:"i-heroicons-home-20-solid" },
  { label: "EFO", to: "/home/efo", },
  { label: "EFO獲得・交換履歴", },
];
const tabs = [
  { label:'獲得履歴', slot: 'earn', },
  { label:'交換履歴', slot: 'redeem', }
];

const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);

type ItemProps = {
  headline?: string;
  title: string;
  date: string;
  tag?: string;
  tagColor?: string;
  to: string;
};
const earnItems = ref<ItemProps[]>();
const redeemItems = ref<ItemProps[]>();

type ResponseSuccess =
  paths["/user/me/efo/history"]["get"]["responses"][200]["content"]["application/json"];
type userEfoHistory = components["schemas"]["oneUserEfoHistory"];
const apiEndpoint = useApiEndpoint();

const currentTab = ref<"earn" | "redeem">("earn");
const pagination = reactive(useRoutePagination());

const onTabChange = (index:number) => {
  const tab = tabs[index];
  if(tab.slot === 'earn') {
    currentTab.value = 'earn';
  } else {
    currentTab.value = 'redeem';
  }
  pagination.toTopPage();
}

const loadHistory = async () => {
  const isEarn = currentTab.value === 'earn';
  const { data: response, error } = await useCallApi<ResponseSuccess>(
    apiEndpoint.value.endpoint + "/v1/user/me/efo/history",
    { 
      method: "get",
      query: { 
        offset: (pagination.page - 1) * pagination.pageCount,
        limit: pagination.pageCount,
        sort: "-createdAt",
        target: isEarn ? "addOnly" : "consumeOnly"
      },
    }
  );
  if(response.value && !error.value) {
    if(isEarn) {
      earnItems.value = response.value.histories.map((history: userEfoHistory): ItemProps => {
        return {
          headline: 'リアライズラーニング',
          title: 'で獲得しました',
          date: `${history.createdAtYear}年${history.createdAtMonth}月${history.createdAtDay}日 ${history.createdAtHour}:${history.createdAtMinute}`,
          to: `/home/efo/history/${history.transactionId}`,
          tag: history.addEfo.toString()
        }
      });
    } else {
      redeemItems.value = response.value.histories.map((history: userEfoHistory): ItemProps => {
        return {
          headline: `REAL ${Math.abs(history.consumeEfo)}`,
          title: 'と交換しました',
          date: `${history.createdAtYear}年${history.createdAtMonth}月${history.createdAtDay}日 ${history.createdAtHour}:${history.createdAtMinute}`,
          to: `/home/efo/history/${history.transactionId}`,
          tag: Math.abs(history.consumeEfo).toString()
        }
      });
    }
    pagination.total = response.value.total;
  }
}

watch(
  () => [currentTab.value, pagination.page, pagination.pageCount].toString(),
  loadHistory,
  { immediate: true }
);

onMounted(() => {
  breadcrumblinks.value = [...links];
});
</script>
