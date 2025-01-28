
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
      <UIcon name="i-heroicons-information-circle" class="w-10 h-10"/>
      <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">退会のお手続き</span>
    </div>
    <div class=" bg-gray-50 dark:bg-gray-800/50 p-4 grid grid-col-1 gap-6">
      <div>
        このたびは、<span class="font-bold">REALIZE LEARNING - リアライズラーニング</span>をご利用いただき、誠にありがとうございました。退会後はアカウント情報や学習データ、保有EFOがすべて削除されます。削除後、データの復元はできなくなりますのでご注意ください。
      </div>
      <div class="flex justify-end items-center mt-4">
        <UButton label="退会する" @click="unregister" size="lg" color="secondary" variant="outline" />
      </div>
    </div>
  </UPageCard>
<div class="mt-4 lg:hidden">
  <UButton to="/home/settings" label="アカウント設定に戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
</div>


</template>


<script setup lang="ts">
import type { paths } from '~/types/api/auth';

const { nickName, mailAddress, iconUrl, userLevel } = storeToRefs(useUserInfo());
const getLevel = () => {
if(!userLevel.value || userLevel.value == 0) {
  return "";
}
return `${userLevel.value}`;
}

definePageMeta({
layout: 'settings'
})

const links: BreadcrumbLinkItem[] = [
{
to: "/home",
icon: "i-heroicons-home-20-solid",
},
{
to: "/home/settings",
label: "アカウント設定",
},
{
  to: "/home/settings/confirmation_register",
label: "お手続きの確認",
},
{
label: "退会のお手続き",
},
];

const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);

const unregister = async() => {
  type ApiResponse = paths["/auth/withdrawal"]["post"]["responses"][204];
  const authEndpoint = useAuthApiEndpoint();
  const commonAlert = useCommonAlert();
  const { data: response, error } = await useCallApi<ApiResponse>(
    authEndpoint.value.endpoint + "/v1/auth/withdrawal",
    { method: "post", }
  );

  if(error.value) {
    if(error.value.statusCode === 404) {
      commonAlert.showWarn("退会済みのユーザーです。");
      return;
    }
    commonAlert.showWarn("エラーが発生しました。");
    return;
  }

  /** キャッシュデータ削除 */
  const accessTokenCookie = useCookie("RL_ACT");
  const refreshTokenCookie = useCookie("RL_RFT");
  accessTokenCookie.value = null;
  refreshTokenCookie.value = null;
  useUserInfo().clear();

  commonAlert.showSuccess(
    "退会は成功しました。",
    "/"
  );
}

onMounted(() => {
breadcrumblinks.value = [...links];
});

</script>

