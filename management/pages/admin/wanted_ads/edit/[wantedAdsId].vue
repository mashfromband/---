<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="求人広告　編集" />
    <UDashboardPanelContent>
      <UForm ref="form" :schema="schema" :state="getAdDetailResponse" @submit="onSubmit" @error="onError">
        <UDashboardSection
          description="すべての項目が入力必須です"
        >
        <UFormGroup label="ID" description="※編集できません" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" disabled v-model="getAdDetailResponse!.id" />
        </UFormGroup>
        <UFormGroup label="外部提供用ID" description="※編集できません" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" disabled v-model="getAdDetailResponse!.outgoingId" />
        </UFormGroup>
        <UFormGroup label="求人広告出稿企業名" description="※編集できません" class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" disabled v-model="getAdDetailResponse!.companyName" />
        </UFormGroup>
        <UFormGroup label="求人タイトル" name="title" description="1～128文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" v-model="getAdDetailResponse!.title" placeholder="（例）【急募】Webエンジニア／フレックスタイム制・リモートワーク可" />
        </UFormGroup>
        <UFormGroup label="掲載期間(開始日)" name="beginAt" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UButtonGroup size="sm" orientation="horizontal">
            <UInput type="text" v-model="getAdDetailResponse!.beginAt" />
            <UPopover>
              <template #default>
                <UButton icon="i-heroicons-calendar-date-range" color="gray" variant="solid" />
              </template>
              <template #panel="{ close }">
                <DatePicker v-model="getAdDetailResponse!.beginAt" @close="close" />
              </template>
            </UPopover>
          </UButtonGroup>
        </UFormGroup>
        <UFormGroup label="掲載期間(終了日)" name="endAt" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UButtonGroup size="sm" orientation="horizontal">
            <UInput type="text" v-model="getAdDetailResponse!.endAt" />
            <UPopover>
              <template #default>
                <UButton icon="i-heroicons-calendar-date-range" color="gray" size="xl" variant="solid" />
              </template>
              <template #panel="{ close }">
                <DatePicker v-model="getAdDetailResponse!.endAt" @close="close" />
              </template>
            </UPopover>
          </UButtonGroup>
        </UFormGroup>
        <UFormGroup label="募集職種" name="position" description="1～64文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" v-model="getAdDetailResponse!.position" placeholder="（例）Webエンジニア（バックエンド／フロントエンド）" />
        </UFormGroup>
        <UFormGroup label="勤務地" name="workLocation" description="1～64文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" v-model="getAdDetailResponse!.workLocation" placeholder="（例）東京都千代田区（リモートワーク可）" />
        </UFormGroup>
        <UFormGroup label="雇用形態" name="employmentStatus" description="1～64文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" v-model="getAdDetailResponse!.employmentStatus" placeholder="（例）正社員（試用期間3ヶ月）" />
        </UFormGroup>
        <UFormGroup label="募集人数" name="numberOfPeople" description="1～32文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" v-model="getAdDetailResponse!.numberOfPeople" placeholder="（例）若干名" />
        </UFormGroup>
        <UFormGroup label="仕事内容の詳細" name="details" description="1～2048文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="getAdDetailResponse!.details" resize placeholder="（例）&#10;弊社プロジェクトチームにおけるWebアプリケーションの開発業務を担当いただきます。" />
        </UFormGroup>
        <UFormGroup label="応募条件" name="requirements" description="1～255文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="getAdDetailResponse!.requirements" resize placeholder="（例）&#10;Webアプリケーション開発の実務経験（3年以上）&#10;JavaScript、TypeScript、React または Vue.js の使用経験" />
        </UFormGroup>
        <UFormGroup label="給与・待遇" name="salaryAndBenefits" description="1～255文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="getAdDetailResponse!.salaryAndBenefits" resize  placeholder="（例）&#10;年収：◯◯万円～◯◯万円（経験・スキルにより応相談）" />
        </UFormGroup>
        <UFormGroup label="勤務時間" name="officeHour" placeholder="1～128文字まで" description="1～128文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="getAdDetailResponse!.officeHour" resize  placeholder="（例）フレックスタイム制（コアタイム：11:00～15:00）" />
        </UFormGroup>
        <UFormGroup label="休日・休暇" name="dayOff" description="1～128文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="getAdDetailResponse!.dayOff" resize placeholder="（例）完全週休2日制（土・日）" />
        </UFormGroup>
        <UFormGroup label="福利厚生" name="welfareProgram" description="1～255文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="getAdDetailResponse!.welfareProgram" resize placeholder="（例）社会保険完備" />
        </UFormGroup>
        <UFormGroup label="応募方法" name="howToApply" description="1～128文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="getAdDetailResponse!.howToApply" resize placeholder="（例）下記の応募フォームにてご応募ください。" />
        </UFormGroup>
        <UFormGroup label="応募書類" name="applicationDocuments" description="1～255文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="getAdDetailResponse!.applicationDocuments" resize placeholder="" />
        </UFormGroup>
        <UFormGroup label="応募締切日" name="applicationDeadline" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UButtonGroup size="sm" orientation="horizontal">
            <UInput type="text" v-model="getAdDetailResponse!.applicationDeadline" />
            <UPopover :popper="{ placement: 'top-end' }">
              <template #default>
                <UButton icon="i-heroicons-calendar-date-range" color="gray" variant="solid" />
              </template>
              <template #panel="{ close }">
                <DatePicker v-model="getAdDetailResponse!.applicationDeadline" @close="close" />
              </template>
            </UPopover>
          </UButtonGroup>
        </UFormGroup>
        </UDashboardSection>
        <SubmitButton label="この内容で求人広告を更新する" size="xl" />
      </UForm>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
});

import type { paths, components } from "@/types/api/management";
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
const schema = object({
  title: string()
    .required("求人タイトルは必須です")
    .max(128, "求人タイトルは128文字以内です"),

  beginAt: string()
    .required("掲載期間(開始日)は必須です")
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "掲載期間(開始日)はYYYY-MM-DD形式です"),

  endAt: string()
    .required("掲載期間(終了日)は必須です")
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "掲載期間(終了日)はYYYY-MM-DD形式です"),

  position: string()
    .required("募集職種は必須です")
    .max(64, "募集職種は64文字以内です"),

  workLocation: string()
    .required("勤務地は必須です")
    .max(64, "勤務地は64文字以内です"),

  employmentStatus: string()
    .required("雇用形態は必須です")
    .max(64, "雇用形態は64文字以内です"),

  numberOfPeople: string()
    .required("募集人数は必須です")
    .max(32, "募集人数は32文字以内です"),

  details: string()
    .required("仕事内容の詳細は必須です")
    .max(2048, "仕事内容の詳細は2048文字以内です"),

  requirements: string()
    .required("応募条件は必須です")
    .max(255, "応募条件は255文字以内です"),

  salaryAndBenefits: string()
    .required("給与・待遇は必須です")
    .max(255, "給与・待遇は255文字以内です"),

  officeHour: string()
    .required("勤務時間は必須です")
    .max(128, "勤務時間は128文字以内です"),

  dayOff: string()
    .required("休日・休暇は必須です")
    .max(128, "休日・休暇は128文字以内です"),

  welfareProgram: string()
    .required("福利厚生は必須です")
    .max(255, "福利厚生は255文字以内です"),

  howToApply: string()
    .required("応募方法は必須です")
    .max(128, "応募方法は128文字以内です"),

  applicationDocuments: string()
    .required("応募書類は必須です")
    .max(255, "応募書類は255文字以内です"),

  applicationDeadline: string()
    .required("応募締切日は必須です")
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "応募締切日はYYYY-MM-DD形式です"),
});
type Schema = InferType<typeof schema>

const route = useRoute();
const wantedAdsId = route.params.wantedAdsId as string;

type ResponseSuccess = paths["/wanted-ads/{wantedAdsId}"]["get"]["responses"][200]["content"]["application/json"];
const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();

const { data: getAdDetailResponse, error } = await useCallApi<ResponseSuccess>(
  apiEndpoint.value.endpoint + "/v1/wanted-ads/" + wantedAdsId,
  { method: "get",}
);


const onError = () => {
  commonAlert.showInputWarning();
};
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (!getAdDetailResponse || !getAdDetailResponse.value) {
    return;
  }
  type UpdateRecruitCompanyRequest = paths["/wanted-ads/{wantedAdsId}"]["put"]["requestBody"]["content"]["application/json"];
  const requestBody: UpdateRecruitCompanyRequest = {
    companyId: getAdDetailResponse.value.companyId,
    title: getAdDetailResponse.value.title,
    position: getAdDetailResponse.value.position,
    workLocation: getAdDetailResponse.value.workLocation,
    employmentStatus: getAdDetailResponse.value.employmentStatus,
    numberOfPeople: getAdDetailResponse.value.numberOfPeople,
    details: getAdDetailResponse.value.details,
    requirements: getAdDetailResponse.value.requirements,
    salaryAndBenefits: getAdDetailResponse.value.salaryAndBenefits,
    officeHour: getAdDetailResponse.value.officeHour,
    dayOff: getAdDetailResponse.value.dayOff,
    welfareProgram: getAdDetailResponse.value.welfareProgram,
    howToApply: getAdDetailResponse.value.howToApply,
    applicationDocuments: getAdDetailResponse.value.applicationDocuments,
    applicationDeadline: getAdDetailResponse.value.applicationDeadline,
    beginAt: getAdDetailResponse.value.beginAt,
    endAt: getAdDetailResponse.value.endAt 
  }

  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + `/v1/wanted-ads/${getAdDetailResponse.value.id}`,
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
    "/admin/wanted_ads",
  );
}
</script>