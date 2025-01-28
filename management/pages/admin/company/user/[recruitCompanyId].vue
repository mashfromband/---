<template>
    <UDashboardPage>
      <UDashboardPanel grow>
        <UDashboardNavbar title="求人企業ユーザー　一覧">
          <template #right>
            <UButton
              :to="{name: 'admin-company-user-add-recruitCompanyId', params: {recruitCompanyId: recruitCompanyId}}"
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
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: '該当する求人企業ユーザーはありません。' }"
          :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
          :columns="visibleColumns"
          :rows="recruitCompanyUserList"
          :ui="{
            tbody: '[&>tr:hover]:bg-gray-50 dark:[&>tr:hover]:bg-gray-800/50',
            td: { base: 'truncate max-w-60' }
          }"
        >
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
              <div class="grid grid-cols-4 gap-2">
                <div class="font-bold">ユーザーID</div><div class="col-span-3">{{ deleteUserId }}</div>
                <div class="font-bold">メールアドレス</div><div class="col-span-3">{{ deleteMailAddress }}</div>
              </div>
            </UCard>
          </div>
          <div class="p-4">
            <UButton label="削除する" color="red" v-on:click="execDelete" class="mr-2" />
            <UButton label="キャンセル" color="white" v-on:click="isOpenDeleteComfirmModal=false" class="mr-2"  />
          </div>
        </UModal>

        <UModal v-model="isOpenChangeReceiverComfirmModal">
          <div class="p-4">
            <UAlert
              icon="i-heroicons-exclamation-triangle"
              color="green"
              variant="outline"
              title="求人応募受取ユーザーに変更しますか?"
              description=""
            />
          </div>
          <div class="p-4">
            <div class="font-bold">変更するユーザー</div>
            <UCard>
              <div class="grid grid-cols-4 gap-2">
                <div class="font-bold">ユーザーID</div><div class="col-span-3">{{ changeReceverApplyJobFromUserId }}</div>
                <div class="font-bold">メールアドレス</div><div class="col-span-3">{{ changeReceverApplyJobFromUserMailAddress }}</div>
              </div>
            </UCard>
          </div>
          <div class="p-4">
            <UButton label="変更する" color="green" v-on:click="execChangeReceiver" class="mr-2" />
            <UButton label="キャンセル" color="white" v-on:click="isOpenChangeReceiverComfirmModal=false" class="mr-2"  />
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
  
  type ResponseGetUserListSuccess = paths["/recruit-company/user/{recruitCompanyId}"]["get"]["responses"][200]["content"]["application/json"];
  type RecruitCompanyUserType = ResponseGetUserListSuccess["users"][number];

  const route = useRoute();
  const recruitCompanyId = route.params.recruitCompanyId as string;

  const apiEndpoint = useApiEndpoint();
  const commonAlert = useCommonAlert();
  const pagination = reactive(useRoutePagination());
  const recruitCompanyUserList = ref<RecruitCompanyUserType[]>([]);
  
  const loadPage = async () => {
    const limit = pagination.pageCount;
    const offset = (pagination.page - 1) * pagination.pageCount;
    const { data } = await useCallApi<ResponseGetUserListSuccess>(
      apiEndpoint.value.endpoint + "/v1/recruit-company/user/" + recruitCompanyId,
      {
        method: "get",
        query: { offset, limit, sort: "-id" },
      },
    );
    if (!data.value) {
      return;
    }
    recruitCompanyUserList.value = data.value.users;
    if (data.value.total != null) {
      pagination.total = data.value.total;
    }
  };
  await loadPage();
  watch(() => [pagination.page, pagination.pageCount].toString(), loadPage);

  const columns = [
    {
      key: "userId",
      label: "ユーザーID",
    },
    {
      key: "mailAddress",
      label: "メールアドレス",
    },
    {
      key: "isReceverApplyJobFromUser",
      label: "求人応募受取ユーザー",
    },
    {
      key: "actions",
      switchable: false
    }
  ];
  
  const columnList = columns.filter(column => column.switchable !== false);
  const switchableColumns = ref(columnList);
  const selectedColumns = ref([...columnList]);
  const visibleColumns = computed(() => {
    return columns.filter(column => 
      selectedColumns.value.includes(column) || column.switchable === false
    );
  });
  
  const actionItems = (row: RecruitCompanyUserType) => [
  [
      {
        label: "求人応募受取ユーザーにする",
        click: async () => {
          onChangeReceverApplyJobFromUser(row.userId);
        },
      }
    ],
    [
      {
        label: "削除",
        click: async () => {
          onDelete(row.userId);
        },
      }
    ],
  ];

  const isOpenChangeReceiverComfirmModal = ref(false);
  const changeReceverApplyJobFromUserId = ref("");
  const changeReceverApplyJobFromUserMailAddress = ref("");

  const onChangeReceverApplyJobFromUser = (id: string) => {
    const targetUser = recruitCompanyUserList.value.filter((v) => { return v.userId === id })[0];
    changeReceverApplyJobFromUserId.value = targetUser.userId;
    changeReceverApplyJobFromUserMailAddress.value = targetUser.mailAddress;
    isOpenChangeReceiverComfirmModal.value = true;
  }

  const execChangeReceiver = async () => {
    type ChangeRequestType =
      paths["/recruit-company/{recruitCompanyId}/receive-apply-job-user"]["put"]["requestBody"]["content"]["application/json"];
    isOpenChangeReceiverComfirmModal.value = false;
    const body: ChangeRequestType = {
      userId: changeReceverApplyJobFromUserId.value,
    };

    const { data: changeReceiverApiResponse, error } = await useCallApi(
      apiEndpoint.value.endpoint + "/v1/recruit-company/" + recruitCompanyId + "/receive-apply-job-user",
      {
        method: "put",
        body: body,
      }
    );

    if (error.value) {
      commonAlert.showWarn("変更に失敗しました");
      return;
    }

    commonAlert.showSuccess(
      "変更完了しました",
    );

    await loadPage();
  }

  const isOpenDeleteComfirmModal = ref(false);
  const deleteUserId = ref("");
  const deleteMailAddress = ref("");
  
  const onDelete = (id: string) => {
    const targetUser = recruitCompanyUserList.value.filter((v) => { return v.userId === id })[0];
    deleteUserId.value = targetUser.userId;
    deleteMailAddress.value = targetUser.mailAddress;
    isOpenDeleteComfirmModal.value = true;
  }
  
  const execDelete = async () => {
    type DeleteRequestType = paths["/recruit-company/user/{recruitCompanyId}"]["delete"]["requestBody"]["content"]["application/json"];
    isOpenDeleteComfirmModal.value = false;
    const body: DeleteRequestType = {
      mailAddress: deleteMailAddress.value,
    };

    const { data: deleteApiResponse, error } = await useCallApi(
      apiEndpoint.value.endpoint + "/v1/recruit-company/user/" + recruitCompanyId,
      {
        method: "delete",
      }
    );
  
    if (error.value) {
      commonAlert.showWarn("削除に失敗しました");
      return;
    }
  
    commonAlert.showSuccess(
      "削除完了しました",
    );
  
    await loadPage();
  }
  </script>
  