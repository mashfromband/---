
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
      <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">お手続きの確認</span>
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
      <div>
        このたびは、<span class="font-bold">REALIZE LEARNING -リアライズラーニング</span>をご利用いただき、誠にありがとうございます。退会手続きを進める前に、いくつかご確認いただきたい点がございます。
      </div>
      <div>
        <div class="flex items-center">
          <span class="flex flex-none mr-2 h-8 w-8 items-center justify-center rounded-full bg-secondary-500 text-white font-medium">
          01</span>
          <span class="font-bold">現在の学習状況</span>
        </div>
        あなたは 現在
        <ClientOnly>
          <div v-if="!userLevel">
            <span>読み込み中...</span>
          </div>
          <span v-else class="font-bold tracking-wider">レベル {{userLevel}} </span>
        </ClientOnly>
        に到達し、さまざまなスキルを習得されています​​。
        このまま続けていただけると、次のステップで 新たな称号やスキルを獲得することができます！
        <div class="flex justify-end items-center mt-4">
          <UButton to="/home/record" label="これまでの成績を確認する" size="lg" icon="i-heroicons-chevron-right" trailing />
        </div>
      </div>
      <div>
        <div class="flex items-center">
          <span class="flex flex-none mr-2 h-8 w-8 items-center justify-center rounded-full bg-secondary-500 text-white font-medium">
          02</span>
          <span class="font-bold">ご利用いただける保有EFO（ポイント）</span>
        </div>
        あなたは 現在 <span class="font-bold tracking-wider"> {{userEfo}}EFO </span>を保有しています。継続してご利用いただくと、さまざまなリアルマネーと交換することができます。
        EFOは 学習の成果をあなたのリアルなステップアップにお役立ていただくためのリアライズラーニングだけのサービスです。今後も交換対象の追加を予定しております。
        <div class="flex justify-end items-center mt-4">
          <UButton to="/home/efo" label="保有EFOを確認する" size="lg" icon="i-heroicons-chevron-right" trailing />
        </div>
      </div>
      <div>
        <div class="flex items-center">
          <span class="flex flex-none mr-2 h-8 w-8 items-center justify-center rounded-full bg-secondary-500 text-white font-medium">
          03</span>
          <span class="font-bold">継続する理由</span>
        </div>
        リアライズラーニングでは、今後のアップデートで <span class="font-bold tracking-wider">適性テストの導入</span>や<span class="font-bold tracking-wider">大学等の教育機関と協働した「学び直し」コンテンツの拡充</span>を予定しています。
        継続いただければ、私たちのサポート体制も強化し、あなたのスキルアップを全力でお手伝いします。
      </div>
      <div>
        <div class="flex items-center">
          <span class="flex flex-none mr-2 h-8 w-8 items-center justify-center rounded-full bg-secondary-500 text-white font-medium">
          04</span>
          <span class="font-bold">ご登録情報について</span>
        </div>
        ご退会された場合、再度リアライズラーニングをご利用いただく際には新しいアカウントを作成をする必要があります。学習状況や獲得経験値、保有EFOはすべてゼロからの再スタートになります。
      </div>
      <div>
      </div>
    </div>
    <ElTextLink to="/home/settings/unregister">
      <div class="flex justify-end items-center mt-4">
        <span>それでも退会を希望される方へ</span>
        <UIcon name="i-heroicons-chevron-right" class="ml-4 w-6 h-6"/>
      </div>
    </ElTextLink>
  </UPageCard>
<div class="mt-4 lg:hidden">
  <UButton to="/home/settings" label="アカウント設定に戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
</div>


</template>


<script setup lang="ts">
import type { paths } from "@/types/api/contents";

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
label: "お手続きの確認",
},
];

type ApiResponse = paths["/user/me/efo"]["get"]["responses"][200]["content"]["application/json"];
const { data: response, error } = await useCallApi<ApiResponse>(
  useApiEndpoint().value.endpoint + "/v1/user/me/efo",
  { method: "get" },
);
if(error.value || !response.value) {
  throw new Error("情報取得が失敗しました");
}
const userEfo:number = response.value.haveEfo;

const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);
onMounted(() => {
breadcrumblinks.value = [...links];
});

</script>

