<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="お知らせ　詳細情報">
      <template #right>
        <UButton
          label="一覧に戻る"
          :to="{name: 'admin-news'}"
          size="xl"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-uturn-left"
        />
      </template>
    </UDashboardNavbar>
    <UDashboardPanelContent>
      <UDashboardSection>
        <UTable
          :columns="columns"
          :rows="rows"
          :ui="{
            td: { base: '[&:nth-child(1)]:w-60 break-words whitespace-normal' }
          }"
        >
          <template #value-data="{ row }">
            <template v-if="row.item === '表示優先度'">
              <span v-if="isHighPriority(row.value)" class="special-priority">特別</span>
              <span v-else>通常</span>
            </template>
            <template v-else>
              <span :class="row.class">{{ row.value }}</span>
            </template>
          </template>
        </UTable>
        <div>
          <UButton
            label="編集する"
            icon="i-heroicons-pencil-square"
            size="xl"
            :to="{name: 'admin-news-edit-newsId', params: {newsId: newsId}}"
          />
        </div>
      </UDashboardSection>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
});

import type { paths } from "@/types/api/management";

const route = useRoute();
const newsId = route.params.newsId as string;

type ResponseSuccess = paths["/official-news/{officialNewsId}"]["get"]["responses"][200]["content"]["application/json"];
const apiEndpoint = useApiEndpoint();
const { data: apiResponse, error } = await useCallApi<ResponseSuccess>(
  apiEndpoint.value.endpoint + `/v1/official-news/${newsId}`,
  { method: "get",}
);
if (!apiResponse.value) {
  throw createError({
    statusCode: 404,
    message: "お知らせが存在しません",
    fatal: true,
  });
}

const columns = [
  { key: "item", label: "項目" },
  { key: "value" },
];

const rows = [
  { item: "ID", value: apiResponse.value.id },
  { item: "外部提供用ID", value: apiResponse.value.outgoingId },
  { item: "タイトル", value: apiResponse.value.title },
  { item: "詳細", value: apiResponse.value.detail, class: 'multi-line-content' },
  { item: "掲載期間(開始日)", value: apiResponse.value.beginPeriodAt },
  { item: "掲載期間(終了日)", value: apiResponse.value.endPeriodAt },
  { item: "更新日", value: apiResponse.value.updatedAt },
  { item: "表示優先度", value: apiResponse.value.priority },
];

const isHighPriority = (priority: number) => priority >= 100;
</script>

<style scoped>
.special-priority {
  color: red;
  font-weight: bold;
}

.multi-line-content {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
