<template>
  <div class="grid grid-cols-2 gap-12">
    <div class="flex col-span-2 mt-4 w-full justify-center z-10">
      <!-- Avator -->
      <UAvatar
        :src="userIconUrl"
        :alt="state.name"
        size="3xl"
        :ui="{ rounded: 'rounded' }"
      />
    </div>
    <UPageCard
      class="overflow-hidden col-span-2 -mt-24 lg:-mt-24"
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
            <UIcon name="i-heroicons-presentation-chart-line" class="w-10 h-10"/>
            <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">総合成績</span>
          </div>
        </div>
      </div>
      <!-- Stats-->
      <div class="col-span-2">
        <MemberStats :items="[ { title: 'レベル', change: userResultState.level } ]" />
        <MemberStats :items="statsItemList" cols="2" type="none"/>
      </div>
    </UPageCard>
  </div>
  <div class="mt-4 lg:hidden">
    <UButton to="/home/profile/" label="プロフィールに戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
  </div>
</template>


<script setup lang="ts">
import type { paths } from "@/types/api/contents";

definePageMeta({
  layout: 'profile'
})

const state = reactive({
  name: 'Realize Learning',
  bio: '',
})

type ApiSuccessResponse =
  paths["/user/me"]["get"]["responses"]["200"]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();

const { data: response, error } = await useCallApi(
  apiEndpoint.value.endpoint + "/v1/user/me",
  {
    method: "get",
  }
);

const apiResponse = ref<ApiSuccessResponse>(response.value as ApiSuccessResponse);
state.name = apiResponse.value.nickname;
state.bio = apiResponse.value.selfIntroduction;

const { setUserId, setNickName, setMailAddress, setIconUrl, setUserLevel } = useUserInfo();
setUserId(apiResponse.value.id);
setNickName(apiResponse.value.nickname);
setMailAddress(apiResponse.value.mailAddress);
setIconUrl(apiResponse.value.userIconPath);
setUserLevel(apiResponse.value.userLevel);


// Avator
const userIconUrl = useUserInfo().iconUrl;

// Check Img
const checkImageUrl = useStaticCdnUrl("/img/parts_2.png").staticCdnUrl;


const links: BreadcrumbLinkItem[] = [
{
  to: "/home",
  icon: "i-heroicons-home-20-solid",
},
{
  label: "成績",
},
];

type ApiResponse = paths["/user/me/results"]["get"]["responses"][200]["content"]["application/json"];
const userResultState = reactive({
  level:0, 
  totalScore:0,
  point:0,
  playQuestCount:0,
  clearQuestCount:0,
  totalAnswerCount:0,
  totalCorrectAnswerCount:0
});
const { data:userResultResponse } = await useCallApi<ApiResponse>(
  useApiEndpoint().value.endpoint + "/v1/user/me/results",
  { method: "get" },
);
if(userResultResponse.value) {
  userResultState.level = userResultResponse.value.level;
  userResultState.totalScore = userResultResponse.value.totalScore;
  userResultState.point = userResultResponse.value.point;
  userResultState.playQuestCount = userResultResponse.value.playQuestCount;
  userResultState.clearQuestCount = userResultResponse.value.clearQuestCount;
  userResultState.totalAnswerCount = userResultResponse.value.totalAnswerCount;
  userResultState.totalCorrectAnswerCount = userResultResponse.value.totalCorrectAnswerCount;
}

const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);
onMounted(() => {
  breadcrumblinks.value = [...links];
});


const statsItemList = ref([
  { title: '総クリアクエスト数', change: userResultState.clearQuestCount ,unit:userResultState.playQuestCount, caption:'回中', to : '/home/record/quest'},
  { title: '総獲得EFO', change: userResultState.point, to : '/home/efo' },
  { title: '総正解回答数', change: userResultState.totalCorrectAnswerCount ,unit:userResultState.totalAnswerCount, caption:'問中' },
  { title: '総獲得スコア', change: userResultState.totalScore },
]);

</script>
