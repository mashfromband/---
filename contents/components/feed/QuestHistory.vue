<template>
<div class="flow-root">
  <div v-if="items?.length">
    <ul role="list">
      <li v-for="(item) in items" :key="item.id">
        <FeedAddMedal
          :title="item.title"
          :content="item.content"
          :date="item.date"
          :to="item.to"
          :icon="item.icon"
          :icon-background="item.iconBackground"
          :is-last-index="item.isLast"
        />
      </li>
    </ul>
  </div>
  <div
    v-else-if="items?.length === 0"
    class="h-[160px] flex items-center justify-center text-center"
  >
    クエスト履歴がありません。
  </div>
  <div
    v-else
    class="h-[160px] flex items-center justify-center text-center animate-pulse"
  >
    読み込み中...
  </div>
</div>
</template>

<script setup lang="ts">
import type { paths } from '~/types/api/contents';

/*
  'size'の値によって日時の形式の長さを変える
  long  --> '2024年10月3日 14:30'
  short --> '10月3日'
*/
const props = withDefaults(defineProps<{
  limit: number;
  offset?: number;
  size?: 'long' | 'short'; 
  isClearOnly?: boolean
}>(),{
  offset: 0,
  size: 'short',
  isClearOnly: false
});

type ResponseSuccess = paths["/user/me/quest-history"]["get"]["responses"][200]["content"]["application/json"];
type HistorySummary = ResponseSuccess["questHistories"][number];

/** 日時整形  */
const formatDate = (history: HistorySummary): string => {
  //05を5に整形する
  let month: number = parseInt(history.playMonth);
  let day: number = parseInt(history.playDay);

  if(props.size == 'short') {
    return `${month}月${day}日`;
  }

  //long
  return `${history.playYear}年${month}月${day}日 ${history.playHour}:${history.playMinute}`;
};

/** Pagination機能をサポートする */
const emit = defineEmits(['update:totalPage']);

const apiEndpoint = useApiEndpoint();
const items = ref();

const fetchQuestHistory = async () => {
  items.value = null; //Loadingを表示する

  const { data, error } = await useCallApi<ResponseSuccess>(
    apiEndpoint.value.endpoint + "/v1/user/me/quest-history",
    { 
      method: "get",
      query: {
        offset: props.offset,
        limit: props.limit,
        sort: "-id",
        isClearOnly: props.isClearOnly ? 1 : 0,
      },
    },
  );

  if(data.value) {
    const length = data.value.questHistories.length;
    items.value = data.value.questHistories.map((history: HistorySummary, index) => {
      const questDetailPath = `/home/record/quest/${history.id}`;
      const isLast = length == (index+1);
      return {
        title: history.questName,
        content: history.isClear ? 'をクリアしました' : 'に失敗しました',
        to: questDetailPath,
        date: formatDate(history),
        icon: history.isClear ? 'i-heroicons-check-badge' : 'i-heroicons-face-frown',
        iconBackground: history.isClear ? 'bg-green-600' : 'bg-gray-400',
        isLast:isLast
      };
    });
    emit('update:totalPage', data.value.total);
  }
}
await fetchQuestHistory();
watch(() => JSON.stringify(props), fetchQuestHistory);
</script>
