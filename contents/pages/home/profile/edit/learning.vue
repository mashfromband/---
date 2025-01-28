<template>
  <UDashboardPanelContent class="py-8"
    :ui="{
      wrapper:'p-0 bg-white/80 dark:bg-gray-800/50'
    }"
  >
    <UForm
      :state="apiResponse"
      :schema="validationSchema"
      @submit="onSubmit"
      @error="onError"
    >
      <UDashboardSection
        title="学習目標の編集"
        description="一般に公開される学習目標です"
        icon="i-heroicons-pencil-square"
      >
        <template #links>
          <SubmitButton
            label="保存する"
            color="black"
          />
        </template>
      </UDashboardSection>
      <UDashboardSection
        title="学習目標"
        class="px-4 py-6"
      >
        <UFormGroup
          name="purpose"
          label=""
          class="grid grid-cols-2 gap-2 items-center"
        >
          <UTextarea
            :rows="5"
            autoresize
            size="md"
            v-model="apiResponse.purpose"
          />
        </UFormGroup>
        </UDashboardSection>
        <UDashboardSection
        title="スキル・知識"
        class="px-4 py-6"
      >
        <UFormGroup
          name="targetSkill"
          label="目標とするスキル"
          class="grid grid-cols-2 gap-2"
        >
          <UTextarea
            :rows="5"
            autoresize
            size="md"
            v-model="apiResponse.targetSkill"
          />
        </UFormGroup>
        <UFormGroup
          name="targetKnowledge"
          label="身につけたい知識"
          class="grid grid-cols-2 gap-2"
        >
          <UTextarea
            :rows="5"
            autoresize
            size="md"
            v-model="apiResponse.targetKnowledge"
          />
        </UFormGroup>
      </UDashboardSection>
      <UDashboardSection>
        <template #links>
          <SubmitButton
            label="保存する"
            color="black"
          />
        </template>
      </UDashboardSection>
    </UForm>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import * as yup from "yup";
import type { paths } from "@/types/api/contents";

definePageMeta({
  layout: 'profile'
})

const validationSchema = (() => {
  const { object, string } = yup;
  return ref(object({
    purpose: string()
      .max(20000, "入力可能な文字数は20,000文字以内です"),

    targetSkill: string()
      .max(20000, "入力可能な文字数は20,000文字以内です"),

    targetKnowledge: string()
      .max(20000, "入力可能な文字数は20,000文字以内です"),
  }));
})();

type ApiSuccessResponse =
  paths["/user/me"]["get"]["responses"]["200"]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();
const notifier = useNotification();

const { data: response, error } = await useCallApi(
  apiEndpoint.value.endpoint + "/v1/user/me",
  {
    method: "get",
  }
);

const apiResponse = ref<ApiSuccessResponse>(response.value as ApiSuccessResponse);

const onError = () => {
  commonAlert.showWarn("入力項目に不備があります。");
};

const onSubmit = async () => {
  type ApiRequest = paths["/user/me"]["put"]["requestBody"]["content"]["application/json"];

  const requestBody: ApiRequest = {
    nickname: apiResponse.value.nickname,
    selfIntroduction: apiResponse.value.selfIntroduction,
    purpose: apiResponse.value.purpose,
    targetSkill: apiResponse.value.targetSkill,
    targetKnowledge: apiResponse.value.targetKnowledge,
    userIconId: apiResponse.value.userIconId,
  };

  const url = apiEndpoint.value.endpoint + "/v1/user/me"; // TODO: 外に出す
  const response = await useCallApi<ApiSuccessResponse>(url, {
    method: "put",
    body: requestBody,
  });

  const body = response.data.value;
  if (response.error.value || !body) {
    commonAlert.showWarn("更新に失敗しました。");
    return;
  }

  notifier.notifySuccess("更新完了しました。");
  navigateTo("/home/profile");
};

const links : BreadcrumbLinkItem[] = [
  {
    to: "/home",
    icon:"i-heroicons-home-20-solid"
  },
  {
    label: "プロフィール",
    to: "/home/profile",
  },
  {
    label: "学習目標の編集",
  },
];
const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);
onMounted(() => {
  breadcrumblinks.value = [...links];
});
</script>
