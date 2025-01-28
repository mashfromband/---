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
      <!-- profile -->
      <div class=" bg-gray-50 dark:bg-gray-800/50 p-4">
        <div class="text-right">
          <UButton
            to="/home/profile/edit"
            color="white"
            icon="i-heroicons-pencil-square"
            size="md"
        />
          <div class="text-center">
            <span></span>
          </div>
          <div class="text-center text-gray-900 dark:text-white font-medium text-2xl break-words">
            {{ state.name }}
          </div>
        </div>
        <UCard class="mt-8 py-3"
          :ui="{
            rounded:'rounded-3xl'
          }"
        >
          <div v-if="state.bio" class="whitespace-pre-wrap break-words">
            {{ state.bio }}
          </div>
          <div v-else class="flex justify-center">
            <span>（自己紹介文が未設定です）</span>
          </div>
        </UCard>
      </div>
      <UDivider type="dashed" class="h-6" />
      <!-- learning -->
      <div class="lg:flex">
        <div class="lg:flex-1 bg-gray-50 dark:bg-gray-800/50 p-4 break-words break-all">
          <div class="flex justify-between mb-4">
            <div class="inline-flex items-center">
              <UIcon name="i-heroicons-rocket-launch" class="w-10 h-10"/>
              <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">学習目標</span>
            </div>
            <UButton
              to="/home/profile/edit/learning"
              color="white"
              icon="i-heroicons-pencil-square"
              size="md"
            />
          </div>
          <div v-if="apiResponse.purpose" class="whitespace-pre-wrap">
            {{ apiResponse.purpose }}
          </div>
          <div v-else>
            未設定
          </div>
        </div>
        <div class="lg:flex-1 lg:ml-4  bg-gray-50 dark:bg-gray-800/50 p-4 break-words break-all">
          <div class="flex justify-between mb-4">
            <div class="inline-flex items-center">
              <UIcon name="i-heroicons-book-open" class="w-10 h-10"/>
              <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">スキル・知識</span>
            </div>
            <UButton
              to="/home/profile/edit/learning"
              color="white"
              icon="i-heroicons-pencil-square"
              size="md"
            />
          </div>
          <p class="font-medium">
            目標とするスキル
          </p>
          <div v-if="apiResponse.targetSkill" class="whitespace-pre-wrap">
            {{ apiResponse.targetSkill }}
          </div>
          <div v-else>
            未設定
          </div>
          <p class="mt-4 font-medium">
            身につけたい知識
          </p>
          <div v-if="apiResponse.targetKnowledge" class="whitespace-pre-wrap">
            {{ apiResponse.targetKnowledge }}
          </div>
          <div v-else>
            未設定
          </div>
        </div>
      </div>
    </UPageCard>
    <!-- Stats-->

    <div class="col-span-2">
      <MemberStats :items="statsItemList" cols="2" />
    </div>
    <!-- SkillHistory-->
    <!-- QuestHistory-->
    <div class="col-span-2 lg:col-span-2">
      <div class="inline-flex px-4 pt-2 pb-6 bg-secondary-500 dark:bg-el_red:300 rounded-t-xl items-center">
        <span class="text-white font-bold text-2xl leading-6">クエストクリア履歴</span>
      </div>
      <UCard class="-mt-4 z-10 relative">
        <FeedQuestHistory :limit = "3" />
        <ElTextLink to="/home/record/quest">
          <div class="flex justify-end items-center mt-4">
            <span>過去のクエストクリア履歴を見る</span>
            <UIcon name="i-heroicons-chevron-right" class="ml-4 w-6 h-6"/>
          </div>
        </ElTextLink>
      </UCard>
    </div>
  </div>
  <div class="mt-4 lg:hidden">
    <UButton to="/home/" label="ホームに戻る" icon="i-heroicons-chevron-left" size="xl" color="white" />
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
  label: "プロフィール",
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
  { title: '総クリアクエスト数', change: userResultState.clearQuestCount, to:'/home/record/quest'},
  { title: '総獲得スコア', change: userResultState.totalScore, to:'/home/record'},
]);



//  ダミーデータ　消していい
const correntLevel = userResultState.level
const correntExp = 88
const prevLevelExp = 80
const nextLevelExp = 100

</script>
