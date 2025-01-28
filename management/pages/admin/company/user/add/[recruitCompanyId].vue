<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="求人企業ユーザー　新規追加" />
    <UDashboardPanelContent>
    <UForm :schema="schema" :state="state" @submit="onSubmit" @error="onError">
      <UDashboardSection
        description="すべての項目が入力必須です"
      >
      <UFormGroup label="メールアドレス" name="mailAddress" description="登録するメールアドレス" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
        <UInput v-model="state.mailAddress" type="email" placeholder="（例）user@example.com" />
      </UFormGroup>
      </UDashboardSection>
      <SubmitButton label="この内容で求人企業ユーザーを新規追加する" size="xl" />
    </UForm>
    </UDashboardPanelContent>

    <UModal v-model="isOpenComfirmModal">
      <div class="p-4">
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="green"
          variant="outline"
          title="この内容でユーザーを新規追加しますか?"
        />
      </div>
      <div class="p-4">
        <div class="font-bold">新規追加ユーザー</div>
        <UCard>
          <div class="grid grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto">
            <div class="font-bold">メールアドレス</div>
            <div class="col-span-3">{{ state.mailAddress }}</div>
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

const route = useRoute();
  const recruitCompanyId = route.params.recruitCompanyId as string;

definePageMeta({
  middleware: ["admin-only"], // 管理者しか見れないページ
});

const state = reactive({
  mailAddress: "",
});

import { number, object, string } from 'yup'

const schema = object({
  mailAddress: string()
    .required("メールアドレスは必須です")
    .email("メールアドレスではない文字列です"),
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

  type RequestPostRecruitCompanyUser =
    paths["/recruit-company/user/{recruitCompanyId}"]["post"]["requestBody"]["content"]["application/json"];
  const requestBody: RequestPostRecruitCompanyUser = {
    mailAddress: state.mailAddress,
  };

  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/recruit-company/user/" + recruitCompanyId,
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
      "/admin/company/user/" + recruitCompanyId,
    );
  }
}
</script>
