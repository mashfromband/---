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
      <div>REAL ご利用履歴</div>
    </template>
    <template #description>
      <div class="text-xl font-bold">
        <div v-if="realHistory.type == 'redeem'">REAL交換</div>
        <div v-else>REAL獲得</div>
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
              <td>{{realHistory.id}}</td>
            </tr>
            <tr>
              <th>日時</th>
              <td>{{realHistory.date}}</td>
            </tr>
            <tr>
              <th>REAL</th>
              <td>{{realHistory.unit}}</td>
            </tr>
            <tr>
              <th>種別</th>
              <td v-if="realHistory.type == 'redeem'">交換：{{realHistory.caption}}</td>
              <td v-else>獲得：{{realHistory.caption}}</td>
            </tr>
            <tr>
              <th>対象</th>
              <td>{{realHistory.title}}</td>
            </tr>
            <tr>
              <th>説明</th>
              <td>{{realHistory.description}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </UPageCard>
  <div class="mt-4">
    <UButton to="/home/real/history" label="一覧に戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
  </div>
</template>

<script setup lang="ts">
import type { paths } from "@/types/api/contents";

definePageMeta({
  layout: 'profile'
})

const links : BreadcrumbLinkItem[] = [
  { to: "/home", icon:"i-heroicons-home-20-solid"},
  { label: "REAL", to: "/home/real",},
  { label: "REAL獲得・交換履歴", to: "/home/real/history",},
  { label: "詳細",},
];
const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);

onMounted(() => {
  breadcrumblinks.value = [...links];
});

type ApiResponse = paths["/user/me/real/{realId}"]["get"]["responses"][200]["content"]["application/json"];

const route = useRoute();
const apiEndpoint = useApiEndpoint();
const realHistory = ref({
  id: "",
  date: "",
  type: "earn" as "earn" | "redeem",
  caption: "REAL",
  unit: 0,
  title: "",
  description: "",
});

const toDateString = (real: ApiResponse) => {
  const {
    createdAtYear: year,
    createdAtMonth: month,
    createdAtDay: day,
    createdAtHour: hour,
    createdAtMinute: minute,
  } = real;
  return `${year}年${Number(month)}月${Number(day)}日 ${hour}:${minute}`;
};

const { data, error } = await useCallApi<ApiResponse>(
  apiEndpoint.value.endpoint + "/v1/user/me/real/" + route.params.realId,
  { method: "get" },
);
if (data.value) {
  const isEarn = data.value.addReal > 0;
  realHistory.value.id = data.value.id;
  realHistory.value.date = toDateString(data.value),
  realHistory.value.type = isEarn ? "earn" : "redeem";
  realHistory.value.caption = isEarn?"EFO":"デジコ";
  realHistory.value.unit = isEarn ? data.value.addReal : data.value.consumeReal;
  realHistory.value.title = "REAL";
  realHistory.value.description = "なし";
} else {
  throw createError({
    statusCode: error.value?.statusCode,
    statusMessage: error.value?.message,
    fatal: true,
  });
}
</script>
