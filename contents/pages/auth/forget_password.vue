<template>
  <UContainer class="flex items-center justify-center">
    <UCard class="max-w-sm w-full my-10 bg-white/75 dark:bg-white/5 backdrop-blur">
      <UAuthForm
        :fields="fields"
        :schema="schema"
        :state="state"
        title="パスワード再設定"
        align="top"
        icon="i-heroicons-lock-closed"
        :ui="{ base: 'text-center', footer: 'text-center',default: {submitButton: {label: '送信'}} }"
        @submit="onSubmit"
      >
        <template #description>
          ご登録のメールアドレスを入力してください。
        </template>
        <template #footer>
          サービスのご利用の前に<ElTextLink to="/policy/terms" target="_blank">利用規約<UIcon name="i-heroicons-arrow-up-right" /></ElTextLink>をお読みください
        </template>
      </UAuthForm>
    </UCard>

  </UContainer>

  <UModal v-model="isOpenDoneModal">
      <UCard>
        <UAlert
          icon="i-heroicons-information-circle"
          description= "パスワードリセットメールを送信しました。"
        />
        <div v-if="resetPasswordUrl"><NuxtLink :to="resetPasswordUrl">{{ resetPasswordUrl }}</NuxtLink></div>
        <div>パスワードリセット用のメールをお送りしました。<br />メール内のリンクをクリックして、パスワードを再設定してください。</div>
        <template #footer>
          <div class="flex items-center justify-center">
            <UButton @click="isOpenDoneModal = false">CLOSE</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { paths } from "@/types/api/auth";

definePageMeta({
  layout: 'auth',
  noAuthRequired: true
})


const  fields = [{
  name: 'mailAddress',
  type: 'text',
  label: 'メールアドレス',
  icon: 'i-heroicons-envelope',
  placeholder: 'mail@example.com'
}];

type RequestBody =
  paths["/auth/mail-login/forget-password-url"]["post"]["requestBody"]["content"]["application/json"];
type ResponseSuccess =
  paths["/auth/mail-login/forget-password-url"]["post"]["responses"][200]["content"]["application/json"];

const state = reactive<RequestBody>({
  mailAddress: "",
});
const isOpenDoneModal = ref(false);
const resetPasswordUrl = ref("");

const schema = object({
  mailAddress: string().email("正しいメールアドレスではありません").required("メールアドレスは入力必須です"),
});

const commonAlert = useCommonAlert();
const authEndpoint = useAuthApiEndpoint();

const onSubmit = async (data: any) => {
  const url = authEndpoint.value.endpoint + "/v1/auth/mail-login/forget-password-url"; // TODO: 外に出す
  const requestBody: RequestBody = {
    mailAddress: data.mailAddress,
  };
  const response = await useCallApi<ResponseSuccess>(url, {
    method: "post",
    body: requestBody,
  }, true);

  const body = response.data.value;
  if (response.error.value || !body) {
    if (response.error.value?.status === 400) {
      commonAlert.showWarn("メールアドレスが正しい形式ではありません。");
    }
    else if (response.error.value?.status === 404) {
      commonAlert.showWarn("登録されていないメールアドレスです。");
    }
    else {
      commonAlert.showWarn("エラーが発生しました。");
    }
    return;
  }

  const successResponseBody: ResponseSuccess = body;
  resetPasswordUrl.value = successResponseBody.url;
  isOpenDoneModal.value = true;
}
</script>
