<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="求人企業　編集" />
    <UDashboardPanelContent>
    <UForm :schema="schema" :state="apiResponse!" @submit="onSubmit" @error="onError">
      <UDashboardSection description="すべての項目が入力必須です">
      <UFormGroup label="ID" name="id" description="※編集できません" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" disabled v-model="apiResponse!.id" />
      </UFormGroup>
      <UFormGroup label="外部提供用ID" name="outgoingId" description="※編集できません" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" disabled v-model="apiResponse!.outgoingId" />
      </UFormGroup>
      <UFormGroup label="CPコード" name="cpcode" description="※編集できません" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" disabled v-model="apiResponse!.cpcode" />
      </UFormGroup>
      <UFormGroup label="契約企業名" name="name" description="1～255文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.name" />
      </UFormGroup>
      <UFormGroup label="表示用企業名" name="displayName" description="1～255文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.displayName" />
      </UFormGroup>
      <UFormGroup label="契約期間(開始日)" name="beginPeriodAt" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UButtonGroup size="sm" orientation="horizontal">
          <UInput type="text" v-model="apiResponse!.beginPeriodAt" />
          <UPopover>
            <template #default>
              <UButton icon="i-heroicons-calendar-date-range" color="gray" size="xl" variant="solid" />
            </template>
            <template #panel="{ close }">
              <DatePicker @close="close" />
            </template>
          </UPopover>
        </UButtonGroup>
      </UFormGroup>
      <UFormGroup label="契約期間(終了日)" name="endPeriodAt" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UButtonGroup size="sm" orientation="horizontal">
          <UInput type="text" v-model="apiResponse!.endPeriodAt" />
          <UPopover>
            <template #default>
              <UButton icon="i-heroicons-calendar-date-range" color="gray" size="xl" variant="solid" />
            </template>
            <template #panel="{ close }">
              <DatePicker @close="close" />
            </template>
          </UPopover>
        </UButtonGroup>
      </UFormGroup>
      <UFormGroup label="法人種別" name="companyTypeId" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <CompanyType
          :companyTypeId="apiResponse!.companyTypeId"
          v-on:onSelectCompanyType="onSelectCompanyType"
        />
      </UFormGroup>
      <UFormGroup label="郵便番号" name="postalCode" required description="1～16文字まで" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.postalCode" />
      </UFormGroup>
      <UFormGroup label="都道府県" name="prefectureCode" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <SelectPrefecture
          :default="apiResponse!.prefectureCode"
          v-on:onSelectPrefecture="onSelectPrefecture"
        />
      </UFormGroup>
      <UFormGroup label="住所" name="address" required description="1～255文字まで" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.address" />
      </UFormGroup>
      <UFormGroup label="電話番号" name="phoneNumber" required description="1～16文字まで" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.phoneNumber" />
      </UFormGroup>
      <UFormGroup label="FAX番号" name="faxNumber" required description="1～16文字まで" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.faxNumber" />
      </UFormGroup>
      <UFormGroup label="公式サイトURL" name="officialSiteUrl" required description="1～255文字まで" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.officialSiteUrl" />
      </UFormGroup>
      <UFormGroup label="従業員数" name="employees" required description="1～64文字まで" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.employees" />
      </UFormGroup>
      <UFormGroup label="売上高" name="netSales" required description="1～64文字まで" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.netSales" />
      </UFormGroup>
      <UFormGroup label="企業概要" name="profile" required description="1～1024文字まで" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UTextarea resize v-model="apiResponse!.profile" />
      </UFormGroup>
      <UFormGroup label="設立年月日" name="establishmentDate" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <DateInput
          v-model="apiResponse!.establishmentDate"
          class="flex flex-col sm:flex-row gap-2"
        />
      </UFormGroup>
      <UFormGroup label="担当者名" name="contactPersonName" required description="1～64文字まで" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.contactPersonName" />
      </UFormGroup>
      <UFormGroup label="担当者役職" name="contactPersonPosition" required description="1～64文字まで" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.contactPersonPosition" />
      </UFormGroup>
      <UFormGroup label="担当者電話番号" name="contactPersonPhoneNumber" required description="1～16文字まで" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.contactPersonPhoneNumber" />
      </UFormGroup>
      <UFormGroup label="担当者メールアドレス" name="contactPersionMailAddress" required description="1～16文字まで" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput type="text" v-model="apiResponse!.contactPersionMailAddress" />
      </UFormGroup>
    </UDashboardSection>
      <div>
        <SubmitButton label="この内容で求人企業を更新する" size="xl" />
      </div>
    </UForm>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'company'
});

import type {
  paths,
  components,
} from "@/types/api/management";
import { useApiEndpoint } from "~/composables/api";

type ResponseSuccess = paths["/rc/my-recruit-company"]["get"]["responses"][200]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();

const { data: apiResponse, error } = await useCallApi<ResponseSuccess>(
  apiEndpoint.value.endpoint + "/v1/rc/my-recruit-company",
  {
    method: "get",
  }
);
if (!apiResponse) {
  throw createError({
    statusCode: 404,
    message: "企業情報が存在しません",
    fatal: true,
  });
}

import { number, object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
const schema = object({
  name: string()
    .max(255, "契約企業名は255文字以内です")
    .required("契約企業名は必須です"),
  displayName: string()
    .max(255, "表示用企業名は255文字以内です")
    .required("表示用企業名は必須です"),
  beginPeriodAt: string()
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "契約期間(開始日)はYYYY-MM-DD形式です")
    .required("契約期間(開始日)は必須です"),
  endPeriodAt: string()
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "契約期間(終了日)はYYYY-MM-DD形式です")
    .required("契約期間(終了日)は必須です"),
  companyTypeId: number()
    .min(1, "未指定はできません")
    .required("法人種別は必須です"),
  postalCode: string()
    .matches(/^\d{3}-\d{4}$/, "郵便番号はXXX-XXXX形式です")
    .max(16, "郵便番号は16文字以内です")
    .required("郵便番号は必須です"),
  prefectureCode: number()
    .min(1, "未指定はできません")
    .required("都道府県は必須です"),
  address: string()
    .max(255, "住所は255文字以内です")
    .required("住所は必須です"),
  phoneNumber: string()
    .matches(/^[0-9]*$/, "電話番号のフォーマットに誤りがあります")
    .max(16, "電話番号は16文字以内です")
    .required("電話番号は必須です"),
  faxNumber: string()
    .matches(/^[0-9]*$/, "FAX番号のフォーマットに誤りがあります")
    .max(16, "FAX番号は16文字以内です")
    .required("FAX番号は必須です"),
  officialSiteUrl: string()
    .max(255, "公式サイトURLは255文字以内です")
    .url("公式サイトURLのフォーマットに誤りがあります")
    .required("公式サイトURLは必須です"),
  employees: string()
    .max(64, "従業員数は64文字以内です")
    .required("従業員数は必須です"),
  netSales: string()
    .max(64, "売上高は64文字以内です")
    .required("売上高は必須です"),
  profile: string()
    .max(1024, "企業概要は1024文字以内です")
    .required("企業概要は必須です"),
  establishmentDate: string()
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "設立年月日はYYYY-MM-DD形式です")
    .required("設立年月日は必須です"),
  contactPersonName: string()
    .max(64, "担当者名は64文字以内です")
    .required("担当者名は必須です"),
  contactPersonPosition: string()
    .max(64, "担当者役職は64文字以内です")
    .required("担当者役職は必須です"),
  contactPersonPhoneNumber: string()
    .matches(/^[0-9]*$/, "担当者電話番号のフォーマットに誤りがあります")
    .max(16, "担当者電話番号は16文字以内です")
    .required("担当者電話番号は必須です"),
  contactPersionMailAddress: string()
    .email("メールアドレスのフォーマットに誤りがあります")
    .max(255, "担当者メールアドレスは255文字以内です")
    .required("担当者メールアドレスは必須です"),
});
type Schema = InferType<typeof schema>

const onSelectCompanyType = (selectCompanyTypeId: number): void => {
  apiResponse.value!.companyTypeId = selectCompanyTypeId;
}
const onSelectPrefecture = (selectPrefectureId: number): void => {
  apiResponse.value!.prefectureCode = selectPrefectureId;
}

type UpdateRecruitCompanyRequest =
  paths["/rc/my-recruit-company"]["put"]["requestBody"]["content"]["application/json"];


const onError = () => {
  commonAlert.showInputWarning();
};
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (!apiResponse || !apiResponse.value) {
    return;
  }

  const requestBody: UpdateRecruitCompanyRequest = {
    name: apiResponse.value.name,
    companyTypeId: apiResponse.value.companyTypeId,
    beginPeriodAt: apiResponse.value.beginPeriodAt,
    endPeriodAt: apiResponse.value.endPeriodAt,
    displayName: apiResponse.value.displayName,
    establishmentDate: apiResponse.value.establishmentDate,
    postalCode: apiResponse.value.postalCode,
    prefectureCode: apiResponse.value.prefectureCode,
    address: apiResponse.value.address,
    phoneNumber: apiResponse.value.phoneNumber,
    faxNumber: apiResponse.value.faxNumber,
    officialSiteUrl: apiResponse.value.officialSiteUrl,
    employees: apiResponse.value.employees,
    netSales: apiResponse.value.netSales,
    profile: apiResponse.value.profile,
    contactPersonName: apiResponse.value.contactPersonName,
    contactPersonPosition: apiResponse.value.contactPersonPosition,
    contactPersonPhoneNumber: apiResponse.value.contactPersonPhoneNumber,
    contactPersionMailAddress: apiResponse.value.contactPersionMailAddress,
  };

  const { data: updateApiResponse, error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/rc/my-recruit-company",
    {
      method: "put",
      body: requestBody,
    },
  );

  if(error.value) {
    commonAlert.showWarn("更新失敗しました。");
    return;
  }

  commonAlert.showSuccess(
    "更新しました。",
    "/recruit_company/my_recruit_company",
  );

}
</script>
