<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="お知らせ　新規追加" />
    <UDashboardPanelContent>
      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        @error="onError"
      >
        <UDashboardSection
          description="すべての項目が入力必須です"
        >
          <UFormGroup label="タイトル" name="title" description="1～255文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
            <UInput type="text" v-model="state.title" placeholder="（例）サーバーメンテナンスのお知らせ" />
          </UFormGroup>
          <UFormGroup label="詳細" name="detail" description="1～4096文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
            <UTextarea v-model="state.detail" resize placeholder="（例）&#10;平素より弊社サービスをご利用いただき、誠にありがとうございます。下記の通り、サーバーメンテナンスを実施いたしますので、ご案内申し上げます。" />
          </UFormGroup>
          <UFormGroup label="掲載期間(開始日)" name="beginPeriodAt" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
            <UButtonGroup size="sm" orientation="horizontal">
              <UInput type="text" v-model="state.beginPeriodAt" />
              <UPopover>
                <template #default>
                  <UButton icon="i-heroicons-calendar-date-range" color="gray" size="xl" variant="solid" />
                </template>
                <template #panel="{ close }">
                  <DatePicker v-model="state.beginPeriodAt" @close="close" />
                </template>
              </UPopover>
            </UButtonGroup>
          </UFormGroup>
          <UFormGroup label="掲載期間(終了日)" name="endPeriodAt" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
            <UButtonGroup size="sm" orientation="horizontal">
              <UInput type="text" v-model="state.endPeriodAt" />
              <UPopover>
                <template #default>
                  <UButton icon="i-heroicons-calendar-date-range" color="gray" size="xl" variant="solid" />
                </template>
                <template #panel="{ close }">
                  <DatePicker v-model="state.endPeriodAt" @close="close" />
                </template>
              </UPopover>
            </UButtonGroup>
          </UFormGroup>
          <UFormGroup label="表示優先度" name="priority" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
            <USelect :options="priorityOptions" v-model.number="state.priority"/>
          </UFormGroup>
        </UDashboardSection>
        <SubmitButton label="この内容でお知らせを新規追加する" size="xl" />
      </UForm>
    </UDashboardPanelContent>

    <UModal v-model="isOpenComfirmModal">
      <div class="p-4">
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="green"
          variant="outline"
          title="この内容で新規追加しますか?"
        />
      </div>
      <div class="p-4">
        <div class="font-bold">新規追加対象</div>
        <UCard>
          <div class="grid grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto">
            <div class="font-bold">タイトル</div>
            <div class="col-span-3">{{ state.title }}</div>
            <div class="font-bold">詳細</div>
            <div class="col-span-3 whitespace-pre-wrap">{{ state.detail }}</div>
            <div class="font-bold">掲載期間(開始日)</div>
            <div class="col-span-3">{{ state.beginPeriodAt }}</div>
            <div class="font-bold">掲載期間(終了日)</div>
            <div class="col-span-3">{{ state.endPeriodAt }}</div>
            <div class="font-bold">表示優先度</div>
            <div v-if="state.priority === 100" class="special-priority col-span-3 text-red-500 font-bold">特別なお知らせ</div>
            <div v-else class="col-span-3">通常</div>
          </div>
        </UCard>
      </div>
      <div class="p-4">
        <UButton label="新規追加する" color="green" class="mr-2" @click="onConfirm(true)" />
        <UButton label="キャンセル" color="white" class="mr-2" @click="onConfirm(false)" />
      </div>
    </UModal>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
});

import type { paths } from "@/types/api/management";
import { format } from "date-fns";
import { number, object, string } from 'yup'

const now = new Date();
const state = reactive({
  title: "",
  detail: "",
  beginPeriodAt: format(now, "yyyy-MM-dd"),
  endPeriodAt: format(now, "yyyy-MM-dd"),
  priority: 1,
});

const schema = object({
  title: string()
    .required("タイトルは必須です")
    .max(255, "タイトルは255文字以内です"),

  beginPeriodAt: string()
    .required("掲載期間(開始日)は必須です")
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "掲載期間(開始日)はYYYY-MM-DD形式です"),

  endPeriodAt: string()
    .required("掲載期間(終了日)は必須です")
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "掲載期間(終了日)はYYYY-MM-DD形式です"),

  detail: string()
    .required("詳細は必須です")
    .max(4096, "詳細は4096文字以内です"),

  priority: number()
    .required("表示優先度は必須です"),
});

const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();

const isOpenComfirmModal = ref(false);

const onSubmit = async () => {
  isOpenComfirmModal.value = true;
};

const onError = () => {
  commonAlert.showInputWarning();
};

const onConfirm = async (confirmed: boolean) => {
  isOpenComfirmModal.value = false;
  if (!confirmed) {
    return;
  }

  type RequestBody =
    paths["/official-news"]["post"]["requestBody"]["content"]["application/json"];
  const requestBody: RequestBody = state;
  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/official-news",
    {
      method: "post",
      body: requestBody,
    },
  );

  if(error.value) {
    commonAlert.showWarn(
      "新規追加失敗しました。"
    );
  } else {
    commonAlert.showSuccess(
      "新規追加完了しました。",
      "/admin/news",
    );
  }
};

const priorityOptions=[
  {label:'通常',value:1},
  {label:'特別なお知らせ',value:100},
]
</script>
