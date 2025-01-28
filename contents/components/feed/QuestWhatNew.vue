<template>
  <div class="bg-el_yellow-50 dark:bg-gray-800/50 py-4 px-4 lg:p-8 lg:rounded-t-3xl">
    <div class="flex items-center mb-4">
      <NuxtImg v-if="questWhatNewList.img" :src=questWhatNewList.img class="w-16 h-16 grayscale contrast-0"/>
      <UIcon v-if="questWhatNewList.icon" :name=questWhatNewList.icon class="w-16 h-16 text-primary"/>
      <span class="font-bold text-xl">{{questWhatNewList.title}}</span>
    </div>
    <UPageGrid
      v-if="questWhatNewList.list && questWhatNewList.list.length > 0"
      class="lg:grid gap-6 lg:gap-8 relative"
      :ui="{
        wrapper: 'lg:grid-cols-3'
      }"
    >
        <NuxtLink v-if="questWhatNewList.list" v-for="link in questWhatNewList.list" :key="link.id" :to="link.to">
        <UPageCard
          class="overflow-hidden"
          :ui="{
            base: 'flex hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
            body: { base:'p-4 min-h-40 lg:min-h-44 ', background:'bg-gradient-to-b from-transparent via-transparent to-el_orange-600/20', padding:''},
            header: { base:'', background:'bg-secondary-500', padding:'px-0 py-0 sm:px-0'},
            footer: { base:'', background:'', padding:'px-0 py-0 sm:px-0'}
          }"
        >
          <template #header>
            <div class="bg-secondary-500 p-3 lg:p-4">
            </div>
          </template>
          <div class="relative h-full flex flex-col">
            <div>
              <p class="text-sm leading-5 h-6">
                <span v-if="link.isClear">
                  <UIcon name="i-heroicons-check-badge" class="w-6 h-6 text-green-600 dark:text-green-300" />
                </span>
              </p>
              <h3 class="text-base font-semibold">{{ link.name }}</h3>
              <p class="mt-2 text-sm leading-5 overflow-hidden text-ellipsis line-clamp-1 lg:line-clamp-2">{{ link.description }}</p>
            </div>
            <div class="absolute inset-x-0 bottom-0 mt-2 h-12 overflow-hidden">
              <QuestTagCloud :quest-id=link.id :length="3" />
            </div>
          </div>
        </UPageCard>
      </NuxtLink>
    </UPageGrid>
    <div
      v-else-if="questWhatNewList.list && questWhatNewList.list.length === 0"
      class="h-[200px] flex items-center justify-center text-center"
    >
      {{`${questWhatNewList.title}がありません` }}
    </div>
    <div
      v-else
      class="h-[200px] flex items-center justify-center text-center animate-pulse"
    >
      読み込み中...
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components, paths } from '~/types/api/contents';

const props = defineProps<{
  limit: string;
}>();

const questWhatNewList = ref({
  title:'新着クエスト',
  img:'',
  icon:'i-heroicons-academic-cap',
  list: undefined as {
    id: string;
    name: string;
    description: string;
    tag: string;
    star: boolean;
    to: string;
    isClear?: boolean;
  }[] | undefined,
});
const apiEndpoint = useApiEndpoint();


/** 下記、検索APIは未だ作成されてないため、無理やり取得しています、APIが実装した次第に書き換える予想です */

/** Genre一覧を取得する */
type GetGenreResponse = paths["/genre"]["get"]["responses"][200]["content"]["application/json"];
const { data: getGenreResponse, error } = await useCallApi<GetGenreResponse>(
  apiEndpoint.value.endpoint + "/v1/genre",
  { method: "get", }
);

if(error.value || !getGenreResponse.value) {
  throw new Error("ジャンル情報取得が失敗しました");
}

/** 各Genreのカテゴリ詳細を取得する */
type GetGenreDetailResponse = paths["/genre/{genreId}"]["get"]["responses"][200]["content"]["application/json"];
const categoryIds:string[] = [];
for(const genre of getGenreResponse.value.genres) {
  const { data: response, error } = await useCallApi<GetGenreDetailResponse>(
    apiEndpoint.value.endpoint + "/v1/genre/" + genre.id,
    { method: "get" }
  );
  if(error.value || !response.value) {
    throw new Error("カテゴリ情報取得が失敗しました");
  }
  response.value.categories.forEach((category)=>{
    categoryIds.push(category.id);
  })
}

/** 各カテゴリのクエスト情報を収集する */
type GetCategoryDetailResponse = paths["/category/{categoryId}"]["get"]["responses"][200]["content"]["application/json"];
type oneQuest = components["schemas"]["oneQuest"];
type oneCategory = components["schemas"]["oneCategory"];
let quests:oneQuest[] = [];
let childCategories:oneCategory[] = [];

/** カテゴリのクエストをロードする */
for(const categoryId of categoryIds) {
  const { data: response, error } = await useCallApi<GetCategoryDetailResponse>(
    apiEndpoint.value.endpoint + "/v1/category/" + categoryId,
    { method: "get",}
  );
  if(error.value || !response.value) {
    throw new Error("クエスト情報取得が失敗しました");
  }

  if(response.value.childCategories) {
    childCategories = childCategories.concat(response.value.childCategories);
  }
  quests = quests.concat(response.value.quests);
}

/** カテゴリの子カテゴリのクエストをロードする */
for(const category of childCategories) { 
  const { data: response, error } = await useCallApi<GetCategoryDetailResponse>(
    apiEndpoint.value.endpoint + "/v1/category/" + category.id,
    { method: "get",}
  );
  if(error.value || !response.value) {
    throw new Error("クエスト情報取得が失敗しました");
  }
  quests = quests.concat(response.value.quests);
}

/** 重複のクエストを排除する */
quests = Array.from(
  new Map(quests.map((quest) => [quest.id, quest])).values()
);

/** UIに反映する */
questWhatNewList.value.list = quests.slice(0, Number(props.limit)).map((quest) => ({
  id: quest.id,
  name: quest.name,
  description: quest.detail,
  tag: '',
  star: false,
  to: `/quest/${quest.id}`,
  isClear: quest.isClear,
}));

</script>
