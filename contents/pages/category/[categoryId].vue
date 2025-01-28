<template>
  <BreadcrumbLinks v-bind:links="links" />
  <UContainer>
  <UPage
    :ui="{
      wrapper:'md:grid-cols-5 lg:grid-cols-3 lg:gap-4',
      right: 'md:col-span-2 lg:col-span-1',
      center: {
        narrow: 'lg:col-span-3 lg:col-span-2',
        base: 'lg:col-span-3 lg:col-span-2',
        full: 'lg:col-span-3 lg:col-span-2'
      }
    }"
  >
    <template #left>
      <QuestNavi :categoryId="categoryId" :tree="apiResponse"/>
    </template>
    <!-- キーワード検索 -->
    <QuestTagSearch
      :categoryId="apiResponse.id"
    /> 
    <UDivider type="solid" class="mt-4" />
    <UPageHeader :description="apiResponse.detail"
      class="lg:hidden"
    />
    <UPageHeader headline="カテゴリ" :title="apiResponse.name" :description="apiResponse.detail"
      class="hidden lg:block py-[24px]"
      :ui="{
        headline: 'inline-flex items-center rounded-md bg-primary-50 dark:bg-primary-400 dark:bg-opacity-10 text-gray-500 dark:text-gray-400 px-2 rounded inline-block'
      }"
    />
    <!-- 広告SP -->
    <div class="lg:hidden flex justify-center my-6">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/e69a7c4e2b92ff2e1e41f40ed3bd460f" />
    </div>
    <UPageGrid
      :ui="{
        wrapper: 'mt-8 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3'
      }"
      v-if="questLinks.length != 0"
    >
      <NuxtLink v-for="quest in questLinks" :key="quest.id" :to="{name: 'quest-questId', params: {questId: quest.id}}">
        <UPageCard
          class="overflow-hidden"
          :ui="{
            base: 'flex hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
            body: { base:'p-4 min-h-40 lg:min-h-44 ', background:' bg-gradient-to-b from-transparent via-transparent to-el_orange-600/20', padding:''},
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
                <span v-if="quest.isClear">
                  <UIcon name="i-heroicons-check-badge" class="w-6 h-6 text-green-600 dark:text-green-300" />
                </span>
              </p>
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
    <QuestGenreCard :links="childCategoryList"/>
    <!-- 広告 -->
    <div class="hidden lg:flex justify-center mt-6">
      <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/581f2b0fc86395e5aad44bf88bde1e94" />
    </div>
    <!-- 広告SP -->
    <div class="lg:hidden flex justify-center mt-6">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/b480a077c27c9956f248394cb6881174" />
    </div>
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
import type {
    paths,
    components,
} from "@/types/api/contents";
import { useApiEndpoint } from "~/composables/api";

definePageMeta({
  noAuthRequired: true
});

const route = useRoute();
const categoryId = route.params.categoryId as string;

type ResponseSuccess =
  paths["/category/{categoryId}"]["get"]["responses"][200]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();

const { data: response, error } = await useCallApi(
  apiEndpoint.value.endpoint + "/v1/category/" + categoryId,
  {
    method: "get",
  }
);

const apiResponse = ref<ResponseSuccess>(response.value as ResponseSuccess);

const questlinks: any = []

for(let quest of apiResponse.value.quests){
  questlinks.push({
    label:quest.name,
    to:{
      name:'quest-questId',
      params:{questId:quest.id}
    }
  })
}

const childCategoryList = ref<any>({ categories: [] });
const childCategories = apiResponse.value.childCategories;
if (childCategories && childCategories.length > 0) {
  for (const category of childCategories) {
    childCategoryList.value.categories.push({
      id: category.id,
      name: category.name,
      detail: category.detail,
    })
  }
}

interface Link {
  label? : string;
  icon? : string;
  to?: string|
  {
    name: string;
    params?: Record<string, any>;
  };
}
const links = ref<Link[]>([]);
links.value = [
  {
    icon : "i-heroicons-home-20-solid",
    to: { name: "home" },
  },
  {
    label: "クエスト",
    to: { name: "genre" },
  },
  {
    label: 'ジャンル - ' + apiResponse.value.genreName,
    to: { name: "genre-genreId", params: { genreId: apiResponse.value.genreId } },
  }
];

//親カテゴリがある場合
const parentCategory = ref<{ id: string; name: string; detail: string } | null>(null);

if (apiResponse.value.parentCategory) {
  const { id, name, detail } = apiResponse.value.parentCategory;
  parentCategory.value = { id, name, detail };
  links.value.push(
    {
      label: 'カテゴリ - ' + parentCategory.value.name,
      to: '/category/'+ parentCategory.value.id,
    },
    {
      label: apiResponse.value.name,
    }
  );
} else {
  parentCategory.value = null;
  links.value.push({
    label: 'カテゴリ - ' + apiResponse.value.name,
  });
}

const bgImageUrl = useStaticCdnUrl("/img/logo_1_b.png").staticCdnUrl;

interface Quest {
  id: string;
  name: string;
  detail: string;
  imageSrc?: string;
  isClear?: boolean;
}

const questLinks = computed(() => {
  return apiResponse.value.quests.map((quest) => {
    const partialQuest: Partial<Quest> = quest;

    const imageSrc = partialQuest.imageSrc
      ? useStaticCdnUrl(`/img/${partialQuest.imageSrc}`).staticCdnUrl.value
      : bgImageUrl.value;

    const isClear = !!quest.isClear;
    return {
      ...quest,
      imageSrc,
      isClear,
    };
  });
});

</script>
