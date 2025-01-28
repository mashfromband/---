<template>
  <UContainer class="flex items-center justify-center">
    <UModal v-model="isOpenDoneModal">
      <UCard>
        <UAlert
          description= "登録メールを送信しました。"
          :ui="{

              description: 'text-gray-900'
          }"
        />
        <div><NuxtLink :to="registUrl">{{ registUrl }}</NuxtLink></div>
        <div>確認メールをお送りしました。<br />メール内のリンクをクリックして、登録手続きを完了してください。</div>
        <template #footer>
          <div class="flex items-center justify-center">
            <UButton @click="isOpenDoneModal = false">CLOSE</UButton>
          </div>
        </template>
      </UCard>
    </UModal>


    <UCard class="max-w-sm w-full my-10 bg-white/75 dark:bg-white/5 backdrop-blur">
      <UAuthForm
        :fields="fields"
        :schema="schema"
        :state="state"
        title="新規会員登録"
        align="top"
        icon="i-heroicons-user-plus"
        :ui="{ base: 'text-center', footer: 'text-center',default: {submitButton: {label: '送信'}} }"
        @submit="onSubmit"
      >
        <template #description>
          すでにアカウントをお持ちなら<br /><ElTextLink to="/auth/login">ログインはこちら</ElTextLink>
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
  layout: 'auth',
  noAuthRequired: true
});

import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

const commonAlert = useCommonAlert();
const schema = object({
  mailAddress: string().email("正しいメールアドレスではありません").required("メールアドレスは入力必須です"),
});
type Schema = InferType<typeof schema>;

const state = reactive({
  mailAddress: undefined,
});


const isOpenDoneModal = ref(false);

const registUrl = ref("");

const authEndpoint = useAuthApiEndpoint();

const onSubmit = async (data: any) => {
  console.log(data)
  const url = authEndpoint.value.endpoint + "/v1/auth/mail-login/temp-regist"; // TODO: 外に出す
  const mailAddress = data.mailAddress;
  const requestHeaders = useSetCallApiHeader();
  const response = await useCallApi(url, {
    method: "post",
    headers: requestHeaders,
    body: {
      mailAddress: mailAddress,
    },
  });

  const body = response.data.value;
  if (response.error.value || !body) {
    if(response.error.value?.statusCode === 409) {
      commonAlert.showWarn("ご登録手続きを完了できませんでした。サポートが必要な場合はお問い合わせください。");
      return;
    }

    console.error(response.error.value);
    // TODO: エラー処理
    return;
  }

  console.log(body)
  // @ts-ignore
  registUrl.value = body.registUrl;

  isOpenDoneModal.value = true;

}




const  fields = [{
  name: 'mailAddress',
  type: 'text',
  label: 'メールアドレス',
  icon: 'i-heroicons-envelope',
  placeholder: 'mail@example.com'
}]


</script>
