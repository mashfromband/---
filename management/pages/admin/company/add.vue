<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="求人企業　新規追加" />
    <UDashboardPanelContent>
    <UForm :schema="schema" :state="state" @submit="onSubmit" @error="onError">
      <UDashboardSection
        description="すべての項目が入力必須です"
      >
      <UFormGroup label="契約会社名" name="companyName" description="1～255文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput v-model="state.companyName" type="text" placeholder="（例）◯◯◯◯株式会社" />
      </UFormGroup>
      <UFormGroup label="企業種別" name="companyTypeId" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <CompanyType
          :companyTypeId="state.companyTypeId"
          v-on:onSelectCompanyType="onSelectCompanyType"
        />
      </UFormGroup>
      <UFormGroup label="契約期間(開始日)" name="beginPeriodAt" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
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
      <UFormGroup label="契約期間(終了日)" name="endPeriodAt" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
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
      </UDashboardSection>
      <SubmitButton label="この内容で求人企業を新規追加する" size="xl" />
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
            <div class="font-bold">契約会社名</div>
            <div class="col-span-3">{{ state.companyName }}</div>
            <div class="font-bold">契約期間(開始日)</div>
            <div class="col-span-3">{{ state.beginPeriodAt }}</div>
            <div class="font-bold">契約期間(終了日)</div>
            <div class="col-span-3">{{ state.endPeriodAt }}</div>
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
import type { paths } from "@/types/api/management";
import { format } from "date-fns";

definePageMeta({
  middleware: ["admin-only"], // 管理者しか見れないページ
  layout: 'admin'
});

const now = new Date();
const state = reactive({
  companyName: "",
  companyTypeId: 0,
  beginPeriodAt: format(now, "yyyy-MM-dd"),
  endPeriodAt: format(now, "yyyy-MM-dd"),
});

import { number, object, string } from 'yup'

const schema = object({
  companyName: string()
    .required("企業名は必須です")
    .max(255, "企業名は255文字以内です"),

  companyTypeId: number()
    .min(1, "未指定はできません"),

  beginPeriodAt: string()
    .required("契約期間(開始日)は必須です")
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "契約期間(開始日)はYYYY-MM-DD形式です"),

  endPeriodAt: string()
    .required("契約期間(終了日)は必須です")
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "契約期間(終了日)はYYYY-MM-DD形式です"),
});

const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();

const onSelectCompanyType = (selectCompanyTypeId: number): void => {
  state.companyTypeId = selectCompanyTypeId;
}

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

  type RequestPostRecruitCompany =
    paths["/recruit-company"]["post"]["requestBody"]["content"]["application/json"];
  const requestBody: RequestPostRecruitCompany = {
    name: state.companyName,
    companyTypeId: state.companyTypeId,
    beginPeriodAt: state.beginPeriodAt,
    endPeriodAt: state.endPeriodAt,
  };

  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/recruit-company",
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
      "/admin/company",
    );
  }
}
</script>
