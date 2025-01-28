<template>
  <BreadcrumbLinks v-bind:links="links" />
  <UContainer>
  <UPage
    :ui="{
      wrapper:'lg:grid-cols-4 gap-4',
      right: 'lg:col-span-1',
      center: {
        narrow: 'lg:col-span-3',
        base: 'lg:col-span-3',
        full: 'lg:col-span-3'
      }
    }"
  >
    <template #left>
      <div class="-mx-4 sm:-mx-6 bg-el_yellow-400 dark:bg-gray-800/50 text-sm lg:hidden">
        <div class="flex items-center border-b">
          <div class="w-12 flex-shrink-0 ml-2">
            <span>タグ</span>
          </div>
          <div>
            <svg class="h-full w-6 flex-shrink-0 text-gray-200 dark:text-gray-800" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
            </svg>
          </div>
          <div class="ml-2">
            <UButton to="/genre" :label=tagTitle size="sm" variant="soft" :ui="{ rounded: 'rounded-full' }">
              <template #trailing>
                <UIcon name="i-heroicons-x-circle" class="w-5 h-5" />
              </template>
            </UButton>
          </div>
        </div>
        <!-- 検索フィルター
        <QuestFilter />
        -->
      </div>
      <QuestNavi />
    </template>
    <!-- キーワード検索 -->
    <QuestTagSearch /> 
    <UDivider type="solid" class="mt-4" />
    <UPageHeader :description="'【'+ tagTitle + '】タグ検索の結果です'"
      class="lg:hidden"
    />
    <UPageHeader headline="タグ" :title="tagTitle"
      class="hidden lg:block py-[24px]"
      :ui="{
        headline: 'inline-flex items-center rounded-md bg-primary-50 dark:bg-primary-400 dark:bg-opacity-10 text-gray-500 dark:text-gray-400 px-2 rounded inline-block'
      }"
    />
    <UPageGrid
      :ui="{
        wrapper: 'mt-8 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3'
      }"
    >
      <NuxtLink v-for="quest in questLinks" :key="quest.id" :to="{name: 'quest-questId', params: {questId: quest.id}}">
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
              <p v-if="quest.isClear" class="text-sm leading-5 h-5"><UIcon name="i-heroicons-check-badge" class="w-6 h-6 text-green-600 dark:text-green-300" /></p>
              <h3 class="text-base font-semibold">{{ quest.name }}</h3>
              <p class="mt-2 text-sm leading-5 overflow-hidden text-ellipsis line-clamp-1 lg:line-clamp-2">{{ quest.detail }}</p>
            </div>
            <div class="absolute inset-x-0 bottom-0 mt-2 h-12 overflow-hidden">
              <QuestTagCloud :quest-id=quest.id :length=3 />
            </div>
          </div>
        </UPageCard>
      </NuxtLink>
    </UPageGrid>

    <template #right>
      <!--広告-->
      <div class="hidden lg:flex justify-center">
        <AdNinja sizeType="300x250" adScriptUrl="https://adm.shinobi.jp/s/4d225403d26413b226fca3f017dd7f7e" />
      </div>
    </template>
  </UPage>
</UContainer>
</template>

<script setup lang="ts">
import type { components, paths } from '~/types/api/contents';
definePageMeta({
  noAuthRequired: true
});

interface Link {
  label?: string;
  icon?: string;
  to?: string|
  {
    name: string;
    params?: Record<string, any>;
  };
}
const links = computed<Link[]>(()=> {
  return [
    {
      icon: "i-heroicons-home-20-solid",
      to: { name: "home" },
    },
    {
      label: "クエスト",
      to: { name: "genre" },
    },
    {
      label: `タグ - ${tagTitle.value}` 
    }
  ]
});

const bgImageUrl = useStaticCdnUrl("/img/logo_1_b.png").staticCdnUrl;

interface Quest {
  id: string;
  name: string;
  detail: string;
  imageSrc?: string;
}

const quests = ref();
const questLinks = computed(() => 
  quests.value.map((quest: Quest) => {
    const imageSrc = quest.imageSrc
      ? useStaticCdnUrl(`/img/${quest.imageSrc}`).staticCdnUrl.value
      : bgImageUrl.value;

    return {
      ...quest,
      imageSrc,
    };
  })
);

/** 
 * 現時点クエストのタグのみ取得できます 
 * /tag/{tagId}/quest
 * **/
type ResponseGetQuestListByTag = paths["/tag/{tagId}/quest"]["get"]["responses"][200]["content"]["application/json"];
type oneQuestWithoutTags = components["schemas"]["oneQuestWithoutTags"];

const route = useRoute();
const tagId = route.params.tagId as string;

const apiEndpoint = useApiEndpoint();


const { data } = await useCallApi<ResponseGetQuestListByTag>(
  apiEndpoint.value.endpoint + `/v1/tag/${tagId}/quest`,
  { method: "get" }
);

if(data.value) {
  quests.value = data.value.quests.map((quest:oneQuestWithoutTags) => {
    return {
      id: quest.id,
      name: quest.name,
      detail: quest.detail
    }
  });
}

//TODO 現時点TagIdではName取れないため、Tags一覧を取得してから検索する
const tagTitle = ref();
type ResponseGetTagList = paths["/tag"]["get"]["responses"][200]["content"]["application/json"];
type tag = components["schemas"]["oneTag"];
const { data: getTagListResponse } = await useCallApi<ResponseGetTagList>(
  apiEndpoint.value.endpoint + `/v1/tag`,
  { 
    method: "get", 
    query: { limit:100 },
   }
);
if(getTagListResponse.value) {
  const matchedTag = getTagListResponse.value.tags.find((tag: tag) => {
    return tag.id === tagId
  });
  if(matchedTag){
    tagTitle.value = matchedTag!.name;
  }
}

</script>
