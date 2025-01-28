<template>
  <div v-if="isPerfect"><Confetti :size="2"/></div>
  <UPage>
    <PageheaderLogoCard :color="isPerfect ? 'default' : 'gray'" />
    <UContainer>
      <UPageHero
        align="center"
        :links="[{ label: '次のジャンルを選択', to:'/genre', size: 'lg', trailingIcon: 'i-heroicons-arrow-right-20-solid' }]"
        class="relative bg-white dark:bg-gray-900 rounded-3xl"
        :ui="{
          wrapper:'bg-none -mt-6 lg:-mt-20 lg:pb-0'
        }"
      >
        <template #title>
          <div v-if="isPerfect">クエストクリア</div>
          <div v-else>クエスト失敗</div>
          <!-- 広告SP -->
          <div class="lg:hidden flex justify-center my-6">
            <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/36422169d483301aaf3d6d58549d4998" />
          </div>
        </template>
        <template #description>
          <div v-if="isPerfect">おめでとうございます</div>
          <div v-else>達成まであと一歩です</div>
        </template>
      </UPageHero>
      <UPageBody prose class="flex items-center justify-center">
        <div class="lg:flex justify-between w-full">
          <!-- 広告 -->
          <div class="justify-center mr-6 hidden xl:flex">
            <AdNinja sizeType="160x600" adScriptUrl="https://adm.shinobi.jp/s/b4cb33de39364dc8c3d1fac722c9e3fa" />
          </div>

          <div class="max-w-screen-lg w-full">
          <LinearProgress :value="gradeProgressValue" :max="totalMissionNum" size="2xl" :value-class="gradeProgressColor">
            <template #indicator="{ percent }">
              <div class="text-right" :style="{ width: `${percent}%` }">
                <span v-if="isPerfect" class="text-red-500 font-bold whitespace-nowrap">🔥Congrats!!</span>
                <span v-else-if="userCorrectNum / totalMissionNum > 0.5" class="text-el_orange-500 font-bold whitespace-nowrap">Good</span>
                <span v-else-if="userCorrectNum > 0" class="text-el_orange-500 font-bold whitespace-nowrap">Try Again</span>
                <span v-else class="text-gray-500 font-bold whitespace-nowrap">Oh well...</span>
              </div>
            </template>
          </LinearProgress>
          <div class="py-6">
          <QuestGradeItems
            :items="gradeItemList"
            :is-perfect="isPerfect"
            :animation-duration="enableAnimation ? gradeAnimationDuration : undefined"
          />
          </div>
          <UPageCard
            v-for="(message, index) in messageList"
            :key="index"
            :ui="{
              base:'overflow-hidden',
              divide:'divide-none',
              header:{base:'',background:'bg-primary-500', padding:'px-0 py-3 sm:px-0'},
            }"
            :class="{
              'opacity-100 translate-y-0': messageFlagList[index],
              'opacity-0 translate-y-8': !messageFlagList[index],
            }"
            class="transition-opacity transition-transform duration-1000"
          >
            <template #header />
            {{ message }}
          </UPageCard>
          </div>

          <!-- 広告 -->
          <div class="justify-center ml-6 hidden lg:flex">
            <AdNinja sizeType="160x600" adScriptUrl="https://adm.shinobi.jp/s/75a443f180b5f91b5af63e133f9ae9f6" />
          </div>
        </div>
      </UPageBody>
      <!-- 広告SP -->
      <div class="lg:hidden flex justify-center">
        <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/f2bb5a7796de248872515e86fa7aa567" />
      </div>
    </UContainer>
  </UPage>
</template>

<script setup lang="ts">
import type { paths } from "@/types/api/contents";

type SuccessGetMissionResultResponse = paths["/quest/{questId}/session/{sessionToken}/result"]["get"]["responses"][200]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();

const route = useRoute();
const questId = route.params.questId as string;
const missionToken = route.params.missionToken as string;

const enableAnimation = true; // アニメーション ON / OFF
const isPerfect = ref(false);
const totalMissionNum = ref(0);
const userCorrectNum = ref(0);
const totalScore = ref(0);
const userScore = ref(0);
const addPoint = ref(0);
const totalPoint = ref(0);
const pointBonusPer = ref(0);
const messages = ref<string[]>([]);

const gradeAnimationDuration = 2000; // 成績アニメーション時間 ms
const gradeAnimation = (() => {
  let requestId = 0;
  interface AnimationCallbackParams {
    duration: DOMHighResTimeStamp;
    elapsed: DOMHighResTimeStamp;
  }
  const callbackList: ((params: AnimationCallbackParams) => void)[] = [];

  const addCallback = (callback: typeof callbackList[number]) => {
    callbackList.push(callback);
  };

  const startAnimation = () => {
    let started: DOMHighResTimeStamp | undefined;
    let lastCalled: DOMHighResTimeStamp = 0;
    let frames = 0;

    const runCallbacks = (timestamp: DOMHighResTimeStamp, elapsed: DOMHighResTimeStamp) => {
      for (const callback of callbackList) {
        callback({ duration: gradeAnimationDuration, elapsed });
      }
      lastCalled = timestamp;
      frames++;
    };

    const callback = (timestamp: DOMHighResTimeStamp) => {
      if (started === undefined) {
        started = timestamp;
        console.debug(`[GradeAnimation] started at ${Date.now()} (${started})`);
      } else {
        const elapsed = timestamp - started;
        if (elapsed >= gradeAnimationDuration) {
          runCallbacks(timestamp, gradeAnimationDuration);
          requestId = 0;
          console.debug(`[GradeAnimation] finished at ${Date.now()} (${timestamp}), ${frames} frames`);
          return;
        }
        runCallbacks(timestamp, elapsed);
      }
      requestId = requestAnimationFrame(callback);
    };
    requestId = requestAnimationFrame(callback);
  };

  onBeforeUnmount(() => {
    if (requestId) {
      cancelAnimationFrame(requestId);
      console.debug("[GradeAnimation] canceled at", Date.now());
    }
  });

  return {
    add: addCallback,
    start: startAnimation,
  };
})();

const { data: apiResponse, error } = await useCallApi<SuccessGetMissionResultResponse>(
  apiEndpoint.value.endpoint + "/v1/quest/" + questId + "/session/" + missionToken + "/result",
  {
    method: "get",
  }
);
if (!apiResponse || !apiResponse.value) {
  if(error.value && error.value.statusCode == 404) {
    useCommonAlert().showNotFoundWarn();
  } else {
    useCommonAlert().showWarn("エラーが発生しました", "/");
  }
} else {
  isPerfect.value = apiResponse.value.isPerfect;
  totalMissionNum.value = apiResponse.value.totalMissionNum;
  userCorrectNum.value = apiResponse.value.userCorrectNum;
  totalScore.value = apiResponse.value.totalScore;
  userScore.value = apiResponse.value.userScore;
  addPoint.value = apiResponse.value.addPoint;
  totalPoint.value = apiResponse.value.totalPoint;
  pointBonusPer.value = apiResponse.value.pointBounsPer;
  messages.value = apiResponse.value.messages;

  useUserInfo().setUserLevel(apiResponse.value.userLevel);
}

// 線形プログレスバー
const gradeProgressValue = ref(userCorrectNum.value);
const gradeProgressColor = computed(() => {
  return isPerfect.value ? "bg-gradient-to-r from-secondary-500 to-el_yellow-400" : "bg-el_orange-600";
});

if (enableAnimation) {
  gradeProgressValue.value = 0;
  gradeAnimation.add(({ duration, elapsed }) => {
    const ratio = elapsed / duration;
    const progress = ratio * userCorrectNum.value;
    if (gradeProgressValue.value !== progress) {
      gradeProgressValue.value = progress;
    }
  });
}

// GradeItems コンポーネント
const gradeItemList = ref([
  {
    title: "正解数",
    value: userCorrectNum.value,
    denominator: totalMissionNum.value,
    caption: "問",
  },
  {
    title: "得点",
    value: userScore.value,
    denominator: totalScore.value,
    caption: "点",
  },
  {
    title: "獲得EFO",
    value: addPoint.value,
    denominator: addPoint.value || 100,
    caption: `+${pointBonusPer.value}%ボーナス`,
  },
]);

// 獲得スキル・称号
const messageList = computed(() => [
  ...messages.value,
  "獲得称号：なし",
]);
const messageFlagList = ref(new Array<boolean>(messageList.value.length).fill(true));
if (enableAnimation) {
  messageFlagList.value.fill(false);
}

const messageAnimation = (() => {
  const initialWaits = 500;
  const interval = 200;
  let timerId = 0;
  let currIndex = 0;

  const enableFlag = () => {
    messageFlagList.value[currIndex] = true;
    currIndex++;
    return currIndex < messageFlagList.value.length;
  };

  const startAnimation = () => {
    timerId = window.setTimeout(() => {
      console.debug("[MessageAnimation] started at", Date.now());
      timerId = 0;
      if (!enableFlag()) {
        console.debug("[MessageAnimation] finished at", Date.now());
        return;
      }
      timerId = window.setInterval(() => {
        if (!enableFlag()) {
          clearInterval(timerId);
          timerId = 0;
          console.debug("[MessageAnimation] finished at", Date.now());
        }
      }, interval);
    }, initialWaits);
  };

  onBeforeUnmount(() => {
    if (timerId) {
      clearTimeout(timerId);
      console.debug("[MessageAnimation] canceled at", Date.now());
    }
  });

  return {
    start: startAnimation,
  };
})();

onMounted(() => {
  if (enableAnimation) {
    gradeAnimation.start();
    messageAnimation.start();
  }
});
</script>
