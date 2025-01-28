
<template>
  <UPageCard
    class="overflow-hidden col-span-2"
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
      <div class="inline-flex items-center gap-3 min-w-0">
        <UIcon name="i-ph-medal-military" class="w-10 h-10"/>
        <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">称号</span>
      </div>
    </div>
    <div
      v-if="honorListOnPage.length"
      class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 xl:gap-x-8"
    >
      <NuxtLink v-for="(item, index) in honorListOnPage">
        <UPageCard
          :ui="{
            base: 'flex hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
            body: { base:'p-4 min-h-20 lg:min-h-30 ', background:'', padding:''},
          }"
        >
          <div class="flex flex-col gap-2">
            <div class="font-bold break-all">{{ item.name }}</div>
            <div class="flex flex-row items-center gap-2 text-sm">
              <UIcon name="i-heroicons-document-check" class="w-4 h-4"/>
              <div>{{ item.date }}</div>
            </div>
            <div class="flex flex-row items-center gap-2 text-sm">
              <UCheckbox :model-value="true" class="pointer-events-none" />
              <div>{{ item.detail }}</div>
            </div>
            <div class="mt-2 flex justify-center">
              <UButton v-if="item.isSet" label="セット中" color="gray" disabled class="pointer-events-none" />
              <UButton v-else label="この称号をセットする" @click="onHonorSet(item.id)" />
            </div>
          </div>
        </UPageCard>
      </NuxtLink>
    </div>
    <div v-else class="mt-6 flex items-center justify-center text-center">
      称号がありません。
    </div>
  </UPageCard>
  <Pagination v-bind="pagination" />
  <div class="mt-4 lg:hidden">
    <UButton to="/home/record/" label="成績トップに戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
  </div>
</template>


<script setup lang="ts">
import type { paths } from "@/types/api/contents";

definePageMeta({
layout: 'profile'
})

const links: BreadcrumbLinkItem[] = [
{
to: "/home",
icon: "i-heroicons-home-20-solid",
},
{
label: "成績",
to: "/home/record"
},
{
label: "称号",
},
];

const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);
onMounted(() => {
breadcrumblinks.value = [...links];
});


type GetHonorResponse = paths["/user/me/honor"]["get"]["responses"]["200"]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();
const pagination = reactive(useRoutePagination());
const commonAlert = useCommonAlert();

const { data: honorResponse, refresh: reloadHonors } = await useCallApi<GetHonorResponse>(
  apiEndpoint.value.endpoint + "/v1/user/me/honor",
  {
    method: "get",
    query: { withSetHonor: "1" },
  },
);
if (honorResponse.value) {
  pagination.total = honorResponse.value.total;
}

const honorListOnPage = computed(() => {
  const limit = pagination.pageCount;
  const offset = (pagination.page - 1) * limit;
  const honorList = honorResponse.value?.honors || [];
  const setHonorId = honorResponse.value?.setHonor?.honorId || "";
  const isSet = (honor: { honorId: string }) => honor.honorId === setHonorId;
  return honorList
    .sort((a, b) => Number(isSet(b)) - Number(isSet(a))) // セット中の称号を先頭にする
    .slice(offset, offset + limit)
    .map(honor => ({
      id: honor.honorId,
      name: honor.honorName,
      detail: honor.honorDetail,
      date: `${Number(honor.createdAtYear)}年${Number(honor.createdAtMonth)}月${Number(honor.createdAtDay)}日`,
      isSet: isSet(honor),
    }));
});

const onHonorSet = async (honorId: string) => {
  type ApiRequest = paths["/user/me/honor"]["put"]["requestBody"]["content"]["application/json"];
  const requestBody: ApiRequest = {
    honorId,
  };
  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/user/me/honor",
    {
      method: "put",
      body: requestBody,
    },
  );
  if (error.value) {
    commonAlert.showWarn("称号のセットに失敗しました。");
    return;
  }
  commonAlert.showSuccess("称号をセットしました。");
  window.scrollTo(0, 0);
  void reloadHonors();
};
</script>
