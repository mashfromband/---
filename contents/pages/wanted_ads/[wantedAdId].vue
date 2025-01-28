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
      <UPage>
        <PageheaderGeneral title="求人詳細" />
        <UPageBody prose>
          <div v-if="wantedAd" >
            <div class="px-4 sm:px-0">
              <h3 class="text-2xl font-semibold leading-7">{{wantedAd.title}}</h3>
              <span class="leading-10">
              <ElTextLink :to=companyDetailUrl(wantedAd.recruitCompanyId) target="_blank">
                {{ wantedAd.recruitCompanyName }}
                <UIcon name="i-heroicons-arrow-up-right" />
              </ElTextLink>
              </span>
              <div class="flex items-center text-base">{{wantedAd.updatedAt}} 更新</div>
            </div>
            <div class="mt-6 border-t border-gray-200 dark:border-gray-800">
            <div class="flex flex-wrap items-center">
              <SubmitButton
                label="この求人に応募する"
                icon="i-heroicons-paper-airplane"
                size="xl"
                class="mt-6"
                @click="onApply"
              />
            </div>
              <dl class="divide-y divide-gray-100 dark:divide-gray-800 whitespace-pre-line">
                <div class="bg-gray-50/50 dark:bg-gray-500/50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-briefcase" class="w-6 h-6 mr-2" />募集職種</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{{wantedAd.position}}</div>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-map-pin" class="w-6 h-6 mr-2" />勤務地</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{{wantedAd.workLocation}}</div>
                </div>
                <div class="bg-gray-50/50 dark:bg-gray-500/50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-identification" class="w-6 h-6 mr-2" />雇用形態</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{{wantedAd.employmentStatus}}</div>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-users" class="w-6 h-6 mr-2" />募集人数</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{{wantedAd.numberOfPeople}}</div>
                </div>
                <div class="bg-gray-50/50 dark:bg-gray-500/50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-building-office" class="w-6 h-6 mr-2" />仕事内容の詳細</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{{wantedAd.details}}</div>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-document-check" class="w-6 h-6 mr-2" />応募条件</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{{wantedAd.requirements}}</div>
                </div>
                <div class="bg-gray-50/50 dark:bg-gray-500/50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-currency-yen" class="w-6 h-6 mr-2" />給与・待遇</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{{wantedAd.salaryAndBenefits}}</div>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-clock" class="w-6 h-6 mr-2" />勤務時間</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{{wantedAd.officeHour}}</div>
                </div>
                <div class="bg-gray-50/50 dark:bg-gray-500/50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-calendar-days" class="w-6 h-6 mr-2" />休日・休暇</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{{wantedAd.dayOff}}</div>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-face-smile" class="w-6 h-6 mr-2" />福利厚生</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{{wantedAd.welfareProgram}}</div>
                </div>
                <div class="bg-gray-50/50 dark:bg-gray-500/50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6 mr-2" />応募方法</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{{wantedAd.howToApply}}</div>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-inbox-stack" class="w-6 h-6 mr-2" />応募書類</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{{wantedAd.applicationDocuments}}</div>
                </div>
                <div class="bg-gray-50/50 dark:bg-gray-500/50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <div class="text-sm font-medium leading-6 flex"><UIcon name="i-heroicons-clipboard-document-check" class="w-6 h-6 mr-2" />応募締切日</div>
                  <div class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 font-bold text-red-500">{{wantedAd.applicationDeadline}}</div>
                </div>
                <div class="flex flex-wrap items-center">
                  <SubmitButton
                    label="この求人に応募する"
                    icon="i-heroicons-paper-airplane"
                    size="xl"
                    class="mt-6"
                    @click="onApply"
                  />
                </div>
              </dl>
            </div>
          </div>
        </UPageBody>
      </UPage>
    </div>
    <!--右カラム-->
    <div class="flex flex-col col-span-full lg:col-start-3 gap-12">
      <!--広告-->
      <div class="hidden lg:flex justify-center">
        <AdNinja sizeType="160x600" adScriptUrl="https://adm.shinobi.jp/s/2571148a51cdc71329df6329fafc3906" />
      </div>
    </div>

  </UPageGrid>
</UContainer>

  <UModal v-model="isAppliedModalOpen">
    <UCard>
      <UAlert title="応募が完了しました" :ui="{ inner:'flex justify-center', title:'text-gray-900 font-bold text-xl' }"/>
      <div class="leading-6 my-4 scroll-area">
        このたびはご応募いただき、ありがとうございます！<br>
        企業からの連絡をお待ちください。
      </div>
      <div class="flex justify-center gap-6">
        <UButton label="CLOSE" class="mt-4" @click="isAppliedModalOpen = false" />
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { paths } from "@/types/api/contents";

const companyDetailUrl = (recruitCompanyId:string) => {
  return `/wanted_ads/company/${recruitCompanyId}`;
}
const wantedAd = ref();

const route = useRoute();
const wantedAdId = route.params.wantedAdId as string;
const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();
type getWantedAdReponse= paths["/wanted-ads/{wantedAdsId}"]["get"]["responses"][200]["content"]["application/json"];
const { data, error } = await useCallApi(
    apiEndpoint.value.endpoint + `/v1/wanted-ads/${wantedAdId}`,
  { method: "get" }
);

if(!error.value) {
  const response = data.value as getWantedAdReponse;
  wantedAd.value = response;
  wantedAd.value.updatedAt = `${response.updatedAtYear}年${parseInt(response.updatedAtMonth)}月${parseInt(response.updatedAtDay)}日`;
  wantedAd.value.applicationDeadline = `${response.applicationDeadlineYear}年${parseInt(response.applicationDeadlineMonth)}月${parseInt(response.applicationDeadlineDay)}日`;
}

const isAppliedModalOpen = ref(false);

const onApply = async () => {
  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/user/me/apply-job/" + wantedAdId,
    { method: "post" },
  );
  if (error.value) {
    commonAlert.showWarn("応募できませんでした。");
    return;
  }
  isAppliedModalOpen.value = true;
};

const links = [
  {icon: "i-heroicons-home-20-solid",to: "/home",},
  {label: "求人",to: "/wanted_ads",},
  {label: `求人詳細： ${wantedAd.value.title}`,},
];

</script>