<template>
  <UContainer class="flex items-center justify-center flex-col">
    <logo />
    <UCard class="max-w-sm w-full my-10">
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
      </UAuthForm>
    </UCard>

    <UModal v-model="isOpenFailLoginModal">
      <UCard>
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="red"
          variant="subtle"
          :description= errorMessage
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
// ランディングページ用専用layout読み込み
definePageMeta({
  layout: 'landing',
});

const links = [
  {
    label: "TOP",
    to: "/",
  },
  {
    label: "ログイン",
  },
];

import { FetchError } from "ofetch";
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import type {
    paths,
    components,
} from "@/types/api/auth";
import { storeToRefs } from "pinia";
import { useAuthApiEndpoint } from "~/composables/api";

type RequestBody =
  paths["/admin/auth/mail-login"]["post"]["requestBody"]["content"]["application/json"];
type ResponseSuccess =
  paths["/admin/auth/mail-login"]["post"]["responses"][200]["content"]["application/json"];

const schema = object({
  mailAddress: string().email("正しいメールアドレスではありません").required("メールアドレスは入力必須です"),
  password: string().min(8, "パスワードは8文字以上です").max(72, "パスワードは72文字以内です").required("パスワードは入力必須です"),
  cpcode: string().min(12, "CPコードは12文字です").max(12, "CPコードは12文字です"),
});
type Schema = InferType<typeof schema>;

const state = reactive<RequestBody>({
  mailAddress: "",
  password: "",
  cpcode: "",
});

const isOpenFailLoginModal = ref(false);
const errorMessage = ref("");

const authEndpoint = useAuthApiEndpoint();

const  fields = [
  {
    name: 'mailAddress',
    type: 'text',
    label: 'メールアドレス',
    icon: 'i-heroicons-envelope',
    placeholder: 'mail@example.com',
  },
  {
    name: 'password',
    label: 'パスワード',
    type: 'password',
    icon: 'i-heroicons-key',
    placeholder: '8~72文字で入力してください'
  },
  {
    name: 'cpcode',
    label: 'CPコード',
    type: 'cpcode',
    placeholder: 'CP0123456789',
  },
];

const onSubmit = async (data: any) => {
  const url = authEndpoint.value.endpoint + "/v1/admin/auth/mail-login"; // TODO: 外に出す
  const requestHeaders = useSetCallApiHeader();
  const requestBody: RequestBody = {
    mailAddress: data.mailAddress,
    password: data.password,
    cpcode: data.cpcode,
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
    else if (response.error.value?.status === 403) {
      errorMessage.value = "アクセス権限がありません";
      isOpenFailLoginModal.value = true;
    }
    else {
      errorMessage.value = "ログインに失敗しました";
    }
    return;
  }

  const successResponseBody: ResponseSuccess = body;

  const accessTokenCookie = useCookie<string | null>("RL_M_ACT", {
    expires: new Date(successResponseBody.accessTokenExpireAt * 1000),
  });
  accessTokenCookie.value = successResponseBody.accessToken;

  const refreshTokenCookie = useCookie<string | null>("RL_M_RFT", {
    expires: new Date(successResponseBody.refreshTokenExpireAt * 1000),
  });
  refreshTokenCookie.value = successResponseBody.refreshToken;

  const userStore = useUserStore();
  const { isLogin } = storeToRefs(userStore);
  isLogin.value = true;

  const { setUserId, setNickName, setMailAddress } = useUserInfo();
  setUserId(successResponseBody.userId);
  setNickName(successResponseBody.nickname);
  setMailAddress(successResponseBody.mailAddress);

  const { setRole } = useUserRoleStore();
  const role = successResponseBody.role as UserRoleType;
  setRole(role);
  if (role === "admin") {
    await navigateTo({
      name: "admin",
    });
  }
  else {
    await navigateTo({
      name: "recruit_company",
    });
  }
}
</script>
