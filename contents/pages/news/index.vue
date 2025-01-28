<template>
<BreadcrumbLinks v-bind:links="links" />
<UContainer
  :ui="{
    padding: 'px-0 sm:px-0'
  }"
>
  <UPageGrid
    :ui="{
      wrapper:'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 xl:grid-cols-5'
    }"    
  >
    <!--中央カラム-->
    <div class="flex flex-col col-span-full lg:col-span-4">
      <PageheaderGeneral title="お知らせ" />
      <div class="lg:p-6 bg-gray-50 dark:bg-gray-800/50">
        <UCard>
          <UTabs :items="tabs">
            <template #item="{ item }">
            <!--特別なお知らせ一覧-->
            <div v-if="item.key === 'important'">
              <template v-if="importantNewsList.length">
                <div v-for="(news, index) in importantNewsList">
                  <FeedAddDate :title="news.title" :date="new Date(news.updatedAt).toLocaleDateString('ja', { year: 'numeric', month: 'short', day: 'numeric' })" :to="getNewsDetailUrl(news.id)" tag="特別なお知らせ" size="long"/>
                </div>
              </template>
              <template v-else>
                特別なお知らせはありません。
              </template>
            </div>
            <div v-else>
              <!--すべてのお知らせ一覧-->
              <template v-if="newsList.length">
                <Pagination v-bind="pagination" class="lg:hidden" />
                <div v-for="(news) in newsList">
                  <FeedAddDate :title="news.title" :to="getNewsDetailUrl(news.id)" :date="new Date(news.updatedAt).toLocaleDateString('ja', { year: 'numeric', month: 'short', day: 'numeric' })"
                    :tag="isSpecialNews(news) ? '特別なお知らせ' : ''"
                    size="long"
                  />
                </div>
                <Pagination v-bind="pagination" />
              </template>
              <template v-else>
                お知らせはありません。
              </template>
            </div>
            </template>
          </Utabs>
        </UCard>
      </div>
    </div>
    
    <!--右カラム-->
    <div class="flex flex-col col-span-full lg:col-start-5 gap-12">

    <!--広告-->
    <div class="hidden lg:flex justify-center">
      <AdNinja sizeType="160x600" adScriptUrl="https://adm.shinobi.jp/s/c56ef23cca3a1b7a4f3378494bd95dbb" />
    </div>
    <div class="lg:hidden flex justify-center">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/e75c11052813a0c07e56527b434cb46b" />
    </div>
    </div>

  </UPageGrid>
</UContainer>
</template>

<script setup lang="ts">
import { joinURL } from "ufo";
import type { paths } from "@/types/api/contents";

definePageMeta({
  noAuthRequired: true
});

const links = [
{
    icon: "i-heroicons-home-20-solid",
    to: "/home",
  },
  {
    label: "お知らせ",
 },
];

const tabs =[
  {
    label:"すべて",
    key:"all"
  },
  {
    label:"特別なお知らせ",
    key:"important"
  }
]

type NewsSummaryListResponse = paths["/official-news"]["get"]["responses"][200]["content"]["application/json"];
type NewsSummary = NewsSummaryListResponse["news"][number] & {
  updatedAt: string;
};

const apiEndpoint = useApiEndpoint();
const pagination = reactive(useRoutePagination());
const importantNewsList = ref<NewsSummary[]>([]);
const newsList = ref<NewsSummary[]>([]);

const loadImportantNews = async () => {
  const { data } = await useCallApi<NewsSummaryListResponse>(
      apiEndpoint.value.endpoint + "/v1/official-news",
    {
      method: "get",
      query: { offset: 0, limit: 10, sort: "-priority,-updatedAt" },
    },
  );
  if (!data.value) {
    return;
  }
  importantNewsList.value = data.value.news
    .filter(_ => _.priority >= 100)
    .map(news => ({
      ...news,
      updatedAt: `${news.updatedAtYear}-${news.updatedAtMonth}-${news.updatedAtDay}`,
    }));
};

const loadNews = async () => {
  const limit = pagination.pageCount;
  const offset = (pagination.page - 1) * pagination.pageCount;
  const { data } = await useCallApi<NewsSummaryListResponse>(
      apiEndpoint.value.endpoint + "/v1/official-news",
    {
      method: "get",
      query: { offset, limit, sort: "-updatedAt" },
    },
  );
  if (!data.value) {
    return;
  }
  newsList.value = data.value.news.map(news => ({
    ...news,
    updatedAt: `${news.updatedAtYear}-${news.updatedAtMonth}-${news.updatedAtDay}`,
  }));
  pagination.total = data.value.total;
};

const loadPage = async () => {
  if (pagination.page === 1) {
    await loadImportantNews();
  }
  await loadNews();
};
await loadPage();
watch(() => [pagination.page, pagination.pageCount].toString(), loadPage);

const route = useRoute();
const getNewsDetailUrl = (newsId: string) => joinURL(route.path, newsId);

const isSpecialNews = (news: NewsSummary) => {
  return news.priority == 100;
}
</script>
