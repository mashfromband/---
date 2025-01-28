<template>
  <USelect
    :options="companyTypeList"
    option-attribute="name"
    v-on:change="onSelect"
    v-model="props.companyTypeId"
  />
</template>

<script setup lang="ts">
import type {
  paths,
  components,
} from "@/types/api/management";
import { useApiEndpoint } from "~/composables/api";

interface Props {
  companyTypeId: number,
}
const props = defineProps<Props>();

interface Emits {
  (event: string, companyTypeId: number): void;
}
const emit = defineEmits<Emits>();

type ResponseSuccess = paths["/company-type"]["get"]["responses"][200]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();
const { data: apiResponse, error } = await useCallApi<ResponseSuccess>(
  apiEndpoint.value.endpoint + "/v1/company-type",
  {
    method: "get",
  }
);

type CompanyType = {
  id: number,
  name: string,
  value: string,
}
const companyTypeList: CompanyType[] = [];
if (apiResponse.value) {
  for (const companyType of apiResponse.value.companyTypes) {
    companyTypeList.push({
      id: companyType.id,
      name: companyType.name,
      value: companyType.id.toString(),
    });
  }
}

const onSelect = (companyTypeId: string) => {
  emit("onSelectCompanyType", parseInt(companyTypeId, 10));
}
</script>
