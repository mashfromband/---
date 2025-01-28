<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="お知らせ 一覧">
        <template #right>
          <Instructions />
          <UButton
            :to="{name: 'admin-news-add'}"
            label="新規追加"
            size="xl"
            icon="i-heroicons-plus"
          />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <template #right>
          <USelectMenu
            v-model="selectedColumns"
            icon="i-heroicons-adjustments-horizontal-solid"
            :options="switchableColumns"
            multiple
            class="hidden lg:block"
          >
            <template #label>
              列表示
            </template>
          </USelectMenu>
        </template>
      </UdashboardToolbar>
      <UTable
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: '該当するお知らせはありません。' }"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
        :columns="visibleColumns"
        :rows="newsList"
        :ui="{
          tbody: '[&>tr:hover]:bg-gray-50 dark:[&>tr:hover]:bg-gray-800/50',
          td: { base: 'truncate max-w-60' }
        }"
      >
        <template #priority-data="{ row }">
          <span v-if="isHighPriority(row.priority)" class="special-priority">特別</span>
          <span v-else>通常</span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actionItems(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>

      <UModal v-model="isOpenDeleteComfirmModal">
        <div class="p-4">
          <UAlert
            icon="i-heroicons-exclamation-triangle"
            color="red"
            variant="outline"
            title="本当に削除しますか?"
            description="一度削除すると元には戻せません。"
          />
        </div>
        <div class="p-4">
          <div class="font-bold">削除対象</div>
          <UCard>
            <div class="grid grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto">
              <div class="font-bold">ID</div><div class="col-span-3">{{ deleteNewsId }}</div>
              <div class="font-bold">タイトル</div><div class="col-span-3">{{ deleteNewsTitle }}</div>
            </div>
          </UCard>
        </div>
        <div class="p-4">
          <UButton label="削除する" color="red" v-on:click="execDelete" class="mr-2" />
          <UButton label="キャンセル" color="white" v-on:click="isOpenDeleteComfirmModal=false" class="mr-2"  />
        </div>
      </UModal>

      <UDashboardToolbar>
        <Pagination v-bind="pagination" class="w-full" />
      </UdashboardToolbar>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
});

import type { paths } from "@/types/api/management";

type ResponseSuccess = paths["/official-news"]["get"]["responses"][200]["content"]["application/json"];
type NewsSummary = ResponseSuccess["news"][number];

const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();
const pagination = reactive(useRoutePagination());
const newsList = ref<NewsSummary[]>([]);

const loadPage = async () => {
  const limit = pagination.pageCount;
  const offset = (pagination.page - 1) * pagination.pageCount;
  const { data } = await useCallApi<ResponseSuccess>(
    apiEndpoint.value.endpoint + "/v1/official-news",
    {
      method: "get",
      query: { offset, limit, sort: "-id" },
    },
  );
  if (!data.value) {
    return;
  }
  newsList.value = data.value.news;
  if (data.value.total != null) {
    pagination.total = data.value.total;
  }
};
await loadPage();
watch(() => [pagination.page, pagination.pageCount].toString(), loadPage);

const columns = [
  {key: "id",label: "ID"},
  {key: "outgoingId",label: "外部提供用ID"},
  {key: "title",label: "タイトル", sortable: true},
  {key: "beginPeriodAt",label: "掲載期間(開始日)", sortable: true},
  {key: "endPeriodAt",label: "掲載期間(終了日)", sortable: true},
  {key: "updatedAt",label: "更新日", sortable: true},
  {key: "priority",label: "表示優先度", sortable: true},
  {key: "actions", switchable:false}
];

const columnList = columns.filter(column => column.switchable !== false);
const switchableColumns = ref(columnList);
const selectedColumns = ref([...columnList]);
const visibleColumns = computed(() => {
  return columns.filter(column => 
    selectedColumns.value.includes(column) || column.switchable === false
  );
});

const actionItems = (row: NewsSummary) => [
  [
    {
      label: "詳細表示",
      click: async () => {
        await navigateTo({
          name: "admin-news-newsId",
          params: {
            newsId: row.id,
          },
        });
      },
    },
    {
      label: "編集",
      click: async () => {
        await navigateTo({
          name: "admin-news-edit-newsId",
          params: {
            newsId: row.id,
          },
        });
      },
    },
  ],
  [
    {
      label: "削除",
      click: async () => {
        onDelete(row.id);
      },
    }
  ],
];

const isOpenDeleteComfirmModal = ref(false);
const deleteNewsId = ref("");
const deleteNewsTitle = ref("");
const onDelete = (id: string) => {
  const target = newsList.value.filter((v) => { return v.id === id })[0];
  deleteNewsTitle.value = target.title;
  deleteNewsId.value = target.id;
  isOpenDeleteComfirmModal.value = true;
}
const execDelete = async () => {
  isOpenDeleteComfirmModal.value = false;
  const { data: apiResponse, error } = await useCallApi(
    apiEndpoint.value.endpoint + `/v1/official-news/${deleteNewsId.value.toString()}`,
    { method: "delete" }
  );
  if(error.value) {
    // TODO: エラー処理
    return;
  }
  commonAlert.showSuccess(
    "削除完了しました",
  );
  await loadPage();
}

const isHighPriority = (priority: number) => priority >= 100;
</script>

<style scoped>
.special-priority {
  color: red;
  font-weight: bold;
}
</style>
