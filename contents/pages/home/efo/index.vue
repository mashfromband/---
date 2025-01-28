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
            <UIcon name="i-heroicons-circle-stack" class="w-10 h-10"/>
            <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">EFO</span>
          </div>
      </div>
    </div>

    <!--保有EFO-->
    <MemberStats :items="[ { title: '現在の保有EFO', change: userState.point } ]" />

    <UTabs :items="tabItems" class="mt-4">
      <!--redeem-->
      <template #redeem="{ item }">
        <MemberStats :items="[ { title: 'REAL交換レート', change: efoToRealRate} ]" />
        <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 xl:gap-x-8">
          <UPageCard v-for="redeemItem in redeemItems" :key="redeemItem.id"
            class="overflow-hidden"
            :ui="{
              header: { base:'', background:'', padding:'px-0 py-0 sm:px-0'},
              footer: { base:'', background:'', padding:'px-0 py-0 sm:px-0'},
            }"
          >
            <dl class="-my-3 divide-y divide-gray-100 text-sm leading-6">
              <div class="flex justify-between gap-x-4 py-3">
                <dt class="font-bold truncate">{{redeemItem.name}}</dt>
                <dd class="flex flex-shrink-0">
                  <UBadge :label="getBadgeLabel(redeemItem.status)" :color="getBadgeColor(redeemItem.status)" />
                </dd>
              </div>
              <div class="flex justify-between gap-x-4 py-3">
                <dt>EFO</dt>
                <dd class="flex items-start gap-x-2">
                  <div class="font-medium text-xl">{{ requiredEfoAmount(redeemItem.exchangeAmount, efoToRealRate) }}</div>
                </dd>
              </div>
            </dl>
            <div v-if="redeemItem.status ==='onStock'" class="mt-4">
              <UButton label="交換する" size="xl" block @click="toggleExchange(redeemItem.id)" />
            </div>
            <UModal v-model="isExchangeOpen[redeemItem.id]">
                <UCard>
                  <UAlert title="交換対象の詳細" :ui="{inner:'flex justify-center', title:'text-gray-900'}"/>
                  <div class="flex justify-center mt-8">
                    <span class="font-bold text-xl leading-6">{{redeemItem.name}}</span>
                  </div>
                  <div class="leading-6 my-4 scroll-area">{{redeemItem.exchangeDetail}}</div>
                  <div class="flex flex-wrap lg:flex-nowrap justify-center gap-6">
                    <UButton label="交換を確定する" @click="exchamgeReal(redeemItem.exchangeAmount)" class="mt-4" size="lg" />
                    <UButton label="キャンセル" color="white" @click="toggleExchange(redeemItem.id)" class="mt-4" size="lg" />
                  </div>
                </UCard>
              </UModal>
          </UPageCard>
        </div>
      </template>
      <!--earn-->
      <template #earn="{ item }">
        <div class="cols-span-2">
          <MenuBanner :items="[{
            headline:'REALIZE LEARNING', link:'/genre/', label:'さっそくクエストに挑戦', img:bannerImageUrl,
            text:'リアライズラーニングでは、クエストの初回クリア時にEFOを獲得できます'}]" />
        </div>
      </template>
    </UTabs>
  </UCard>
  <div class="mt-4 lg:hidden">
    <UButton to="/home/record" label="成績に戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
  </div>
</template>

<script setup lang="ts">
import type { paths } from "@/types/api/contents";
definePageMeta({
  layout: 'profile'
})

//  ui
interface Badge {
  status: string;
  name: string;
  color: string;
}
const getBadgeColor = (status: string): string => {
  const badge = badges.value.find(b => b.status === status);
  return badge ? badge.color : 'default';
};
const getBadgeLabel = (status: string): string => {
  const badge = badges.value.find(b => b.status === status);
  return badge ? badge.name : '';
};
const requiredEfoAmount = (exchangeAmount: number, exchangeRate: number): string => {
const requiredEfoAmount = exchangeAmount * exchangeRate;
return requiredEfoAmount.toLocaleString();
};
const links : BreadcrumbLinkItem[] = [
  { to: "/home", icon:"i-heroicons-home-20-solid"},
  { label: "EFO"},
];
interface RedeemItem {
  id: number;
  name: string;
  exchangeDetail: string;
  status: string;
  exchangeAmount: number;
}
const redeemItems = ref<RedeemItem[]>([
  { id: 1, name: 'REAL 1', exchangeAmount:1, status: 'onStock', exchangeDetail:'REALは、各種ECモールや各種決済アプリで使用できるポイントに交換可能です。貯めたポイントを使って自分へのご褒美を買ったり、さらなるスキルアップのための教材の費用にあてたりすることもできます。' },
  { id: 2, name: 'REAL 10', exchangeAmount:10, status: 'onStock', exchangeDetail:'REALは、各種ECモールや各種決済アプリで使用できるポイントに交換可能です。貯めたポイントを使って自分へのご褒美を買ったり、さらなるスキルアップのための教材の費用にあてたりすることもできます。' },
  { id: 3, name: 'REAL 50', exchangeAmount:50, status: 'onStock', exchangeDetail:'REALは、各種ECモールや各種決済アプリで使用できるポイントに交換可能です。貯めたポイントを使って自分へのご褒美を買ったり、さらなるスキルアップのための教材の費用にあてたりすることもできます。' },
  { id: 4, name: 'REAL 100', exchangeAmount:100, status: 'onStock', exchangeDetail:'REALは、各種ECモールや各種決済アプリで使用できるポイントに交換可能です。貯めたポイントを使って自分へのご褒美を買ったり、さらなるスキルアップのための教材の費用にあてたりすることもできます。' }
]);

const badges = ref<Badge[]>([
  { status: 'onStock', name: '在庫あり', color: 'green' },
  { status: 'onHold', name: '在庫切れ', color: 'primary' },
  { status: 'comingSoon', name: '準備中', color: 'gray' },
  { status: 'soldOut', name: '交換停止中', color: 'red' }
]);

const tabItems = [
  { slot: 'redeem', label: 'EFOを使う'},
  { slot: 'earn', label: 'EFOをためる'}
];

// ダミー　消して良い
const bannerImageUrl = useStaticCdnUrl("/img/logo_3_b.png").staticCdnUrl;
const redeemImageUrl = useStaticCdnUrl("/img/efo/digico_logo.png").staticCdnUrl;

const isExchangeOpen = ref<{ [key: number]: boolean }>({});
const toggleExchange = (id: number) => {
  isExchangeOpen.value[id] = !isExchangeOpen.value[id];
};
const commonAlert = useCommonAlert();

//保有EFOを取得する
type ApiResponse = paths["/user/me/efo"]["get"]["responses"][200]["content"]["application/json"];
const userState = reactive({
  point: 0,
});

const { data: userHaveEfo } = await useCallApi<ApiResponse>(
  useApiEndpoint().value.endpoint + "/v1/user/me/efo",
  { method: "get" },
);
if(userHaveEfo.value) {
  userState.point = userHaveEfo.value.haveEfo;
}

//  交換レートを取得する
type ApiEfoRateResponse = paths["/real-efo/rate"]["get"]["responses"][200]["content"]["application/json"];
const { data: efoRateResponse, error } = await useCallApi<any>(
  useApiEndpoint().value.endpoint + "/v1/real-efo/rate",
  { method: "get" },
);
if(error.value) {
  throw new Error("情報取得が失敗しました");
}
const efoToRealRate:number = efoRateResponse.value!.default.rate;


/** 交換する */
const exchamgeReal = async (amount: number) => {
  type ApiRequest = paths["/user/me/efo/exchange/real"]["post"]["requestBody"]["content"]["application/json"];
  type ApiResponse = paths["/user/me/efo/exchange/real"]["post"]["responses"][200]["content"]["application/json"];

  const requestBody:ApiRequest = {
    hopeToExchangeReal:amount
  }
  const { data: response, error } = await useCallApi<ApiResponse>(
    useApiEndpoint().value.endpoint + "/v1/user/me/efo/exchange/real",
    { 
      method: "post",
      body: requestBody,
    },
  );

  if(error.value) {
    if(error.value.statusCode === 409){
      //保有EFOが不足しています
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

  commonAlert.showSuccess(
    `交換は成功しました。`
  );
  userState.point = response.value.currentEfo;
}

const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);
onMounted(() => {
  breadcrumblinks.value = [...links];
});
</script>

<style scoped>
.scroll-area {
  max-height: 60vh;
  overflow-y: auto;
}
</style>