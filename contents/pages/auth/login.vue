<template>
  <UContainer class="flex flex-col items-center justify-center">
    <UCard class="max-w-sm w-full my-10 bg-white/75 dark:bg-white/5 backdrop-blur">
      <UAuthForm
        :fields="fields"
        :schema="schema"
        :state="state"
        title="ログイン"
        align="top"
        icon="i-heroicons-user-circle"
        :ui="{ base: 'text-center', footer: 'text-center',default: {submitButton: {label: 'ログイン'}} }"
        @submit="onSubmit"
        action=""
      >
        <template #description>
          アカウントをお持ちですか？<br /> <ElTextLink to="/auth/mail_regist">新規登録はこちら</ElTextLink>
        </template>
        <template #password-hint>
          <ElTextLink to="/auth/forget_password">パスワードをお忘れですか？</ElTextLink>
        </template>
        <template #footer>
          サービスのご利用の前に<ElTextLink to="/policy/terms" target="_blank">利用規約<UIcon name="i-heroicons-arrow-up-right" /></ElTextLink>をお読みください
        </template>
      </UAuthForm>
    </UCard>
    <!--
    <div class="flex items-center">
      <UIcon name="i-heroicons-building-office-2" class="w-6 h-6 mr-1" /><ElTextLink :to=managementToolsUrl target="_blank">企業ログインはこちら<UIcon name="i-heroicons-arrow-up-right" /></ElTextLink>
    </div>
    -->
    <UModal v-model="isOpenFailLoginModal">
      <UCard>
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="secondary"
          :description= errorMessage
          :ui="{
            description: 'text-secondary-500'
          }"
        />
        <template #footer>
          <div class="flex items-center justify-center">
            <UButton @click="isOpenFailLoginModal = false">CLOSE</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UContainer>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { paths } from "@/types/api/auth";

definePageMeta({
  layout: 'auth',
  noAuthRequired: true
})

type RequestBody =
  paths["/auth/mail-login"]["post"]["requestBody"]["content"]["application/json"];
type ResponseSuccess =
  paths["/auth/mail-login"]["post"]["responses"][200]["content"]["application/json"];

const schema = object({
  mailAddress: string().email("正しいメールアドレスではありません").required("メールアドレスは入力必須です"),
  password: string().min(8, "パスワードは8文字以上です").max(72, "パスワードは72文字以内です").required("パスワードは入力必須です"),
});

const state = reactive<RequestBody>({
  mailAddress: "",
  password: "",
});

const managementToolsUrl = ref(useRuntimeConfig().public.managementToolsUrl as string);

const isOpenFailLoginModal = ref(false);
const errorMessage = ref("");

const authEndpoint = useAuthApiEndpoint();

const  fields = [{
  name: 'mailAddress',
  type: 'text',
  label: 'メールアドレス',
  icon: 'i-heroicons-envelope',
  placeholder: 'mail@example.com',
}, {
  name: 'password',
  label: 'パスワード',
  type: 'password',
  icon: 'i-heroicons-key',
  placeholder: '8~72文字で入力してください'
}]

const onSubmit = async (data: any) => {
  const url = authEndpoint.value.endpoint + "/v1/auth/mail-login"; // TODO: 外に出す
  const requestHeaders = useSetCallApiHeader();
  const requestBody: RequestBody = {
    mailAddress: data.mailAddress,
    password: data.password,
  }
  const response = await useCallApi<ResponseSuccess>(url, {
    method: "post",
    headers: requestHeaders,
    body: requestBody,
  }, true);

  const body = response.data.value;
  if (response.error.value || !body) {
    if (response.error.value?.status === 401) {
      errorMessage.value = "メールアドレスかパスワードが違います";
      isOpenFailLoginModal.value = true;
    }
    else {
      errorMessage.value = "ログインに失敗しました";
    }
    return;
  }

  const successResponseBody: ResponseSuccess = body;

  const accessTokenCookie = useCookie<string | null>("RL_ACT", {
    expires: new Date(successResponseBody.accessTokenExpireAt * 1000),
  });
  accessTokenCookie.value = successResponseBody.accessToken;

  const refreshTokenCookie = useCookie<string | null>("RL_RFT", {
    expires: new Date(successResponseBody.refreshTokenExpireAt * 1000),
  });
  refreshTokenCookie.value = successResponseBody.refreshToken;

  const { setUserId, setNickName, setMailAddress, setIconUrl, setUserLevel } = useUserInfo();
  setUserId(successResponseBody.userId);
  setNickName(successResponseBody.nickname);
  setMailAddress(successResponseBody.mailAddress);
  setIconUrl(useStaticCdnUrl(successResponseBody.userIconPath).staticCdnUrl.value);
  setUserLevel(successResponseBody.level);

  await navigateTo("/home");
}
</script>
