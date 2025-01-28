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
          <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">REAL獲得・交換履歴</span>
        </div>
      </div>
    </div>
    <div>
      <UTabs v-model="selectedTabIndex" :items="tabs" class="mt-4">
        <template #earn=>
          <template v-if="realItemList.length">
            <FeedAddDate v-for="(item, index) in realItemList" :key="index" v-bind="item" size="long"/>
          </template>
          <div v-else class="h-[80px] flex items-center justify-center text-center">
            {{ noDataMessage }}
          </div>
          <Pagination v-bind="pagination" />
        </template>

        <template #redeem>
          <template v-if="realItemList.length">
            <FeedAddDate v-for="(item, index) in realItemList" :key="index" v-bind="item" size="long"/>
          </template>
          <div v-else class="h-[80px] flex items-center justify-center text-center">
            {{ noDataMessage }}
          </div>
          <Pagination v-bind="pagination" />
        </template>
      </UTabs>
    </div>
  </UPageCard>
  <div class="mt-4 lg:hidden">
    <UButton to="/home/efo" label="REALトップに戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
  </div>
</template>

<script setup lang="ts">
import type { paths } from "@/types/api/contents";

definePageMeta({
  layout: 'profile'
})

const links : BreadcrumbLinkItem[] = [
  {
    to: "/home",
    icon:"i-heroicons-home-20-solid"
  },
  {
    label: "REAL",
    to: "/home/real",
  },
  {
    label: "REAL獲得・交換履歴",
  },
];

const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);
onMounted(() => {
  breadcrumblinks.value = [...links];
});


const tabs = [
  {
    label:'獲得履歴',
    slot: 'earn',
  },
  {
    label:'交換履歴',
    slot: 'redeem',
  },
];
const selectedTabIndex = ref(0);

interface ItemProps {
  headline: string;
  title: string;
  date: string;
  tag: string;
  tagColor?: string;
  to: string;
}

type ApiResponse = paths["/user/me/real/history"]["get"]["responses"][200]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();
const pagination = reactive(useRoutePagination({ pageCount: 30 }));
const noDataMessage = ref("");
const realItemList = ref<ItemProps[]>([]);

const toDateString = (history: ApiResponse["histories"][number]) => {
  const {
    createdAtYear: year,
    createdAtMonth: month,
    createdAtDay: day,
    createdAtHour: hour,
    createdAtMinute: minute,
  } = history;
  return `${year}年${Number(month)}月${Number(day)}日 ${hour}:${minute}`;
};

const loadEarnItemList = async () => {
  const limit = pagination.pageCount;
  const offset = (pagination.page - 1) * pagination.pageCount;
  const { data } = await useCallApi<ApiResponse>(
    apiEndpoint.value.endpoint + "/v1/user/me/real/history",
    {
      method: "get",
      query: { offset, limit, sort: "-createdAt", target: "addOnly" },
    },
  );
  if (!data.value) {
    return;
  }
  realItemList.value = data.value.histories.map(history => ({
    headline: "EFO",
    title: "で獲得しました",
    date: toDateString(history),
    tag: String(history.addReal),
    to: "/home/real/history/" + history.id,
  }));
  pagination.total = data.value.total;
};

const loadRedeemItemList = async () => {
  const limit = pagination.pageCount;
  const offset = (pagination.page - 1) * pagination.pageCount;
  const { data } = await useCallApi<ApiResponse>(
    apiEndpoint.value.endpoint + "/v1/user/me/real/history",
    {
      method: "get",
      query: { offset, limit, sort: "-createdAt", target: "consumeOnly" },
    },
  );
  if (!data.value) {
    return;
  }
  realItemList.value = data.value.histories.map(history => ({
    headline: `デジコ${history.consumeReal}ポイント`,
    title: "と交換しました",
    date: toDateString(history),
    tag: String(history.consumeReal),
    tagColor: "red",
    to: "/home/real/history/" + history.id,
  }));
  pagination.total = data.value.total;
};

const loadPage = async () => {
  const { label } = tabs[selectedTabIndex.value];
  if (label === "交換履歴") {
    await loadRedeemItemList();
  } else {
    await loadEarnItemList();
  }
  noDataMessage.value = label + "がありません。";
};
await loadPage();
watch(() => [pagination.page, pagination.pageCount].toString(), loadPage);
watch(selectedTabIndex, (newValue, oldValue) => {
  if (newValue === oldValue) {
    return;
  }
  if (pagination.page === 1) {
    void loadPage();
  } else {
    pagination.page = 1;
  }
});
</script>
