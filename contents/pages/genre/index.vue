<template>
  <BreadcrumbLinks v-bind:links="links" />
  <UContainer>
  <!--背景なし-->
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
      <QuestNavi />
    </template>
    <!-- キーワード検索 -->
    <QuestTagSearch /> 
    <UDivider type="solid" class="mt-4" />
    <UPageHeader headline="クエスト" title="ジャンルから探す" description="興味のある学習ジャンルを選んでください"
      class="py-[24px]"
      :ui="{
        headline: 'inline-flex items-center rounded-md bg-primary-50 dark:bg-primary-400 dark:bg-opacity-10 text-gray-500 dark:text-gray-400 px-2 rounded inline-block'
      }"
    />
    <!-- 広告SP -->
    <div class="lg:hidden flex justify-center mt-6">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/570947b42d5485e50415059df71c782c" />
    </div>

    <QuestGenreCard :links="apiResponse"/>
    <!-- 広告 -->
    <div class="hidden lg:flex justify-center mt-6">
      <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/727a748e59a7f9694c97609b1f82182d" />
    </div>
    <!-- 広告SP -->
    <div class="lg:hidden flex justify-center mt-6">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/682a02ace97644a89cf2ae1029da0822" />
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
const links = [
  {
    icon: "i-heroicons-home-20-solid",
    to: "/home",
  },
  {
    label: "クエスト - ジャンルから探す",
  },
];

import type {
  paths,
} from "@/types/api/contents";
import { useApiEndpoint } from "~/composables/api";

definePageMeta({
  noAuthRequired: true
});

type ResponseSuccess =
  paths["/genre"]["get"]["responses"][200]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();

const { data: response, error } = await useCallApi(
  apiEndpoint.value.endpoint + "/v1/genre",
  {
    method: "get",
  }
);

const apiResponse = ref<ResponseSuccess>(response.value as ResponseSuccess);


const genrelinks: any = []

for(let genre of apiResponse.value.genres){
  genrelinks.push({
    label:genre.name,
    to:{
      name:'genre-genreId',
      params:{genreId:genre.id}
    }
  })
}

</script>
