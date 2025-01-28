<template>
  <div v-if="newsList?.length">
    <ul role="list" class="divide-y divide-white/5" v-if="newsList && newsList.length > 0">
      <li v-for='(news) in newsList' :key="news.id" class="relative flex items-center space-x-4">
        <FeedAddDate size="long" :to="getNewsDetailUrl(news)" :title="news.title" :date="getUpdateDate(news)" :tag="isSpecialNews(news) ? '特別なお知らせ' : ''"/>
      </li>
    </ul>
  </div>
  <div
    v-else-if="newsList?.length === 0"
    class="h-[160px] flex items-center justify-center text-center"
  >
    お知らせがありません。
  </div>
</template>

<script setup lang="ts">
import type { paths } from '~/types/api/contents';

const props = defineProps<{
  limit: string;
}>();

const newsList = ref<NewsSummary[]>([]);
type ResponseSuccess = paths["/official-news"]["get"]["responses"][200]["content"]["application/json"];
type NewsSummary = ResponseSuccess["news"][number];

const apiEndpoint = useApiEndpoint();
const { data, error } = await useCallApi<ResponseSuccess>(
  apiEndpoint.value.endpoint + "/v1/official-news",
  {
    method: "get",
    query: { limit: props.limit, sort: "-updatedAt" },
  },
);

if (data.value) {
  newsList.value = data.value.news;
}

const getNewsDetailUrl = (news: NewsSummary) => {
  return `/news/${news.id}`;
}

const getUpdateDate = (news: NewsSummary) => {
  const dateString = `${news.updatedAtYear}-${news.updatedAtMonth}-${news.updatedAtDay}`;
  return new Date(dateString).toLocaleDateString('ja', { year: 'numeric', month: 'short', day: 'numeric' });
}

const isSpecialNews = (news: NewsSummary) => {
  return news.priority == 100;
}

</script>
