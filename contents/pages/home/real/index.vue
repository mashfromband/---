<template>
  <UCard
    class="overflow-hidden"
    :ui="{
      header: { base:'', background:'', padding:'px-0 py-0 sm:px-0'},
      footer: { base:'', background:'', padding:'px-0 py-0 sm:px-0'}
    }"
  >
    <template #header>
      <div class="bg-primary-500 p-3 lg:p-4">
      </div>
    </template>
    <div class="border-b-2 pb-4">
      <div class="justify-between flex gap-3 min-w-0">
          <div class="inline-flex items-center">
            <UIcon name="i-heroicons-building-storefront" class="w-10 h-10"/>
            <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">REAL</span>
          </div>
      </div>
    </div>

    <!--保有REAL-->
    <MemberStats :items="[ { title: '現在の保有REAL', change: userResultState.point } ]" />
      <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 xl:gap-x-8">
        <UPageCard v-for="redeemItem in redeemItems" :key="redeemItem.id"
          class="overflow-hidden"
          :ui="{
            header: { base:'', background:'', padding:'px-0 py-0 sm:px-0'},
            footer: { base:'', background:'', padding:'px-0 py-0 sm:px-0'},
          }"
        >
          <template #header>
            <div class="flex items-center justify-between p-6">
              <NuxtImg :src="redeemItem.imageUrl" :alt="redeemItem.name" class="h-12 flex-none bg-white object-cover" />
              <UPopover mode="hover">
                <UButton @click="openExternalSite(redeemItem.officialUrl)" color="gray" variant="ghost" class="relative ml-auto">
                  <UIcon name="i-heroicons-arrow-up-right" class="h-8 w-8" aria-hidden="true" />
                </UButton>
                <template #panel>
                  <div class="p-2">
                    交換先サービス - 公式サイト -
                  </div>
                </template>
              </UPopover>
            </div>
          </template>
          <dl class="-my-3 divide-y divide-gray-100 text-sm leading-6">
            <div class="flex justify-between gap-x-4 py-3">
              <dt class="font-bold truncate">{{redeemItem.name}}</dt>
              <dd class="flex flex-shrink-0">
                <UBadge :label="getBadgeLabel(redeemItem.status)" :color="getBadgeColor(redeemItem.status)" />
              </dd>
            </div>
            <div v-if="redeemItem.exchangeDetail" class="flex justify-between cursor-pointer" @click="toggleDescription(redeemItem.id)">
              <dd class="py-0 line-clamp-3 leading-normal min-h-[4rem]">
                {{redeemItem.exchangeDetail}}
              </dd>
              <div class="flex items-center">
                <UIcon name="i-heroicons-chevron-right" class="h-5 w-5 flex-none" />
              </div>
            </div>
            <UModal v-model="isDescriptionOpen[redeemItem.id]">
              <UCard>
                <UAlert title="交換対象の詳細" :ui="{inner:'flex justify-center', title:'text-gray-900'}"/>
                <div class="flex justify-center mt-8">
                  <span class="font-bold text-xl leading-6">{{redeemItem.name}}</span>
                </div>
                <div class="leading-6 my-4 scroll-area">{{redeemItem.exchangeDetail}}</div>
                <div class="flex justify-center gap-6">
                  <UButton label="交換を確定する" @click="exchamgeDigico(redeemItem.exchangeAmount)" class="mt-4" />
                  <UButton label="キャンセル" color="white" @click="toggleDescription(redeemItem.id)" class="mt-4"/>
                </div>
              </UCard>
            </UModal>
            <UModal v-model="exchangeDegicotModalState.isOpen">
              <UCard>
                <UAlert
                  icon="i-heroicons-check"
                  color="primary"
                  description= "交換は成功しました"
                  variant="soft"
                  :ui="{
                    description: 'text-black',
                  }"
                />
                <div class="leading-6 my-4 scroll-area">
                  各デジタルギフトは、ギフトURLから交換先サービスを経由してご利用いただけます。
                </div>
                <div class="flex justify-center gap-6">
                  <UButton @click="openExternalSite(exchangeDegicotModalState.url)" class="mt-4" label="ギフトURL" color="white" size="xl" icon="i-heroicons-arrow-up-right" trailing />
                </div>
                <template #footer>
                  <div class="flex items-center justify-center">
                    <UButton @click="exchangeDegicotModalState.isOpen = false">CLOSE</UButton>
                  </div>
                </template>
              </UCard>
            </UModal>
            <div class="flex justify-between gap-x-4 py-3">
              <dt>REAL</dt>
              <dd class="flex items-start gap-x-2">
                <div class="font-medium text-xl">{{ formatAmount(redeemItem.efoRate) }}</div>
              </dd>
            </div>
          </dl>
          <div v-if="redeemItem.status ==='onStock'" class="mt-4">
            <UButton to="#" label="交換する" size="xl" @click="toggleDescription(redeemItem.id)" block />
          </div>
        </UPageCard>
      </div>
  </UCard>
  <div class="mt-4 lg:hidden">
    <UButton to="/home/record" label="成績に戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
  </div>
  <TmNotice />
</template>


<script setup lang="ts">
import type { paths } from "@/types/api/contents";

definePageMeta({
  layout: 'profile'
})

type ApiResponse = paths["/user/me/real"]["get"]["responses"][200]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();
const userResultState = reactive({
  point: 0,
});

const { data: userHaveReal } = await useCallApi<ApiResponse>(
  apiEndpoint.value.endpoint + "/v1/user/me/real",
  { method: "get" },
);
if (userHaveReal.value) {
  userResultState.point = userHaveReal.value.haveReal;
}

const links : BreadcrumbLinkItem[] = [
  { to: "/home", icon:"i-heroicons-home-20-solid"},
  { label: "REAL"},
];
const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);

onMounted(() => {
  breadcrumblinks.value = [...links];
});

interface RedeemItem {
  id: number;
  name: string;
  exchangeAmount: number;
  imageUrl: string;
  officialUrl: string;
  exchangeDetail: string;
  efoRate: number;
  status: string;
}

const redeemImageUrl = useStaticCdnUrl("/img/efo/digico_logo.png").staticCdnUrl;
const redeemItems = ref<RedeemItem[]>([
  { id: 1, name: 'デジコ10円相当', exchangeAmount:10, imageUrl: redeemImageUrl.value, officialUrl:'https://user.digi-co.net/use', efoRate: 10 , status: 'onStock', exchangeDetail:'Amazonギフトカードなど、各種ECモールや各種決済アプリで使用できるポイントに交換可能です。' },
  { id: 2, name: 'デジコ100円相当', exchangeAmount:100, imageUrl: redeemImageUrl.value, officialUrl:'https://user.digi-co.net/use', efoRate: 100 , status: 'onStock', exchangeDetail:'Amazonギフトカードなど、各種ECモールや各種決済アプリで使用できるポイントに交換可能です。' },
]);


const isDescriptionOpen = ref<{ [key: number]: boolean }>({});

const toggleDescription = (id: number) => {
  isDescriptionOpen.value[id] = !isDescriptionOpen.value[id];
};

//  ui
interface Badge {
  status: string;
  name: string;
  color: string;
}

const badges = ref<Badge[]>([
  { status: 'onStock', name: '在庫あり', color: 'green' },
  { status: 'onHold', name: '在庫切れ', color: 'primary' },
  { status: 'comingSoon', name: '準備中', color: 'gray' },
  { status: 'soldOut', name: '交換停止中', color: 'red' }
]);

const getBadgeColor = (status: string): string => {
  const badge = badges.value.find(b => b.status === status);
  return badge ? badge.color : 'default';
};

const getBadgeLabel = (status: string): string => {
  const badge = badges.value.find(b => b.status === status);
  return badge ? badge.name : '';
};

const formatAmount = (efoRate: number): string => {
  return efoRate.toLocaleString();
};

/** 交換する */
const exchangeDegicotModalState = reactive({
  isOpen: false,
  url: ''
});
const openExchangeDegicotModal = (degicotUrl:string) => {
  exchangeDegicotModalState.url = degicotUrl;
  exchangeDegicotModalState.isOpen = true;
}
const exchamgeDigico = async (amount: number) => {
  type ApiRequest = paths["/user/me/real/exchange/digico"]["post"]["requestBody"]["content"]["application/json"];
  type ApiResponse = paths["/user/me/real/exchange/digico"]["post"]["responses"][200]["content"]["application/json"];

  const requestBody:ApiRequest = {
    hopeToExchangeDigico: amount
  };

  const { data: response, error } = await useCallApi<ApiResponse>(
    useApiEndpoint().value.endpoint + "/v1/user/me/real/exchange/digico",
    { 
      method: "post",
      body: requestBody,
    },
  );

  if(error.value) {
    if(error.value.statusCode === 409){
      commonAlert.showWarn(error.value.data.message);
      return;
    }

    commonAlert.showWarn("交換は失敗しました。");
    return;
  }

  if(!response.value){
    commonAlert.showWarn("交換は失敗しました。");
    return;
  }
  
  openExchangeDegicotModal(response.value.digicoUrl);
  userResultState.point = userResultState.point - response.value.consumeReal;
}

const openExternalSite = (url:string) => {
  window.open(url, '_blank');
}
</script>

<style scoped>
.scroll-area {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
