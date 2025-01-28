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
      <QuestNavi :genreId="genreId" :tree="apiResponse"/>
    </template>
    <!-- キーワード検索 -->
    <QuestTagSearch
      :genreId="apiResponse.id"
    /> 
    <UDivider type="solid" class="mt-4" />
    <UPageHeader :description="apiResponse.detail"
      class="lg:hidden"
    />
    <UPageHeader headline="ジャンル" :title="apiResponse.name" :description="apiResponse.detail"
      class="hidden lg:block py-[24px]"
      :ui="{
        headline: 'inline-flex items-center rounded-md bg-primary-50 dark:bg-primary-400 dark:bg-opacity-10 text-gray-500 dark:text-gray-400 px-2 rounded inline-block'
      }"
    />
    <!-- 広告SP -->
    <div class="lg:hidden flex justify-center my-6">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/b480a077c27c9956f248394cb6881174" />
    </div>
    <QuestGenreCard :links="apiResponse"/>
    <!-- 広告 -->
    <div class="hidden lg:flex justify-center mt-6">
      <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/21a46fdb57ddf980e3173d0b05dbecc6" />
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
const genreId = route.params.genreId as string;

type ResponseSuccess =
  paths["/genre/{genreId}"]["get"]["responses"][200]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();

const { data: response, error } = await useCallApi(
  apiEndpoint.value.endpoint + "/v1/genre/" + genreId,
  {
    method: "get",
  }
);

const apiResponse = ref<ResponseSuccess>(response.value as ResponseSuccess);

const links = [
  {
    icon: "i-heroicons-home-20-solid",
    to: "/",
  },
  {
    label: "クエスト",
    to: "/genre",
  },
  {
    label: 'ジャンル - ' + apiResponse.value.name,
  }
];

</script>
