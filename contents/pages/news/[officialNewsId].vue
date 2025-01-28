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
    <div class="flex flex-col col-span-full lg:col-span-4 gap-12">
    <div v-if="post" class="px-4 lg:px-0">
      <UPageHeader
        :title="post.title"
      >
        <template #headline>
          <time class="text-gray-500 dark:text-gray-400 text-xl">
            {{ new Date(post.updatedAt).toLocaleDateString('ja', { year: 'numeric', month: 'short', day: 'numeric' }) }}
          </time>
          <UBadge v-if="post.priority >= 100" label="特別なお知らせ" color="secondary" variant="solid" size="lg" />
        </template>
      </UPageHeader>

      <UPage>
        <UPageBody prose class="whitespace-pre-line">
          {{ post.detail }}
        </UPageBody>
      </UPage>
      <UButton to="/news" label="一覧に戻る" icon="i-heroicons-arrow-uturn-left" color="gray" size="xl"/>
    </div>
    <div class="hidden lg:flex justify-center">
      <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/5bd33c17b2db0e4cbc571bb05b0784e8" />
    </div>
    </div>
    
    <!--右カラム-->
    <div class="flex flex-col col-span-full lg:col-start-5 gap-12">

    <!--広告-->
    <div class="hidden lg:flex justify-center">
      <AdNinja sizeType="160x600" adScriptUrl="https://adm.shinobi.jp/s/82896109e8ed9f8512524ecf8fbeac8b" />
    </div>
    <!-- 広告SP -->
    <div class="lg:hidden flex justify-center">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/2c33e02aebe7175f18650f5cce049565" />
    </div>
    </div>
  </UPageGrid>
</UContainer>
</template>

<script setup lang="ts">
import type { paths } from "@/types/api/contents";

definePageMeta({
  noAuthRequired: true
});

type NewsDetailResponse = paths["/official-news/{officialNewsId}"]["get"]["responses"][200]["content"]["application/json"];
type NewsDetail = NewsDetailResponse & {
  createdAt: string;
  updatedAt: string;
};

const post = ref<NewsDetail>();

const route = useRoute();
const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();
const { data, error } = await useCallApi<NewsDetailResponse>(
  apiEndpoint.value.endpoint + "/v1/official-news/" + route.params.officialNewsId,
  {
    method: "get",
  },
);
if (data.value) {
  post.value = {
    ...data.value,
    createdAt: `${data.value.createdAtYear}-${data.value.createdAtMonth}-${data.value.createdAtDay}`,
    updatedAt: `${data.value.updatedAtYear}-${data.value.updatedAtMonth}-${data.value.updatedAtDay}`,
  };
}
onMounted(() => {
  if (!data.value) {
    commonAlert.showWarn(
      error.value?.statusCode === 404 ? "存在しないお知らせです。" : "エラーが発生しました。",
      "/news");
  }
});


const links = [
{
    icon: "i-heroicons-home-20-solid",
    to: "/home",
  },
  {
    label: "お知らせ",
    to: "/news",
 },
 {
    label: `お知らせ詳細：${post.value?.title || ""}`,
 }
];

</script>
