<template>
  <BreadcrumbLinks v-bind:links="links" />
  <UContainer>
  <UPage
    :ui="{
      wrapper:'lg:grid-cols-4',
      left: 'lg:col-span-1',
      center: {
        narrow: 'lg:col-span-4',
        base: 'lg:col-span-4',
        full: 'lg:col-span-4'
      }
    }"
  >
    <!-- 広告SP -->
    <div class="lg:hidden flex justify-center mt-6">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/066e1cd62fdfae8c7defa1b8d458a55a" />
    </div>
    <UPageHero
      :title=apiResponse.name
      :description=apiResponse.detail
      align="left"
      :links="[{ click: onClickStartButton, label: 'クエストに挑戦', size: 'xl', trailingIcon: 'i-heroicons-arrow-right-20-solid' }]"
    >
      <template #icon v-if="apiResponse.isClear">
        <UIcon name="i-heroicons-check-badge" class="w-6 h-6 text-green-600 dark:text-green-300" />
      </template>
    </UPageHero>
    <UPageCard>
      <div class="font-bold space-y-4">
        <!-- クエスト付帯情報 -->
        <div class="flex space-x-2">
          <UIcon name="i-heroicons-clipboard-document-check" class="w-6 h-6" />
          <span>ミッション数</span>
          <span>{{ apiResponse.missionNum }}</span>
        </div>
        <QuestTagCloud 
          :enabledTagLink="true"
          :quest-id=apiResponse.id 
          size="md"
        />
      </div>
    </UPageCard>
    <!-- 広告 -->
    <div class="hidden lg:flex justify-center mt-6">
      <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/ca35130836ecc7e3b261cd0529d3e067" />
    </div>
    <!-- 広告SP -->
    <div class="lg:hidden flex justify-center mt-6">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/d5c242acb44b9463bbff8866bd36b417" />
    </div>
  </UPage>

  <UModal v-model="isOpenMustLoginModal" prevent-close fullscreen>
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        body: {
          base: 'grow'
        }
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <span />
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click=onCloseMustLoginModal />
        </div>
      </template>
      <ULandingSection
        align="left"
        headline="会員専用クエスト"
        title="ログインしてください"
        description="このクエストに挑戦するには会員登録およびログインが必要です。"
        :links="[{
          label: '無料で新規会員登録',
          color: 'primary',
          icon: 'i-heroicons-user-plus',
          size: 'xl',
          to: '/auth/mail_regist'
        },{
          label: 'ログイン',
          color: 'gray',
          trailingIcon: 'i-heroicons-arrow-right-end-on-rectangle',
          size: 'xl',
          to: '/auth/login'
        }]"
      >
        <NuxtImg
          :src=alartImageUrl
          class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
        />
      </ULandingSection>
      <template #footer>
        <div class="flex items-center justify-center">
          <UButton v-on:click="onCloseMustLoginModal" >CLOSE</UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <UModal v-model="isOpenAdModal" prevent-close fullscreen>
    <UCard :ui="{
      base: 'h-full flex flex-col',
      body: {
        base: 'grow'
      }
    }">
      <template #header>
        <div class="flex items-center justify-between">
          広告
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click=onCloseAdModal />
        </div>
      </template>
      <div class="h-full">
        <div class="hidden lg:flex justify-center items-center">
          <AdNinja sizeType="300x250" adScriptUrl="https://adm.shinobi.jp/s/568fb516ab3f7075b5cb26d53f9e408b" />
        </div>
        <!-- 広告SP -->
        <div class="lg:hidden flex justify-center">
          <AdNinja sizeType="320x250" adScriptUrl="https://adm.shinobi.jp/s/4f8113b101463c3604d94446f37df621" />
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-center">
          <UButton v-on:click="onCloseAdModal" >CLOSE</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</UContainer>
</template>

<script setup lang="ts">
import type {
    paths,
    components,
} from "@/types/api/contents";
import { useApiEndpoint } from "~/composables/api";

definePageMeta({
  noAuthRequired: true
});


const route = useRoute();
const questId = route.params.questId;

type ResponseSuccess =
  paths["/quest/{questId}"]["get"]["responses"][200]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();

const { data: response, error } = await useCallApi(
  apiEndpoint.value.endpoint + "/v1/quest/" + questId,
  {
    method: "get",
  }
);

const apiResponse = ref<ResponseSuccess>(response.value as ResponseSuccess);

const isOpenMustLoginModal = ref(false);
const onCloseMustLoginModal = () => {
  isOpenMustLoginModal.value = false;
}
const onGotoRegist = () => {
  isOpenAdModal.value = false;
  navigateTo({ name: "auth-mail_regist"});
}
const onGotoLogin = () => {
  isOpenAdModal.value = false;
  navigateTo({ name: "auth-login" });
}

const isOpenAdModal = ref(false);
const onCloseAdModal = async () => {
  isOpenAdModal.value = false;
  await prepareStartQuest();
}

const onClickStartButton = () => {
  const { isLogin } = useUserStore();
  if (!isLogin) {
    isOpenMustLoginModal.value = true;
  }
  else {
    isOpenAdModal.value = true;
  }
}

type ResponseBody =
  paths["/quest/{questId}/session"]["post"]["responses"]["200"]["content"]["application/json"];

const prepareStartQuest = async () => {
  const url = apiEndpoint.value.endpoint + "/v1/quest/" + questId + "/session"; // TODO: 外に出す
  const requestHeaders = {
    "content-type": "application/json; charset=UTF-8",
  };
  const response = await useCallApi<ResponseBody>(url, {
    method: "post",
    headers: requestHeaders,
  });

  if (!response.data.value || response.error.value) {
    // TODO: ちゃんとする
    console.error("ERROR!");
    //console.error(response.error);
    return;
  }

  const responseBody = response.data.value;
  const token = responseBody.id;
  navigateTo({
    name: "quest-questId-mission-missionToken",
    params: {
      questId: questId,
      missionToken: token,
    }
  });
}

const questTitle = apiResponse.value.name

const links = [
  {
    icon: "i-heroicons-home-20-solid",
    to: { name: "home" },
  },
  {
    label: "クエスト",
    to: { name: "genre" },
  },
  {
    label: 'クエスト詳細：' + questTitle
  }
];

const alartImageUrl = useStaticCdnUrl("/img/logo_1_a.png").staticCdnUrl;
const bgImageUrl = useStaticCdnUrl("/img/logo_3_b.png").staticCdnUrl;

</script>
