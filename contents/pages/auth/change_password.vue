<template>
  <UContainer class="flex items-center justify-center">
    <UCard class="max-w-sm w-full my-10 bg-white/75 dark:bg-white/5 backdrop-blur">
      <UAuthForm
        :fields="fields"
        :schema="schema"
        :state="state"
        title="パスワード変更"
        align="top"
        icon="i-heroicons-lock-closed"
        :ui="{ base: 'text-center', footer: 'text-center',default: {submitButton: {label: '変更'}} }"
        @submit="onSubmit"
        @paste.prevent
        action=""
      >
        <template #password-hint>
          <ElTextLink to="/auth/forget_password">パスワードをお忘れですか？</ElTextLink>
        </template>
        <template #footer>
          サービスのご利用の前に<ElTextLink to="/policy/terms" target="_blank">利用規約<UIcon name="i-heroicons-arrow-up-right" /></ElTextLink>をお読みください
        </template>
      </UAuthForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

import type {
    paths,
    components,
} from "@/types/api/auth";

type RequestBody =
  paths["/auth/mail-login/password"]["put"]["requestBody"]["content"]["application/json"];

const state = reactive<RequestBody>({
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});


const  fields = [{
  name: 'currentPassword',
  label: '現在のパスワード',
  type: 'password',
  icon: 'i-heroicons-key',
  placeholder: '8~72文字で入力してください'
}, {
  name: 'newPassword',
  label: '新しいパスワード',
  type: 'password',
  icon: 'i-heroicons-key',
  placeholder: '8~72文字で入力してください'
}, {
  name: 'confirmNewPassword',
  label: '新しいパスワード再入力',
  type: 'password',
  icon: 'i-heroicons-key',
  placeholder: '8~72文字で入力してください'

}]

import { object, string, type InferType } from "yup";

const commonAlert = useCommonAlert();
const schema = object({
  currentPassword: string().min(8, "パスワードは8文字以上です").max(72, "パスワードは72文字以内です").required("現在のパスワードは入力必須です"),
  newPassword: string().min(8, "パスワードは8文字以上です").max(72, "パスワードは72文字以内です").required("新しいパスワードは入力必須です"),
  confirmNewPassword: string().min(8, "パスワードは8文字以上です").max(72, "パスワードは72文字以内です").required("新しいパスワードは入力必須です"),
});
type Schema = InferType<typeof schema>;

const authEndpoint = useAuthApiEndpoint();

const onSubmit = async (data: any) => {
  if (state.newPassword !== state.confirmNewPassword) {
    return;
  }

  const url = authEndpoint.value.endpoint + "/v1/auth/mail-login/password"; // TODO: 外に出す
  const requestBody: RequestBody = {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
    confirmNewPassword: data.confirmNewPassword,
  };
  const response = await useCallApi(url, {
    method: "put",
    body: requestBody,
    unuseReloadAccessToken: true,
  });

  if (response.error.value) {
    if (response.error.value.status === 401) {
      commonAlert.showWarn("パスワードが違います。");
    }
    else {
      commonAlert.showWarn("エラーが発生しました。");
    }
    return;
  }

  commonAlert.showSuccess(
    "パスワード変更に成功しました。",
    "/home"
  );
}
</script>
