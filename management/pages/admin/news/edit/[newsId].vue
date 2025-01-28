<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="お知らせ　編集">
      <template #right>
        <UButton
          :to="{name: 'admin-news'}"
          label="一覧に戻る"
          size="xl"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-uturn-left"
        />
      </template>
    </UDashboardNavbar>
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
        <UFormGroup label="ID" description="※編集できません" name="id" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" disabled v-model="state.id" />
        </UFormGroup>
        <UFormGroup label="外部提供用ID" description="※編集できません" name="outgoingId" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" disabled v-model="state.outgoingId" />
        </UFormGroup>
        <UFormGroup label="タイトル" name="title" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" v-model="state.title" />
        </UFormGroup>
        <UFormGroup label="詳細" name="detail" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="state.detail" resize />
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
          <USelect :options="priorityOptions" v-model.number="state.priority" />
        </UFormGroup>
        </UDashboardSection>
        <SubmitButton label="この内容でお知らせを更新する" size="xl" />
      </UForm>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
});

import type { paths } from "@/types/api/management";
import { number, object, string, type InferType } from 'yup'

const route = useRoute();
const newsId = route.params.newsId as string;

type ResponseSuccess = paths["/official-news/{officialNewsId}"]["get"]["responses"][200]["content"]["application/json"];
const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();

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

const normalizedPriority = (priority: number) => priority >= 100 ? 100 : 1;

const state = reactive({
  id: apiResponse.value.id,
  outgoingId: apiResponse.value.outgoingId,
  title: apiResponse.value.title,
  detail: apiResponse.value.detail,
  beginPeriodAt: apiResponse.value.beginPeriodAt,
  endPeriodAt: apiResponse.value.endPeriodAt,
  priority: normalizedPriority(apiResponse.value.priority),
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

const onSubmit = async () => {
  type requestBody = paths["/official-news/{officialNewsId}"]["put"]["requestBody"]["content"]["application/json"];
  
  const body:requestBody = {
    title: state.title,
    detail: state.detail,
    priority: state.priority,
    beginPeriodAt: state.beginPeriodAt,
    endPeriodAt: state.endPeriodAt,
  }

  const { data: apiResponse, error } = await useCallApi(
    apiEndpoint.value.endpoint + `/v1/official-news/${state.id}`,
    { method: "put",body: body,},
  );

  if(error.value) {
    commonAlert.showWarn(
      "更新失敗しました。"
    );
  } else {
    commonAlert.showSuccess(
      "更新しました。",
      "/admin/news"
    );
  }
}

const onError = () => {
  commonAlert.showInputWarning();
};

const priorityOptions=[
  {label:'通常',value:1},
  {label:'特別なお知らせ',value:100},
]
</script>
