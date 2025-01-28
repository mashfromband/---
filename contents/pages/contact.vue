<template>
  <BreadcrumbLinks v-bind:links="links" />
  <UContainer
    :ui="{
      padding: 'px-0 sm:px-0'
    }"
  >
    <UPageGrid
      :ui="{
        wrapper:'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 xl:grid-cols-5'
      }"
    >
      <!--中央カラム-->
      <div class="flex flex-col col-span-full lg:col-span-4">
        <PageheaderGeneral title="お問い合わせ" />
        <div class="p-6 bg-gray-50 dark:bg-gray-800/50">
          <UCard>
            <div class="flex justify-center">
              <div class="max-w-screen-sm w-full py-3">
                <UForm
                  :state="state"
                  :schema="schema"
                  @submit="onSubmit"
                  @error="onError"
                >
                  <UFormGroup
                    name="mailAddress"
                    label="メールアドレス"
                    required
                    class="grid gap-2 mb-6"
                    :ui="{ container: '' }"
                  >
                    <UInput
                      v-model="state.mailAddress"
                      autocomplete="off"
                      size="md"
                    />
                  </UFormGroup>
                  <UFormGroup
                    name="nickname"
                    label="ニックネーム"
                    class="grid gap-2 mb-6"
                    :ui="{ container: '' }"
                  >
                    <UInput
                      v-model="state.nickname"
                      autocomplete="off"
                      size="md"
                    />
                  </UFormGroup>
                  <UFormGroup
                    name="subject"
                    label="件名"
                    required
                    class="grid gap-2 mb-6"
                    :ui="{ container: '' }"
                  >
                    <UInput
                      v-model="state.subject"
                      autocomplete="off"
                      size="md"
                    />
                  </UFormGroup>
                  <UFormGroup
                    name="body"
                    label="質問・要望"
                    required
                    class="grid gap-2 mb-6"
                    :ui="{ container: '' }"
                  >
                    <UTextarea
                      v-model="state.body"
                      :rows="5"
                      size="md"
                    />
                  </UFormGroup>
                  <div class="mt-8">
                    <SubmitButton label="送信する" size="xl" block/>
                  </div>
                </UForm>
              </div>
            </div>
          </UCard>
        </div>
        <div class="hidden lg:flex justify-center">
          <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/d2a0c13c364f0b6cb03808491af06e9d" />
        </div>
      </div>

      <!--右カラム-->
      <div class="flex flex-col col-span-full lg:col-start-5 gap-12">
        <!--広告-->
        <div class="hidden lg:flex justify-center">
          <AdNinja sizeType="160x600" adScriptUrl="https://adm.shinobi.jp/s/5498aaa14e05b5b551c6c3bb0831dc14" />
        </div>
        <div class="lg:hidden flex justify-center">
          <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/8fc25152826f75cc801d3081ea29aa88" />
        </div>
      </div>

    </UPageGrid>
  </UContainer>
</template>

<script setup lang="ts">
import type { paths } from "@/types/api/contents";
import * as yup from "yup";

definePageMeta({
  noAuthRequired: true
});

const state = reactive({
  mailAddress: "",
  nickname: "",
  subject: "",
  body: "",
});
{
  // ログインしていたら、ニックネームとメールアドレスが、それぞれフォームに入力してある状態にする
  const { nickName, mailAddress } = useUserInfo();
  if (nickName) {
    state.nickname = nickName;
  }
  if (mailAddress) {
    state.mailAddress = mailAddress;
  }
}

const schema = (() => {
  const { object, string } = yup;
  return object({
    mailAddress: string()
      .required("メールアドレスの入力は必須です")
      .max(255, "メールアドレスは255文字以内です")
      .email("正しいメールアドレスではありません"),

    nickname: string()
      .max(32, "ニックネームは32文字以内です"),

    subject: string()
      .required("件名の入力は必須です")
      .max(50, "件名は50文字以内です"),

    body: string()
      .required("質問・要望の入力は必須です")
      .max(2000, "質問・要望は2000文字以内です"),
  });
})();

const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();

const onError = () => {
  commonAlert.showWarn("入力項目に不備があります。");
};

const onSubmit = async () => {
  type ApiRequest = paths["/contact"]["post"]["requestBody"]["content"]["application/json"];
  const requestBody: ApiRequest = { ...state };
  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/contact",
    {
      method: "post",
      body: requestBody,
    });
  if (error.value) {
    commonAlert.showWarn("送信に失敗しました。");
    return;
  }

  commonAlert.showSuccess(
    "お問い合わせを送信しました。",
    "/",
  );
};

const links = [
  {
    icon: "i-heroicons-home-20-solid",
    to: "/home",
  },
  {
    label: "お問い合わせ",
  },
];
</script>
