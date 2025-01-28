<template>
    <UContainer class="flex items-center justify-center">
    <UCard class="max-w-sm w-full my-10 bg-white/75 dark:bg-white/5 backdrop-blur">
      <UAuthForm
        :fields="fields"
        :schema="schema"
        title="パスワード再設定"
        align="top"
        icon="i-heroicons-lock-closed"
        :ui="{ base: 'text-center', footer: 'text-center',default: {submitButton: {label: '再設定'}} }"
        @submit="onSubmit"
        @paste.prevent
      >
        <template #footer>
          サービスのご利用の前に<br /><ElTextLink to="/policy/terms" target="_blank">利用規約<UIcon name="i-heroicons-arrow-up-right" /></ElTextLink>および<ElTextLink to="/policy/privacy" target="_blank">プライバシーポリシー<UIcon name="i-heroicons-arrow-up-right" /></ElTextLink>をお読みください
        </template>
      </UAuthForm>
    </UCard>

  </UContainer>
</template>

<script setup lang="ts">
import * as yup from "yup";
import type { paths } from "@/types/api/auth";

definePageMeta({
  layout: 'auth',
  noAuthRequired: true
})

const  fields = [{
  name: 'password',
  label: '新しいパスワード',
  type: 'password',
  icon: 'i-heroicons-key',
  placeholder: '8~72文字で入力してください',
}, {
  name: 'confirmPassword',
  label: 'パスワード再入力',
  type: 'password',
  icon: 'i-heroicons-key',
  placeholder: '8~72文字で入力してください',
}]

const schema = yup.object({
  password: yup.string()
    .required("パスワードは入力必須です")
    .min(8, "パスワードは8文字以上です")
    .max(72, "パスワードは72文字以内です"),
  confirmPassword: yup.string()
    .required("パスワードは入力必須です")
    .min(8, "パスワードは8文字以上です")
    .max(72, "パスワードは72文字以内です")
    .test({
      name: "is-same-as-password",
      test: (value, ctx) => value === ctx.parent.password,
      message: "パスワードが一致していません",
    }),
});

interface FormState {
  password: string;
  confirmPassword: string;
}

const route = useRoute();
const resetToken = route.params.token as string;
const authEndpoint = useAuthApiEndpoint();
const commonAlert = useCommonAlert();

const onSubmit = async (state: FormState) => {
  type ApiRequest = NonNullable<paths["/auth/mail-login/reset-password"]["post"]["requestBody"]>["content"]["application/json"];
  const url = authEndpoint.value.endpoint + "/v1/auth/mail-login/reset-password";
  const requestBody: ApiRequest = {
    resetToken,
    password: state.password,
    confirmPassword: state.confirmPassword,
  };
  const { error } = await useCallApi(url, {
    method: "post",
    body: requestBody,
  }, true);

  if (error.value) {
    commonAlert.showWarn(
      "有効期限が切れています。大変おそれ入りますが、もう一度はじめからやり直してください。",
      "/auth/forget_password");
    return;
  }

  commonAlert.showSuccess(
    "パスワードを再設定しました。",
    "/auth/login");
};
</script>
