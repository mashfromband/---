<template>
<BreadcrumbLinks v-bind:links="links" />
<UContainer
:ui="{
    padding: 'px-0 sm:px-0'
  }"
>
  <UPageGrid
    :ui="{
      wrapper:'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3'
    }" 
  >
    <!--中央カラム-->
    <div class="flex flex-col col-span-full lg:col-span-2 gap-12">
      <PageheaderGeneral title="企業詳細" />
      <div v-if=companyInfo>
        <div class="grid grid-cols-1 mx-4">
          <!-- companyTitle -->
          <div class="col-span-1 lg:col-span-2">
            <p class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{{companyInfo.displayName}}</p>
            <p class="mt-6 text-base whitespace-pre-wrap break-words">{{ companyInfo.profile }}</p>
            <UButton v-if="companyInfo.officialSiteUrl" :to="companyInfo.officialSiteUrl" label="公式サイト" icon="i-heroicons-arrow-top-right-on-square" size="xl" class="mt-4" trailing />
            <h2 class="text-sm text-gray mt-4">最終更新日時：{{ companyInfo.updatedAt }}</h2>
            <UDivider type="solid" size="xs" class="my-8" />
          </div>
          <!-- companyInfo -->
          <dl class="col-span-1 gap-y-8 lg:gap-y-16 text-base leading-7 grid grid-cols-1 lg:grid-cols-2">
            <div class="relative">
              <dt class="font-semibold flex items-center">
                <UIcon name="i-heroicons-users" class="h-6 w-6 text-primary" aria-hidden="true" />
                <span>従業員数</span>
              </dt>
              <dd class="mt-2">
                <p v-if="companyInfo.employees">{{ companyInfo.employees }}</p>
                <p v-else>未設定</p>
              </dd>
            </div>
            <div class="relative">
              <dt class="font-semibold flex items-center">
                <UIcon name="i-heroicons-chart-pie" class="h-6 w-6 text-primary" aria-hidden="true" />
                <span>売上高</span>
              </dt>
              <dd class="mt-2">
                <p v-if="companyInfo.netSales">{{ companyInfo.netSales }}</p>
                <p v-else>未設定</p>
              </dd>
            </div>
            <div class="relative">
              <dt class="font-semibold flex items-center">
                <UIcon name="i-heroicons-building-office" class="h-6 w-6 text-primary" aria-hidden="true" />
                <span>設立年月日</span>
              </dt>
              <dd class="mt-2">
                <p v-if="companyInfo.establishmentDate">{{ companyInfo.establishmentDate }}</p>
                <p v-else>未設定</p>
              </dd>
            </div>
            <div class="relative">
              <dt class="font-semibold flex items-center">
                <UIcon name="i-heroicons-map-pin" class="h-6 w-6 text-primary" aria-hidden="true" />
                <span>住所</span>
              </dt>
              <dd class="mt-2">
                <p>{{ companyInfo.postalCode }}</p>
                <p v-if="!companyInfo.prefecture && !companyInfo.address">未設定</p>
                <p v-else>{{ companyInfo.prefecture }}{{ companyInfo.address }}</p>
                <p v-if="companyInfo.phoneNumber"><UIcon name="i-heroicons-phone" /> {{ companyInfo.phoneNumber }}</p>
                <p v-if="companyInfo.faxNumber"><UIcon name="i-heroicons-printer-16-solid" /> {{ companyInfo.faxNumber }}</p>
              </dd>
            </div>
          </dl>
          <!-- contactPerson -->
          <div class="col-span-1 lg:col-span-2">
            <UDivider type="solid" size="xs" class="my-8" />
            <dt class="font-semibold flex items-center">
              <UIcon name="i-heroicons-user" class="h-6 w-6 text-primary" aria-hidden="true" />
              <span>求人担当者</span>
            </dt>
            <dd class="mt-2">
              <p v-if="!companyInfo.contactPersonName && !companyInfo.contactPersonPosition">未設定</p>
              <p v-if="companyInfo.contactPersonName">{{ companyInfo.contactPersonName }}</p>
              <p v-if="companyInfo.contactPersonPosition">{{ companyInfo.contactPersonPosition }}</p>
              <p v-if="companyInfo.contactPersonPhoneNumber"><UIcon name="i-heroicons-phone" /> {{ companyInfo.contactPersonPhoneNumber }}</p>
              <p v-if="companyInfo.contactPersionMailAddress"><UIcon name="i-heroicons-envelope" /> {{ companyInfo.contactPersionMailAddress }}</p>
            </dd>
          </div>
        </div>
      </div>
      <div v-else class="h-[160px] flex items-center justify-center text-center animate-pulse">
        <div>読み込み中...</div>
      </div>
    </div>
    <!--右カラム-->
    <div class="flex flex-col col-span-full lg:col-start-3 gap-12">
      <!--広告-->
      <AdNinja sizeType="300x250" adScriptUrl="https://adm.shinobi.jp/s/568fb516ab3f7075b5cb26d53f9e408b" />
    </div>
  </UPageGrid>
</UContainer>
</template>


<script setup lang="ts">
import type { paths } from "@/types/api/contents";
import { getCode2Prefecture } from "@/utils/prefecture";

const companyInfo = ref();

const route = useRoute();
const recruitCompanyId = route.params.recruitCompanyId as string;
const apiEndpoint = useApiEndpoint();

type getRecruitCompanyReponse= paths["/recruit-company/{recruitCompanyId}"]["get"]["responses"][200]["content"]["application/json"];
const { data, error } = await useCallApi(
    apiEndpoint.value.endpoint + `/v1/recruit-company/${recruitCompanyId}`,
  { method: "get" }
);

if(!error.value) {
  const response = data.value as getRecruitCompanyReponse;
  companyInfo.value = response;
  companyInfo.value.prefecture = getCode2Prefecture(response.prefectureCode);
  companyInfo.value.updatedAt = `${response.updatedAtYear}年${parseInt(response.updatedAtMonth)}月${parseInt(response.updatedAtDay)}日`;
  companyInfo.value.establishmentDate = `${response.establishmentYear}年${parseInt(response.establishmentMonth)}月${parseInt(response.establishmentDay)}日`;
}


const links = [
  {icon: "i-heroicons-home-20-solid", to: "/home",},
  {label: "求人", to: "/wanted_ads",},
  {label: `企業詳細：${companyInfo.value.displayName}`, },
];


</script>

