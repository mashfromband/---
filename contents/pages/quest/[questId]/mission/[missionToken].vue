<template>
<UContainer
  :ui="{
    padding: 'px-0 sm:px-0'
  }"
>
  <UPageGrid
    :ui="{
      wrapper:'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-12'
    }"    
  >
    <!--中央カラム-->
    <div class="flex flex-col col-span-full lg:col-span-4">

      <PageheaderGeneral v-if="apiResponse" headline="クエスト" :title=apiResponse.questName />
      <div class="px-2 lg:p-6 bg-gray-50 dark:bg-gray-800/50">
        <QuestMissionProgress v-if="apiResponse" :totalMissions="apiResponse.totalMissions" :currentMissionIndex="apiResponse.currentMissionIndex" />
        <UPage>
          <UPageBody prose
            :ui="{
              wrapper: 'mt-0 lg:mt-8 pb-0'
            }"
          >
            <UPageCard
              :ui="{
                divide: 'divide-dashed'
              }"
            >
              <template #header>
                <QuestMissionQuestion />
                <div class="lg:hidden flex justify-center">
                  <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/ab720266a0b0c0184b1e5d8c70b70c8d" />
                </div>
              </template>
              <UPageGrid
                :ui="{
                  wrapper: 'sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6'
                }"
              >
                <QuestMissionAnswerOneChoice />
              </UPageGrid>
                <div class="mt-4 lg:mt-8 lg:flex lg:justify-center">
                  <div>
                    <UButton class="lg:min-w-64" v-if="isDisplayAnswerButton" v-on:click="onAnswer" block size="xl" icon="i-heroicons-pencil-square">解答する</UButton>
                  </div>
                </div>
            </UPageCard>
            <div class="flex justify-end mt-4">
              <UButton v-if="isDisplayAnswerButton" label="クエストを中止する" v-on:click="onCancelMissionClick" size="xl" color="gray" icon="i-heroicons-x-mark" />
            </div>
          </UPageBody>
        </UPage>
      </div>

    </div>
    <!--右カラム-->
    <div class="flex flex-col col-span-full lg:col-start-5 gap-12">

      <!--広告-->
      <div class="hidden lg:flex justify-center">
        <!--非表示-->
        <AdNinja sizeType="160x600" adScriptUrl="https://adm.shinobi.jp/s/d9ffefa952878a5fb1263c4ff306bfe2" />
      </div>
      <!-- 広告SP -->
      <div class="lg:hidden flex justify-center">
        <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/4b2791e4d6aa75578543de24dab90a42" />
      </div>
    </div>
  </UPageGrid>
  <UModal v-model="isOpenCorrect" prevent-close
      :ui="{
        width:'sm:max-w-4xl'
      }"
  >
    <UPageCard>
      <template #header>
        <UPageHero align="center"
          :ui="{ wrapper: 'py-0 sm:py-0', description: 'w-full'}"
        >
          <template #title>
            {{ isCorrectMsg }} 
          </template>
          <template #icon>
            <UIcon v-if="correctIcon" name="i-heroicons-check-badge" class="w-20 h-20 text-green-600 dark:text-green-300" />
            <UIcon v-else name="i-heroicons-x-circle" class="w-20 h-20 text-secondary-500 dark:text-secondary-500" />
          </template>
          <template #description>
            <div class="mt-4">
              <div class="flex mb-2">
                <span class="w-6/12 text-right">答え</span><span class="ml-4 text-left font-bold text-xl text-green-600 dark:text-green-300"> {{ correctMsg }}</span>
              </div>
              <div class="flex mb-2">
                <span class="w-6/12 text-right">あなたの解答</span><span class="ml-4 text-left font-bold text-xl"> {{ selectOption }}</span>
              </div>
            </div>
          </template>
        </UPageHero>
      </template>
      <template #description>
        <UAccordion :items="commentaryAcc" size="xl" color="gray" variant="ghost">
          <template #commentary>
            <UPageBody prose
              :ui="{
                wrapper: 'mt-0 pb-0',
              }"
            >
              <QuestMissionCommentary />
            </UPageBody>
            <!-- 広告 -->
            <div class="hidden lg:flex justify-center">
              <AdNinja sizeType="468x60" adScriptUrl="https://adm.shinobi.jp/s/fca53a34d108c94f843ba4036dac532e" />
            </div>
            <!-- 広告SP -->
            <div class="lg:hidden flex justify-center">
              <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/2e56b1e18d6b2bc5820f598ea4b39b16" />
            </div>
          </template>
        </UAccordion>
      </template>
      <div class="next_mission_button" v-if="missionNextButtonState.isDisplay">
        <UFormGroup>
          <div v-if="enableRetryAtWrongAnswer" class="flex justify-between">
            <UButton v-on:click="onRetryMissionClick" size="xl" icon="i-heroicons-chevron-left">戻る</UButton>
            <UButton v-on:click="onNextMissionClick" size="xl" icon="i-heroicons-chevron-right" trailing >次へ</UButton>
          </div>
          <div v-else class="flex justify-end">
            <UButton v-on:click="onNextMissionClick" size="xl" icon="i-heroicons-chevron-right" trailing >次へ</UButton>
          </div>
        </UFormGroup>
      </div>
      <template #footer>
        <div class="hidden lg:flex justify-center">
          <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/2e417964b2a19f4a343f3c656b1268cb" />
        </div>
        <!-- 広告SP -->
        <div class="lg:hidden flex justify-center">
          <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/dffb8a229269e54b0260fea393d386af" />
        </div>
      </template>
    </UPageCard>
  </UModal>

  <UModal v-model="isCancelQuestModalOpen">
    <UCard>
      <UAlert
        icon="i-heroicons-exclamation-triangle"
        color="secondary"
        description="本当にクエストを中止しますか？"
        :ui="{
          description: 'text-secondary-500'
        }"
      />
      <template #footer>
        <div class="flex justify-center">
          <UButton label="中止します" v-on:click="onCancelQuest" size="lg" color="secondary" class="mr-4"
            :ui="{
              variant:{
                solid:'text-white'
              }
            }"
          />
          <UButton label="閉じる" v-on:click="onCloseCancelMission"  size="lg" color="gray"/>
        </div>
      </template>
    </UCard>
  </UModal>

</UContainer>
</template>

<script setup lang="ts">
import type { UnwrapRef } from "vue";
import type { paths } from "@/types/api/contents";

type SuccessGetSessionResponse =
  paths["/quest/{questId}/session/{sessionToken}"]["get"]["responses"][200]["content"]["application/json"];

type AnswertRequestType =
  paths["/quest/{questId}/session/{sessionToken}"]["post"]["requestBody"]["content"]["application/json"];
type AnswertResponseType =
  paths["/quest/{questId}/session/{sessionToken}"]["post"]["responses"][200]["content"]["application/json"];

type OptionType = {
  quest_type: string,
  options: any[],
}

const commentaryAcc = [{
  label: '解説',
  icon: 'i-heroicons-book-open',
  defaultOpen: false,
  slot: 'commentary'
}]

const route = useRoute();
const questId = route.params.questId as string;
const missionToken = route.params.missionToken as string;

const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();

const questionHtml = useQuestionBodyHtml();
const commentaryState = useMissionCommentary();
const missionNextButtonState = useMissionNextButton();

const isDisplayAnswerButton = ref(true);
const isOpenCorrect = ref(false);
const isCorrectMsg = ref("");
const correctMsg = ref("");
const correctIcon = ref(false);

const isFinished = ref(false);

const isCancelQuestModalOpen = ref(false);

const selectOption = ref();

const enableRetryAtWrongAnswer = ref<boolean>(true);
const isRetryMission = ref<boolean>(false);
const currentMissionIndex = ref<number>(0);

const answerType = ref("");
const answerList = ref<any[]>([]);

const questMissionCdnBaseUrl = useQuestMissionCdnBaseUrl();
const replaceImageUrl = (html: string) => {
  const replacedHtml = html.replaceAll("[[[IMG_SRC_TOP_URL]]]", questMissionCdnBaseUrl.value.baseUrl);
  return replacedHtml;
}

const loadQuestion = async () => {
  const url = apiEndpoint.value.endpoint + "/" + apiResponse.value!.questionPath;
  const response = await useCallApi<string>(url, {
    method: "get",
    headers: {},
  });
  const body = response.data.value;
  if (response.error.value || !body) {
    // TODO: エラー処理
    return;
  }
  questionHtml.value.body = replaceImageUrl(body);
}

const loadOption = async () => {
  const url = apiEndpoint.value.endpoint + "/" + apiResponse.value!.optionPath;
  const response = await useCallApi<OptionType>(url, {
    method: "get",
    headers: {},
  });
  const body = response.data.value;
  if (response.error.value || !body) {
    // TODO: エラー処理
    return;
  }

  answerType.value = body.quest_type;
  answerList.value = body.options;
  switch (answerType.value) {
    case "one_choice": {
      const answerOneChoice = useMissionAnswerOneChoice();
      answerOneChoice.value.select = "";
      const options: any[] = [];
      for (const answer of answerList.value) {
        options.push({
          label: replaceImageUrl(answer.option_html),
          value: answer.id.toString(),
        });
      }
      answerOneChoice.value.options = options;
      break;
    }
    default:
      break;
  }
}

const onAnswer = async () => {
  const answerOneChoice = useMissionAnswerOneChoice();
  if (!answerOneChoice.value.select) {
    commonAlert.showWarn("未解答です。解答してください。");
    return;
  }

  let answerIndex = 1;
  let isValidAnswer = false;
  for (const answer of answerList.value) {
    if (answer.id === answerOneChoice.value.select) {
      isValidAnswer = true;
      break;
    }
    answerIndex++;
  }
  if (!isValidAnswer) {
    commonAlert.showWarn("もう一度回答し直してください。");
    return;
  }

  isDisplayAnswerButton.value = false;

  const url = apiEndpoint.value.endpoint + "/v1/quest/" + questId + "/session/" + missionToken; // TODO: 外に出す
  const requestBody: AnswertRequestType = {
    answer: answerIndex.toString(),
  };
  const response = await useCallApi<AnswertResponseType>(url, {
    method: "post",
    body: requestBody,
  });

  const body = response.data.value;
  if (!body) {
    sessionErrorHandler(response.error);
    return;
  }

  isFinished.value = body.isFinished;

  if (body.isCorrect) {
    isCorrectMsg.value = "正解";
    correctIcon.value = true;
    enableRetryAtWrongAnswer.value = false;
  }
  else {
    isCorrectMsg.value = "不正解";
    correctIcon.value = false;
    enableRetryAtWrongAnswer.value = body.disableBackWrongAnswer ? false : true;
  }
  correctMsg.value = answerList.value[parseInt(body.correctAnswer) - 1].id;
  isOpenCorrect.value = true;
  selectOption.value = answerOneChoice.value.select;

  const commenctaryUrl = apiEndpoint.value.endpoint + "/" + body.commentaryPath;
  const commentaryResponse = await useCallApi<UnwrapRef<typeof commentaryState>["commentary"]>(
      commenctaryUrl,
    {
      method: "get",
      headers: {},
    }
  );
  const commentary = commentaryResponse.data.value;
  if (commentaryResponse.error.value || !commentary) {
    // TODO: エラー処理
    return;
  }
  commentaryState.value.commentary = replaceImageUrl(commentary);
  missionNextButtonState.value.isDisplay = true;
}


const onNextMissionClick = async () => {
  isOpenCorrect.value = false;
  correctMsg.value = "";
  isCorrectMsg.value = "";
  commentaryState.value.commentary = "";
  missionNextButtonState.value.isDisplay = false;

  if (isFinished.value) {
    navigateTo({
      name: "quest-questId-mission-result-missionToken",
      params: {
        questId: questId,
        missionToken: missionToken,
      }
    });
  }
  else {
    isRetryMission.value = false;
    currentMissionIndex.value += 1;
    const { error } = await sessionRefresh();
    if (error.value) {
      sessionErrorHandler(error);
      return;
    }
    await loadQuestion();
    await loadOption();
    
    isDisplayAnswerButton.value = true;
    window.scrollTo(0, 0);
  }
}

const onRetryMissionClick = async () => {
  if (!enableRetryAtWrongAnswer.value) {
    return; // MEMO: とりあえずなにもしない
  }

  isOpenCorrect.value = false;
  correctMsg.value = "";
  isCorrectMsg.value = "";
  commentaryState.value.commentary = "";
  missionNextButtonState.value.isDisplay = false;
  isRetryMission.value = true;

  const { error } = await sessionRefresh();
  if (error.value) {
    sessionErrorHandler(error);
    return;
  }
  await loadQuestion();
  await loadOption();

  isDisplayAnswerButton.value = true;
  window.scrollTo(0, 0);
}

const onCancelMissionClick = () => {
  isCancelQuestModalOpen.value = true;
}

const onCancelQuest = async () => {
  isCancelQuestModalOpen.value = false;

  const url = apiEndpoint.value.endpoint + "/v1/quest/" + questId + "/session/" + missionToken; // TODO: 外に出す
  const response = await useCallApi<AnswertResponseType>(url, {
    method: "delete",
  });

  await navigateTo({ name: "quest-questId", params: { questId: questId } });
}

const onCloseCancelMission = () => {
  isCancelQuestModalOpen.value = false;
}


const apiResponse = ref<SuccessGetSessionResponse>();

const sessionRefresh = async () => {
  const { data, error } = await useCallApi<SuccessGetSessionResponse>(
    apiEndpoint.value.endpoint + "/v1/quest/" + questId + "/session/" + missionToken,
    {
      method: "get",
      query: {
        isRetryMission: isRetryMission.value,
        currentMissionIndex: currentMissionIndex.value,
      },
    },
  );
  if (data.value) {
    apiResponse.value = data.value;
  }
  return { error };
};

const sessionErrorHandler = (error: Awaited<ReturnType<typeof sessionRefresh>>["error"]) => {
  commonAlert.showWarn(
    error.value?.statusCode === 404 ? "時間切れです。" : "エラーが発生しました。",
    "/quest/" + questId);
};

{
  const { error } = await sessionRefresh();
  if(apiResponse.value && !error.value) {
    currentMissionIndex.value = apiResponse.value!.currentMissionIndex;
    await loadQuestion();
    await loadOption();
  } else if (error.value) {
    if(error.value.statusCode == 404) {
      commonAlert.showNotFoundWarn();
    }
  }
}
</script>
