<template>
  <PageheaderLogoCard />
  <UPageHero
    align="center"
    class="relative bg-white dark:bg-gray-900 rounded-t-3xl"
    :ui="{
      wrapper:'bg-none -mt-6 lg:-mt-20'
    }"
  >
    <template #title>
      <div>EFO ご利用履歴</div>
    </template>
    <template #description>
      <div class="text-xl font-bold">
        <div v-if="efoHistory.type == 'redeem'">EFO交換</div>
        <div v-else>EFO獲得</div>
      </div>
    </template>
  </UPageHero>
  <UPageCard>
    <div class="flex justify-center">
      <div class="prose">
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <td>{{efoHistory.id}}</td>
            </tr>
            <tr>
              <th>日時</th>
              <td>{{efoHistory.date}}</td>
            </tr>
            <tr>
              <th>EFO</th>
              <td>{{efoHistory.unit}}</td>
            </tr>
            <tr>
              <th>種別</th>
              <td v-if="efoHistory.type == 'redeem'">交換：{{efoHistory.caption}}</td>
              <td v-else>獲得：{{efoHistory.caption}}</td>
            </tr>
            <tr>
              <th>対象</th>
              <td>{{efoHistory.title}}</td>
            </tr>
            <tr>
              <th>説明</th>
              <td>{{efoHistory.description}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </UPageCard>
  <div class="mt-4">
    <UButton to="/home/efo/history" label="一覧に戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
  </div>
</template>
  
<script setup lang="ts">
import type { paths } from '~/types/api/contents';

definePageMeta({
  layout: 'profile'
})


type History = {
    id: string;
    date: string;
    type: 'redeem' | 'earn';
    caption: string;
    unit: number;
    title: string;
    description: string;
};
const efoHistory = ref<History>({
  id: '',
  date: '',
  type: 'redeem',
  caption: 'REAL',
  unit: 0,
  title: '',
  description: '',
});

const links : BreadcrumbLinkItem[] = [
  { to: "/home", icon:"i-heroicons-home-20-solid"},
  { label: "EFO", to: "/home/efo",},
  { label: "EFO獲得・交換履歴", to: "/home/efo/history",},
  { label: "詳細",},
];
const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);

const route = useRoute();
const transactionId = route.params.transactionId as string;

type ResponseSuccess = paths["/user/me/efo/{transactionId}"]["get"]["responses"][200]["content"]["application/json"];
const { data: response, error } = await useCallApi<ResponseSuccess>(
  useApiEndpoint().value.endpoint + `/v1/user/me/efo/${transactionId}`,
  { method: "get" }
);

if(response.value && !error.value) {
  const isEarn = response.value.addEfo > 0;
  const history:History = {
    id: response.value.transactionId,
    date: `${response.value.createdAtYear}年${response.value.createdAtMonth}月${response.value.createdAtDay}日 ${response.value.createdAtHour}:${response.value.createdAtMinute}`,
    type: isEarn ? 'earn' : 'redeem',
    caption: isEarn ? "リアライズラーニング" : "REAL",
    unit: isEarn ? response.value.addEfo : Math.abs(response.value.consumeEfo),
    title: "REAL",
    description: "なし"
  };
  efoHistory.value = history;
} else if (error.value) {
  if(error.value.statusCode === 404) {
    useCommonAlert().showNotFoundWarn();
  }
}

onMounted(() => {
  breadcrumblinks.value = [...links];
});

const bgImageUrl = useStaticCdnUrl("/img/logo_3_b.png").staticCdnUrl;
</script>