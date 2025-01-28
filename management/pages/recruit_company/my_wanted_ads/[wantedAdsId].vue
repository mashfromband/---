<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="求人広告　詳細情報">
      <template #right>
        <UButton
          :to="{name: 'recruit_company-my_wanted_ads'}"
          label="一覧に戻る"
          size="xl"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-uturn-left"
        />
      </template>
    </UDashboardNavbar>
    <UTable
      :columns="columns"
      :rows="rows"
      :ui="{
        td: { base: '[&:nth-child(1)]:w-60 break-words whitespace-normal whitespace-pre-line' }
      }"
    >
      <template #invalid-company-warning-data="{ row }">
        <span v-if="row.rowAlias === 'companyName' && !inPeriod" class="invalid-company">無効な企業IDです</span>
      </template>
    </UTable>
    <div>
      <UButton
        label="編集する"
        icon="i-heroicons-pencil-square"
        size="xl"
        :to="{name: 'recruit_company-my_wanted_ads-edit-wantedAdsId', params: {wantedAdsId: wantedAdsId}}"
      />
    </div>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'company'
});

const route = useRoute();
const wantedAdsId = route.params.wantedAdsId as string;

import type {
  paths,
  components,
} from "@/types/api/management";
import { useApiEndpoint } from "~/composables/api";

type ResponseSuccess = paths["/rc/my-recruit-company/wanted-ads/{wantedAdsId}"]["get"]["responses"][200]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();
const { data: apiResponse, error } = await useCallApi<ResponseSuccess>(
  apiEndpoint.value.endpoint + "/v1/rc/my-recruit-company/wanted-ads/" + wantedAdsId,
  { method: "get", }
);

if (!apiResponse.value) {
  throw createError({
    statusCode: 404,
    message: "求人広告が存在しません",
    fatal: true,
  });
}

type RowType = {
  item: string,
  value: string,
  rowAlias?: string
};

const columns = [
  { key: 'item', label: '項目',}
  ,{ key: 'value'}
  ,{ key: 'invalid-company-warning'}
]

const rows: RowType[] = [];
if (apiResponse.value) {
  rows.push({
    item: "ID",
    value: apiResponse.value.id,
  });
  rows.push({
    item: "外部提供用ID",
    value: apiResponse.value.outgoingId, 
  });
  rows.push({
    item: "求人広告出稿企業名",
    value: apiResponse.value.companyName,
    rowAlias: "companyName"
  });
  rows.push({
    item: "求人タイトル",
    value: apiResponse.value.title,
  });
  rows.push({
    item: "掲載期間(開始日)",
    value: apiResponse.value.beginAt,
  });
  rows.push({
    item: "掲載期間(終了日)",
    value: apiResponse.value.endAt,
  });
  rows.push({
    item: "募集職種",
    value: apiResponse.value.position,
  });
  rows.push({
    item: "勤務地",
    value: apiResponse.value.workLocation,
  });
  rows.push({
    item: "雇用形態",
    value: apiResponse.value.employmentStatus,
  });
  rows.push({
    item: "募集人数",
    value: apiResponse.value.numberOfPeople,
  });
  rows.push({
    item: "仕事内容の詳細",
    value: apiResponse.value.details,
  });
  rows.push({
    item: "応募条件",
    value: apiResponse.value.requirements,
  });
  rows.push({
    item: "給与・待遇",
    value: apiResponse.value.salaryAndBenefits,
  });
  rows.push({
    item: "勤務時間",
    value: apiResponse.value.officeHour,
  });
  rows.push({
    item: "休日・休暇",
    value: apiResponse.value.dayOff,
  });
  rows.push({
    item: "福利厚生",
    value: apiResponse.value.welfareProgram,
  });
  rows.push({
    item: "応募方法",
    value: apiResponse.value.howToApply,
  });
  rows.push({
    item: "応募書類",
    value: apiResponse.value.applicationDocuments,
  });
  rows.push({
    item: "応募締切日",
    value: apiResponse.value.applicationDeadline,
  });
};

const isInPeriod = async (recruitCompanyId:string) => {
  type RecruitCompanyDetailResponse = paths["/recruit-company/{recruitCompanyId}"]["get"]["responses"][200]["content"]["application/json"];

  const { data: apiResponse, error } = await useCallApi<RecruitCompanyDetailResponse>(
    apiEndpoint.value.endpoint + `/v1/recruit-company/${recruitCompanyId}`,
    { method: "get" }
  );
  if(!apiResponse.value) {
    //todo エラー対応
    return;
  }

  const now = new Date();
  const beginPeriodAt = new Date(apiResponse.value.beginPeriodAt);
  beginPeriodAt.setHours(0, 0, 0, 0);
  const endPeriodAt = new Date(apiResponse.value.endPeriodAt);
  endPeriodAt.setHours(0, 0, 0, 0);
  
  return beginPeriodAt <= now && now < endPeriodAt;
}
const inPeriod = await isInPeriod(apiResponse.value.companyId);

</script>
<style scoped>
.invalid-company {
  color: red;
  font-weight: bold;
}
</style>