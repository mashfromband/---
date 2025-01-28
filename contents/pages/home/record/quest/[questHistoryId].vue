<template>
  <PageheaderLogoCard />
  <UPageHero
    align="center"
    class="relative bg-white dark:bg-gray-900 rounded-t-3xl"
    :links="[{label:'クエスト詳細',to:userQuestHistory.questLink, color:'gray', trailing:true, trailingIcon:'i-heroicons-arrow-right'}]"
    :ui="{
      wrapper:'bg-none -mt-6 lg:-mt-20'
    }"
  >
    <template #title>
      <div>{{userQuestHistory.questTitle}}</div>
    </template>
    <template #description>
      <div class="text-xl font-bold">
        <div v-if="userQuestHistory.isClear">クエストクリア</div>
        <div v-else>クエスト失敗</div>
      </div>
      <div>{{userQuestHistory.date}}</div>
      <MemberStats :items="stats" :type="userQuestHistory.isClear? 'positive' : 'negative'"/>
    </template>
  </UPageHero>
  <div class="mt-4 lg:hidden">
    <UButton to="/home/record/quest" label="一覧に戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
  </div>
</template>
  
<script setup lang="ts">
import type { paths } from '~/types/api/contents';

definePageMeta({
  layout: 'profile'
})

/** 2024年7月7日 23:59' */
const formatDate = (history: ResponseSuccess): string => {
  let month: number = parseInt(history.playMonth);
  let day: number = parseInt(history.playDay);
  return `${history.playYear}年${month}月${day}日 ${history.playHour}:${history.playMinute}`;
};

type ResponseSuccess = paths["/user/me/quest-history/{userQuestHistoryId}"]["get"]["responses"][200]["content"]["application/json"];

const route = useRoute();
const questHistoryId = route.params.questHistoryId;

const apiEndpoint = useApiEndpoint();
const { data, error } = await useCallApi<ResponseSuccess>(
  apiEndpoint.value.endpoint + `/v1/user/me/quest-history/${questHistoryId}`,
  { method: "get" },
);

if(!data.value || error.value) {
  throw createError({
    statusCode: error.value!.statusCode,
    statusMessage: error.value!.message,
    fatal: true 
  })
}

const userQuestHistory = ref({
  isClear: data.value.isClear,
  questTitle: data.value.questName,
  questLink: `/quest/${data.value.questId}`,
  score: data.value.score.toString(),
  date: formatDate(data.value),
});

const links : BreadcrumbLinkItem[] = [
  { to: "/home", icon:"i-heroicons-home-20-solid"},
  { label: "成績", to: "/home/record",},
  { label: "クエストクリア履歴", to: "/home/record/quest",},
  { label: "詳細",},
];
const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);

onMounted(() => {
  breadcrumblinks.value = [...links];
});

const stats =[{
  title: '得点',
  change: data.value.score,
  type: data.value.isClear ? 'positive' : 'negative'  // userQuestHistoryが初期化された後に呼び出される
}];

const bgImageUrl = useStaticCdnUrl("/img/logo_3_b.png").staticCdnUrl;
</script>