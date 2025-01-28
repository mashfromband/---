<template>
  <div class="flex col-span-2 w-full justify-center z-10">
  </div>
  <UPageCard
    class="overflow-hidden col-span-2"
    :ui="{
      header: { base:'', background:'', padding:'px-0 py-0 sm:px-0'},
      footer: { base:'', background:'', padding:'px-0 py-0 sm:px-0'}
    }"
  >
    <template #header>
      <div class="bg-primary-500 p-3 lg:p-4">
      </div>
    </template>
    <div class="inline-flex items-center gap-3 min-w-0">
      <UIcon name="i-heroicons-cog-8-tooth" class="w-10 h-10"/>
      <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">アカウント設定</span>
    </div>
    <div class=" bg-gray-50 dark:bg-gray-800/50 p-4">
      <ClientOnly>
        <div v-if="!nickName" class="flex items-center">
          <UAvatar :ui="{ rounded: 'rounded' }" size="3xl" class="mr-4"/>
          <div class="flex-none">
            <span>読み込み中...</span>
          </div>
        </div>
        <div v-else class="flex items-center text-lg lg:text-2xl">
          <UAvatar
            :src="iconUrl"
            :alt="nickName"
            :ui="{ rounded: 'rounded' }"
            size="3xl"
            class="mr-4"
          />
          <div class="flex-none mr-4">
            Lv.<span class="text-el_orange-500 text-3xl lg:text-6xl font-bold">{{getLevel()}}</span>
          </div>
          <div class="break-all">
            <span>{{ nickName }}</span>
          </div>
        </div>
      </ClientOnly>
    </div>
    <UDivider type="dashed" class="h-6" />
    <div class=" bg-gray-50 dark:bg-gray-800/50 p-4 grid grid-col-1 gap-6">
      <UAccordion
        :items="[{label:'ログインとセキュリティ', color:'black', slot:'contact', icon:'i-heroicons-lock-closed'}]"
        :ui="{ container: 'bg-white dark:bg-gray-800 rounded-md',default:{class: 'm-2 dark:text-white'}}"
      >
        <template #contact>
          <div class="flex justify-between border-t p-4">
              <div class="flex-none mr-4">メールアドレス</div>
              <ClientOnly>
                <template #fallback>
                  <div>
                    <span>読み込み中...</span>
                  </div>
                </template>
                <div class="break-all">{{ mailAddress }}</div>
              </ClientOnly>
          </div>
          <div class="flex justify-between border-t p-4">
            <div class="flex-none mr-4">パスワード</div><div class="break-all"><span class="tracking-widest">＊＊＊＊＊＊＊＊</span></div>
          </div>
          <ElTextLink to="/auth/change_password">
            <div class="flex justify-end items-center mt-4">
              <span>パスワード変更</span>
              <UIcon name="i-heroicons-chevron-right" class="ml-4 w-6 h-6"/>
            </div>
          </ElTextLink>
        </template>
      </UAccordion>
      <UAccordion
        :items="[{label:'公開設定', color:'black', slot:'agreement', icon:'i-heroicons-eye'}]"
        :ui="{ container: 'bg-white dark:bg-gray-800 rounded-md',default:{class: 'm-2 dark:text-white'}}"
      >
        <template #agreement>
          <div class="flex justify-between border-t p-4">
            <div class="flex-none mr-4">プロフィールを企業に公開する</div>
            <UToggle size="md" v-model="openForRecruitCompany" :disabled="uiDisabled" />
          </div>
        </template>
      </UAccordion>
      <UAccordion
        :items="[{label:'その他', color:'black', slot:'etc', icon:'i-heroicons-cog-8-tooth'}]"
        :ui="{ container: 'bg-white dark:bg-gray-800 rounded-md',default:{class: 'm-2 dark:text-white'}}"
      >
        <template #etc>
          <NuxtLink to="/home/settings/confirmation_register">
          <div class="flex justify-between border-t p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
            <div class="flex-none mr-4">退会のお手続き</div>
            <div>
              <UIcon name="i-heroicons-chevron-right" class="ml-4 w-6 h-6"/>
            </div>
          </div>
          </NuxtLink>
        </template>
      </UAccordion>
    </div>
  </UPageCard>
<div class="mt-4 lg:hidden">
  <UButton to="/home/" label="ホームに戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
</div>
</template>


<script setup lang="ts">
import type { paths } from "@/types/api/contents";

definePageMeta({
  layout: 'settings',
});

const { nickName, mailAddress, iconUrl, userLevel } = storeToRefs(useUserInfo());
const getLevel = () => {
if(!userLevel.value || userLevel.value == 0) {
  return "";
}
return `${userLevel.value}`;
}

const links: BreadcrumbLinkItem[] = [
{
to: "/home",
icon: "i-heroicons-home-20-solid",
},
{
label: "アカウント設定",
},
];

const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);
onMounted(() => {
breadcrumblinks.value = [...links];
});


const uiDisabled = ref(false);
const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();

type GetPermissionResponse = paths["/user/me/profile/permission"]["get"]["responses"]["200"]["content"]["application/json"];
const { data: userPermissions } = await useCallApi<GetPermissionResponse>(
  apiEndpoint.value.endpoint + "/v1/user/me/profile/permission",
  { method: "get" },
);

const openForRecruitCompany = computed({
  get: () => !!userPermissions.value?.openForRecruitCompany,
  set: async newValue => {
    uiDisabled.value = true;
    try {
      type ApiRequest = paths["/user/me/profile/permission"]["put"]["requestBody"]["content"]["application/json"];
      const requestBody: ApiRequest = {
        openForRecruitCompany: newValue,
      };
      const { error } = await useCallApi(
        apiEndpoint.value.endpoint + "/v1/user/me/profile/permission",
        {
          method: "put",
          body: requestBody,
        },
      );
      if (error.value) {
        commonAlert.showWarn("設定の変更に失敗しました。");
        return;
      }
    } finally {
      uiDisabled.value = false;
    }

    commonAlert.showSuccess("設定を変更しました。");
    userPermissions.value = {
      ...userPermissions.value,
      openForRecruitCompany: newValue,
    };
  },
});
</script>
