<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="求人企業　詳細情報">
      <template #right>
        <UButton
          label="一覧に戻る"
          :to="{name: 'admin-company'}"
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
            <span :class="row.class">{{ row.value }}</span>
          </template>
        </UTable>
        <div>
          <UButton
            label="編集する"
            icon="i-heroicons-pencil-square"
            size="xl"
            :to="{name: 'admin-company-edit-recruitCompanyId', params: {recruitCompanyId: recruitCompanyId}}"
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

const route = useRoute();
const recruitCompanyId = route.params.recruitCompanyId as string;

import type {
  paths,
  components,
} from "@/types/api/management";
import { useApiEndpoint } from "~/composables/api";
import { getCode2Prefecture } from "~/utils/prefecture";

type ResponseSuccess = paths["/recruit-company/{recruitCompanyId}"]["get"]["responses"][200]["content"]["application/json"];
type ResponseGetCompanyType = paths["/company-type"]["get"]["responses"][200]["content"]["application/json"]

const apiEndpoint = useApiEndpoint();
const { data: apiResponse, error } = await useCallApi<ResponseSuccess>(
  apiEndpoint.value.endpoint + "/v1/recruit-company/" + recruitCompanyId,
  {
    method: "get",
  }
);

const { data: apiCompanyTypeResponse, error: apiCompanyTypeError } = await useCallApi<ResponseGetCompanyType>(
  apiEndpoint.value.endpoint + "/v1/company-type",
  {
    method: "get",
  }
);

const displayCompanyType = apiCompanyTypeResponse.value?.companyTypes.filter((v) => v.id === apiResponse.value?.companyTypeId)[0];

interface Emits {
  (event: string, companyTypeId: number): void;
}
const emit = defineEmits<Emits>();

const columns = [
  {
    key: "item",
    label: "項目",
  },
  {
    key: "value",
  },
];

type RowType = {
  item: string,
  value: string,
  class?: string
};

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
    item: "CPコード",
    value: apiResponse.value.cpcode,
  });
  rows.push({
    item: "契約企業名",
    value: apiResponse.value.name,
  });
  rows.push({
    item: "表示用企業名",
    value: apiResponse.value.displayName,
  });
  rows.push({
    item: "契約期間(開始日)",
    value: apiResponse.value.beginPeriodAt,
  });
  rows.push({
    item: "契約期間(終了日)",
    value: apiResponse.value.endPeriodAt,
  });
  rows.push({
    item: "企業種別",
    value: displayCompanyType?.name || "未指定",
  })
  rows.push({
    item: "郵便番号",
    value: apiResponse.value.postalCode,
  });
  rows.push({
    item: "都道府県",
    value: getCode2Prefecture(apiResponse.value.prefectureCode) || "",
  })
  rows.push({
    item: "住所",
    value: apiResponse.value.address,
  });
  rows.push({
    item: "電話番号",
    value: apiResponse.value.phoneNumber,
  });
  rows.push({
    item: "FAX番号",
    value: apiResponse.value.faxNumber,
  });
  rows.push({
    item: "公式サイトURL",
    value: apiResponse.value.officialSiteUrl,
  });
  rows.push({
    item: "契約企業名",
    value: apiResponse.value.name,
  });
  rows.push({
    item: "従業員数",
    value: apiResponse.value.employees,
  });
  rows.push({
    item: "売上高",
    value: apiResponse.value.netSales,
  });
  rows.push({
    item: "企業概要",
    value: apiResponse.value.profile,
    class: "multi-line-content",
  });
  rows.push({
    item: "設立年月日",
    value: apiResponse.value.establishmentDate,
  });
  rows.push({
    item: "担当者名",
    value: apiResponse.value.contactPersonName,
  });
  rows.push({
    item: "担当者役職",
    value: apiResponse.value.contactPersonPosition,
  });
  rows.push({
    item: "担当者電話番号",
    value: apiResponse.value.contactPersonPhoneNumber,
  });
  rows.push({
    item: "担当者メールアドレス",
    value: apiResponse.value.contactPersionMailAddress,
  });
};

</script>


<style scoped>
.multi-line-content {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
