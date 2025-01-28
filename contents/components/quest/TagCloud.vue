<template>
  <div class="flex flex-wrap gap-0.5">
    <template v-for="tag in displayTagList" :key="tag.id">
      <template v-if="enabledTagLink">
        <NuxtLink :to="'/tag/' + tag.id">
          <UBadge :size="$props.size" variant="solid" color="gray" :ui="{ rounded: 'rounded-full' }">
            {{ tag.name }}
          </UBadge>
        </NuxtLink>
      </template>
      <template v-else>
          <UBadge :size="$props.size" variant="solid" color="gray" :ui="{ rounded: 'rounded-full' }">
            {{ tag.name }}
          </UBadge>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BadgeSize } from '#ui/types';
import type { paths } from '~/types/api/contents';

const props = withDefaults(defineProps<{
  size?: BadgeSize;
  length?: number;
  genreId?: string;
  categoryId?: string;
  questId?: string;
  enabledTagLink? :boolean
}>(),{
  enabledTagLink:false, //リンク機能付きのコンポーネント内に表示する場合リンク機能不要
});

const apiEndpoint = useApiEndpoint();
const maxTagLength = computed(() => Math.min(100, props.length ?? 10));
const tagList = ref<{ id: string; name: string; }[]>([]);
const displayTagList = ref<{ id: string; name: string; }[]>([]);

const loadByGenreId = async (genreId: string) => {
  type ApiResponse = paths["/genre/{genreId}"]["get"]["responses"][200]["content"]["application/json"];
  const { data } = await useCallApi<ApiResponse>(
    apiEndpoint.value.endpoint + "/v1/genre/" + genreId,
    { method: "get" },
  );
  return data.value ? data.value.tags : [];
};

const loadByCategoryId = async (categoryId: string) => {
  type ApiResponse = paths["/category/{categoryId}"]["get"]["responses"][200]["content"]["application/json"];
  const { data } = await useCallApi<ApiResponse>(
    apiEndpoint.value.endpoint + "/v1/category/" + categoryId,
    { method: "get" },
  );
  return data.value ? data.value.tags : [];
};

const loadByQuestId = async (questId: string) => {
  type ApiResponse = paths["/quest/{questId}"]["get"]["responses"][200]["content"]["application/json"];
  const { data } = await useCallApi<ApiResponse>(
    apiEndpoint.value.endpoint + "/v1/quest/" + questId,
    { method: "get" },
  );
  return data.value ? data.value.tags : [];
};

const loadRecentTags = async () => {
  type ApiResponse = paths["/tag"]["get"]["responses"][200]["content"]["application/json"];
  const { data } = await useCallApi<ApiResponse>(
    apiEndpoint.value.endpoint + "/v1/tag",
    {
      method: "get",
      query: { limit: maxTagLength.value, sort: "-id" },
    },
  );
  return data.value ? data.value.tags : [];
};

const tagLoader = computed(() => {
  const { genreId, categoryId, questId } = props;
  return questId ? async () => loadByQuestId(questId)
    : categoryId ? async () => loadByCategoryId(categoryId)
    : genreId ? async () => loadByGenreId(genreId)
    : loadRecentTags;
});

const loadTagList = async () => {
  tagList.value = await tagLoader.value();
};
await loadTagList();
watch([maxTagLength, tagLoader], loadTagList);

onMounted(() => {
  //Hydration mismatchが発生するため、ランダム処理はCSRで処理する必要はあります
  displayTagList.value = shuffledList(tagList.value)
    .slice(0, maxTagLength.value);
});

const shuffledList = <T>(list: T[]) => {
  return list.map(item => [Math.random(), item] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map(tuple => tuple[1]);
};
</script>
