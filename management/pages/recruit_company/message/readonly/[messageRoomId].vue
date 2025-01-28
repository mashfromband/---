<template>
  <UDashboardPanel grow>
    <UDashboardPanelContent>
      <UDashboardSection>
      <BreadcrumbLinks v-bind:links="links" />
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
            <UPageBody>
              <div class="mx-4 sm:px-0">
                <h3 class="text-2xl font-semibold leading-7">{{ otherPartyName }}</h3>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span>
                応募ステータス: {{ applyJobStatusString }}
                </span>
              </div>
              <div v-if="messageItemList.length" class="mt-6 border-t px-0 py-6 lg:p-6 bg-gray-50 dark:bg-gray-800/50">
                <template v-for="(message, index) in messageItemList" :key="index">
                  <!-- 送信文 -->
                  <div v-if="message.isSent" class="flex flex-col gap-2">
                    <UCard class="bg-el_yellow-50/50 lg:ml-60">
                      <div class="group relative">
                        <p class="mt-2 text-sm whitespace-pre-wrap">{{ message.body }}</p>
                      </div>
                    </UCard>
                    <div class="flex justify-end items-center text-xs mb-6">
                      {{ message.date }}
                    </div>
                  </div>
                  <!-- 受信文 -->
                  <div v-else class="flex flex-col gap-2 lg:mr-60">
                    <UCard>
                      <div class="group relative">
                        <p class="mt-2 text-sm whitespace-pre-wrap">{{ message.body }}</p>
                      </div>
                    </UCard>
                    <div class="flex items-center text-xs mb-6">
                      {{ message.date }}
                    </div>
                  </div>
                </template>
              </div>
              <div v-else class="h-[160px] flex items-center justify-center text-center">
                メッセージはありません。
              </div>
              <div class="flex justify-center">
                <UButton to="/recruit_company/message/readonly/" label="一覧に戻る" icon="i-heroicons-arrow-uturn-left" color="gray" size="xl" class="mt-6"/>
              </div>
            </UPageBody>
          </div>
          <!--右カラム-->
          <div class="flex flex-col col-span-full lg:col-start-5 gap-12">
            <!--広告-->
            <div class="hidden lg:flex justify-center">
              <!-- 求人広告　転用 -->
              <AdNinja sizeType="160x600" adScriptUrl="https://adm.shinobi.jp/s/2571148a51cdc71329df6329fafc3906" />
            </div>
          </div>
        </UPageGrid>
        <UModal v-model="iconDialogState.isOpen">
          <UPageCard>
            <template #header>
              <div class="flex justify-center">
                <span class="font-bold">応募ステータス</span>
              </div>
            </template>
            <div class="scroll-area flex justify-center">
              <USelect v-model="status" :options="applyStatusList" />
            </div>
            <template #footer>
              <div class="flex justify-evenly">
                <UButton @click="onSubmitIcon" label="設定する" size="xl" />
                <UButton @click="onCancelIcon" label="キャンセル" size="xl" color="white" />
              </div>
            </template>
          </UPageCard>
        </UModal>
      </UContainer>
    </UDashboardSection>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'company'
});

import * as dateFns from "date-fns";
import { ja as dateFnsJa } from "date-fns/locale";
import * as yup from "yup";
import type { paths } from "@/types/api/management";
import {
  getApplyJobStatusName,
  getAllApplyJopStatus,
} from "@/utils/apply_job_status";
import type { MessageRoomApplyJobStatus } from "@/utils/apply_job_status";

const links = [
  {
    icon: "i-heroicons-home-20-solid",
    to: "/home",
  },
  {
    label: "メッセージ",
  },
];

const route = useRoute();
const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();
const userInfo = useUserInfo();

type RoomResponse = paths["/rc/user/me/message-room/{messageRoomId}"]["get"]["responses"][200]["content"]["application/json"];
const thisRoom = ref<RoomResponse>();
type PostListResponse = paths["/rc/user/me/message-room/{messageRoomId}/post"]["get"]["responses"][200]["content"]["application/json"];
const roomPostList = ref<PostListResponse["posts"]>([]);

const applyJobStatus = ref<MessageRoomApplyJobStatus>("unknown");
const applyJobStatusString = ref<string>("");

const allApplyStatus = getAllApplyJopStatus();
const applyStatusList = [...allApplyStatus.values()];
const status = ref<string>("");

const onOpenIconDialog = () => {
  iconDialogState.isOpen = true;
};

const onSubmitIcon = async () => {
  iconDialogState.isOpen = false;

  let changeApplyStatus: MessageRoomApplyJobStatus = "unknown";
  for (const [key, value] of allApplyStatus) {
    if (value === status.value) {
      changeApplyStatus = key;
    }
  }

  type ApiRequest = paths["/rc/user/me/message-room/{messageRoomId}/status"]["put"]["requestBody"]["content"]["application/json"];
  const requestBody: ApiRequest = {
    applyJobStatus: changeApplyStatus,
  };
  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/rc/user/me/message-room/" + route.params.messageRoomId + "/status",
    {
      method: "put",
      body: requestBody,
    },
  );
  if (error.value) {
    commonAlert.showWarn("変更に失敗しました。");
    return;
  }

  formState.message = "";
  commonAlert.showSuccess("変更しました。");
  await loadRoom();
  await loadRoomPosts();
};

const onCancelIcon = () => {
  iconDialogState.isOpen = false;
};

const iconDialogState = reactive({
  isOpen: false,
});

const loadRoom = async () => {
  const { data } = await useCallApi<RoomResponse>(
    apiEndpoint.value.endpoint + "/v1/rc/apply-for-job/message-room/" + route.params.messageRoomId + "/readonly",
    { method: "get" },
  );
  if (!data.value) {
    return;
  }
  thisRoom.value = data.value;
  applyJobStatus.value = data.value.applyJobStatus;
  applyJobStatusString.value = getApplyJobStatusName(data.value.applyJobStatus) || "";
  status.value = getApplyJobStatusName(data.value.applyJobStatus) || "unknown";
};

const loadRoomPosts = async () => {
  const { data } = await useCallApi<PostListResponse>(
    apiEndpoint.value.endpoint + "/v1/rc/apply-for-job/message-room/" + route.params.messageRoomId + "/post/readonly",
    {
      method: "get",
      query: { sort: "id" },
    },
  );
  if (!data.value) {
    return;
  }
  roomPostList.value = data.value.posts;
};

await loadRoom();
await loadRoomPosts();

const otherPartyName = computed(() => {
  return !thisRoom.value ? ""
    : thisRoom.value.isOwner ? thisRoom.value.invitedRecruitCompanyName || thisRoom.value.invitedUserName
    : thisRoom.value.ownerRecruitCompanyName || thisRoom.value.ownerUserName;
});

const messageItemList = computed(() => {
  const getDateString = (epoch: number) => isNaN(epoch) ? "" : dateFns.format(new Date(epoch), "YoModo(eee)HH:mm", { locale: dateFnsJa });
  return roomPostList.value.map(room => ({
    date: getDateString(Number(room.postUnixTime) * 1000),
    body: room.postBody,
    isSent: room.postUserId === userInfo.userId,
  }));
});

const formState = reactive({
  message: "",
});
const formSchema = (() => {
  const { object, string } = yup;
  return object({
    message: string().max(1000, "メッセージは1000文字以内です"),
  });
})();

const onError = () => {
  commonAlert.showWarn("入力項目に不備があります。");
};

const onSubmit = async () => {
  type ApiRequest = paths["/rc/user/me/message-room/{messageRoomId}/post"]["post"]["requestBody"]["content"]["application/json"];
  const requestBody: ApiRequest = {
    postBody: formState.message,
  };
  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/rc/user/me/message-room/" + route.params.messageRoomId + "/post",
    {
      method: "post",
      body: requestBody,
    },
  );
  if (error.value) {
    commonAlert.showWarn("送信に失敗しました。");
    return;
  }

  formState.message = "";
  commonAlert.showSuccess("メッセージを送信しました。");
  void loadRoomPosts();
};
</script>
