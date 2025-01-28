<template>
  <UContainer class="flex items-center justify-center">
    <UCard class="max-w-sm w-full my-10 bg-white/75 dark:bg-white/5 backdrop-blur" v-if="isValidToken">
      <UAuthForm
        :fields="fields"
        :schema="schema"
        :validate="validate"
        title="ユーザー登録"
        align="top"
        icon="i-heroicons-pencil-square"
        :ui="{ base: 'text-center', footer: 'text-center',default: {submitButton: {label: '登録'}} }"
        @submit="onSubmit"
        @paste.prevent
      >
        <template #footer>
          サービスのご利用の前に<br /><ElTextLink to="/policy/terms" target="_blank">利用規約<UIcon name="i-heroicons-arrow-up-right" /></ElTextLink>および<ElTextLink to="/policy/privacy" target="_blank">プライバシーポリシー<UIcon name="i-heroicons-arrow-up-right" /></ElTextLink>をお読みください
        </template>
      </UAuthForm>
    </UCard>
  </UContainer>

  <ClientOnly>
    <UModal
      v-model="isWelcome"
      prevent-close
      fullscreen
      :ui="{ fullscreen: 'h-full min-h-screen' }"
    >
      <Confetti :size="2"/>
      <UContainer>
        <ULandingSection
          headline="ユーザー登録完了"
          title="ようこそ"
          description="この度はご登録いただきまして誠にありがとうございます。"
          :links="[{
            label: 'ログイン',
            color: 'primary',
            trailingIcon: 'i-heroicons-arrow-right-end-on-rectangle',
            size: 'xl',
            to: '/auth/login'
          }]"
          :ui="{
            wrapper:'sm:py-16'
          }"
          :features="features.slice(1)"
          align="center"
          data-aos="zoom-in"
          data-aos-delay="1000"
          data-aos-duration="2000"
        >
        </ULandingSection>
      </UContainer>
    </UModal>
  </ClientOnly>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { FormError } from "#ui/types";
import type { paths } from "@/types/api/auth";

definePageMeta({
  layout: 'auth',
  noAuthRequired: true
})

const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
const isReady = ref(false);
const features = ref<{ name: string }[]>([]);
const randomFeatures = ref<{ name: string}[]>([]);

onMounted(() => {

  if (page.value) {
    const featuresData = page.value.features?.items;
    console.log('featuresData:', featuresData);

    if (Array.isArray(featuresData)) {
      features.value = featuresData.map((item: any) => ({
        name: item.title || '',
        description: item.description.replace(/<br>/,"") || ''
      }));

      randomFeatures.value = features.value.sort(() => 0.5 - Math.random()).slice(0, 2);

      isReady.value = true;
    } else {
      console.error('');
    }
  } else {
    console.error('');
  }
});


const schema = object({
  password: string().min(8, "パスワードは8文字以上です").max(72, "パスワードは72文字以内です").required("パスワードは入力必須です"),
  confirmPassword: string().min(8, "パスワードは8文字以上です").max(72, "パスワードは72文字以内です").required("パスワードは入力必須です"),
  nickname: string().max(32, "ニックネームは32文字以内です").required("ニックネームは入力必須です"),
});
const validate = (state: any) => {
  const errors: FormError[] = [];
  if(state.password && state.confirmPassword && state.password != state.confirmPassword) {
    errors.push({ path: 'confirmPassword', message: 'パスワードが一致していません' });
  }
  if(!state.agreeTermsCheckbox) {
    errors.push({ path: 'agreeTermsCheckbox', message: '利用規約への同意は必須です' });
  }
  if(!state.agreePrivacyCheckbox) {
    errors.push({ path: 'agreePrivacyCheckbox', message: 'プライバシーポリシーへの同意は必須です' });
  }
  return errors;
}

const route = useRoute();
const registToken = route.params.token as string;

const authEndpoint = useAuthApiEndpoint();
const commonAlert = useCommonAlert();

const isValidToken = ref(false);
const isFinishedToken = ref(false);

type GetTokenResponse = paths["/auth/mail-login/regist/{token}"]["get"]["responses"]["200"]["content"]["application/json"];
const requestHeaders = useSetCallApiHeader();
const { data: apiResponse } = await useCallApi<GetTokenResponse>(authEndpoint.value.endpoint + "/v1/auth/mail-login/regist/" + registToken, {
  method: "get",
  headers: requestHeaders,
});

if (apiResponse.value) {
  isValidToken.value = apiResponse.value.isValid;
  isFinishedToken.value = apiResponse.value.isFinish;
}
onMounted(() => {
  if (!isValidToken.value) {
    commonAlert.showWarn(
      "有効期限が切れています。大変おそれ入りますが、もう一度はじめからやり直してください。",
      "/auth/mail_regist");
  }
});

const showWelcome = () => {
  isFinishedToken.value = true;
};
const isWelcome = computed(() => isValidToken.value && isFinishedToken.value);

const onSubmit = async (data: any) => {
  console.log(data)
  if (!data.agreeTermsCheckbox || !data.agreePrivacyCheckbox) {
    return;
  }

  const url = authEndpoint.value.endpoint + "/v1/auth/mail-login/regist/" + registToken;
  const requestHeaders = useSetCallApiHeader();
  const response = await useCallApi(url, {
    method: "post",
    headers: requestHeaders,
    body: {
      password: data.password,
      nickname: data.nickname,
      agreeTerm: data.agreeTermsCheckbox,
      agreePrivacy: data.agreePrivacyCheckbox,
    },
  });

  const body = response.data.value;
  if (response.error.value || !body) {
    commonAlert.showWarn("登録に失敗しました。");
    return;
  }

  showWelcome();
};


const  fields = [{
  name: 'nickname',
  type: 'text',
  label: 'ニックネーム',
  icon: 'i-heroicons-face-smile',
  placeholder: '32文字以内で入力してください',
}, {
  name: 'password',
  label: 'パスワード',
  type: 'password',
  icon: 'i-heroicons-key',
  placeholder: '8~72文字で入力してください',
}, {
  name: 'confirmPassword',
  label: 'パスワード再入力',
  type: 'password',
  icon: 'i-heroicons-key',
  placeholder: '8~72文字で入力してください',
}, {
  name: 'agreeTermsCheckbox',
  label: '利用規約に同意する',
  type: 'checkbox'
}, {
  name: 'agreePrivacyCheckbox',
  label: 'プライバシーポリシーに同意する',
  type: 'checkbox'
}]
</script>
