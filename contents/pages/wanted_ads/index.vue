<template>
<BreadcrumbLinks v-bind:links="links" />
<UContainer
:ui="{
    padding: 'px-0 sm:px-0'
  }"
>
  <UPageGrid
    :ui="{
      wrapper:'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-12'
    }"    
  >
    <!--中央カラム-->
    <div class="flex flex-col col-span-full lg:col-span-4">
      <PageheaderGeneral title="求人" />
      <div class="px-0 py-6 lg:p-6 bg-gray-50 dark:bg-gray-800/50">
      <!-- 広告SP -->
      <div class="lg:hidden flex justify-center mb-6">
        <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/78c9374e1d890df26bcb4bc138e4ac9b" />
      </div>
      <!--
        <div class="flex flex-col gap-6">
          <NuxtLink to="https://www.best-practice.co.jp/corporate/recruit/salesforce-engineer/" target="_blank">
            <UCard :ui="{base:'hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'}">
              <div class="flex justify-between">
                <div>
                  <div class="flex items-center text-xs">
                    2024年11月20日
                  </div>
                  <div class="group relative">
                    <div class="mt-3 text-xl font-semibold line-clamp-2 leading-6">
                      <span class="absolute inset-0" />
                      株式会社ベスト・プラクティス
                    </div>
                    <p class="mt-2 line-clamp-2 text-sm leading-6"></p>
                  </div>
                  <div class="group relative mt-4 flex">
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                      <span class="absolute inset-0" />
                      </div>
                  </div>
                </div>
                <div class="content-center">
                  <UIcon name="i-heroicons-chevron-right" class="h-10 w-10 flex-none" />
                </div>
              </div> 
            </UCard>
          </NuxtLink>
          <NuxtLink to="https://sokudan.work/top/projects/12052?srsltid=AfmBOopJkgGXOXn9zEMpgghzd0LaVenEfLa8ByWVG_7Y6cQYk3A9TJsy" target="_blank">
            <UCard :ui="{base:'hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'}">
              <div class="flex justify-between">
                <div>
                  <div class="flex items-center text-xs">
                    2024年11月20日
                  </div>
                  <div class="group relative">
                    <div class="mt-3 text-xl font-semibold line-clamp-2 leading-6">
                      <span class="absolute inset-0" />
                      株式会社シーアールエムコネクト
                    </div>
                    <p class="mt-2 line-clamp-2 text-sm leading-6"></p>
                  </div>
                  <div class="group relative mt-4 flex">
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                      <span class="absolute inset-0" />
                      </div>
                  </div>
                </div>
                <div class="content-center">
                  <UIcon name="i-heroicons-chevron-right" class="h-10 w-10 flex-none" />
                </div>
              </div> 
            </UCard>
          </NuxtLink>
        </div>
      -->
      </div>
      <div class="px-0 py-6 lg:p-6 bg-gray-50 dark:bg-gray-800/50">
        <Pagination v-bind="pagination" class="lg:hidden" />        
        <div v-if="adList" class="flex flex-col gap-6">
          <NuxtLink v-for="ads in adList" :key="ads.id" :to=url(ads.id)>
            <UCard
              :ui="{
                base:'hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
              }"
            >
              <div class="flex justify-between">
                <div>
                  <div class="flex items-center text-xs">
                    {{new Date(ads.updatedAt).toLocaleDateString('ja', { year: 'numeric', month: 'short', day: 'numeric' })}}
                  </div>
                  <div class="group relative">
                    <div class="mt-3 text-xl font-semibold line-clamp-2 leading-6">
                      <span class="absolute inset-0" />
                      {{ ads.position }}
                    </div>
                    <p class="mt-2 line-clamp-2 text-sm leading-6">{{ ads.details }}</p>
                  </div>
                  <div class="group relative mt-4 flex">
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                      <span class="absolute inset-0" />
                      {{ ads.recruitCompanyName }}
                      </div>
                  </div>
                </div>
                <div class="content-center">
                  <UIcon name="i-heroicons-chevron-right" class="h-10 w-10 flex-none" />
                </div>
              </div> 
            </UCard>
          </NuxtLink>
        </div>
        <div v-else class="h-[160px] flex items-center justify-center text-center animate-pulse">
          読み込み中...
        </div>
        <Pagination v-bind="pagination" />
      </div>
      <!-- 広告 -->
      <div class="hidden lg:flex justify-center">
        <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/3d8d90888d4aa58efb567d498ba86db1" />
      </div>

    </div>
    <!--右カラム-->
    <div class="flex flex-col col-span-full lg:col-start-5 gap-12">
      <!--広告-->
      <div class="hidden lg:flex justify-center">
        <AdNinja sizeType="160x600" adScriptUrl="https://adm.shinobi.jp/s/2571148a51cdc71329df6329fafc3906" />
      </div>
    </div>

  </UPageGrid>
</UContainer>
</template>

<script setup lang="ts">
import type { paths } from "@/types/api/contents";

const links = [
  {
    icon: "i-heroicons-home-20-solid",
    to: "/home",
  },
  {
    label: "求人",
  },
];

type AdSummaryListResponse = paths["/wanted-ads"]["get"]["responses"][200]["content"]["application/json"];
type AdSummary = AdSummaryListResponse["ads"][number] & {
  updatedAt: string;
};

const apiEndpoint = useApiEndpoint();
const pagination = reactive(useRoutePagination());
const adList = ref<AdSummary[]>();

const loadPage = async () => {
  const limit = pagination.pageCount;
  const offset = (pagination.page - 1) * pagination.pageCount;
  const { data } = await useCallApi<AdSummaryListResponse>(
      apiEndpoint.value.endpoint + "/v1/wanted-ads",
    {
      method: "get",
      query: { offset, limit, sort: "-updatedAt" },
    },
  );
  if (!data.value) {
    return;
  }
  adList.value = data.value.ads.map(ad => ({
    ...ad,
    updatedAt: `${ad.updatedAtYear}-${ad.updatedAtMonth}-${ad.updatedAtDay}`,
  }));
  pagination.total = data.value.total;
};
await loadPage();
watch(() => [pagination.page, pagination.pageCount].toString(), loadPage);

const url = (wantedAdId:string)=>{
  return `/wanted_ads/${wantedAdId}`;
} ;
</script>
