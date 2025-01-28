<template>
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
            <UButton to="/home/message" label="一覧に戻る" icon="i-heroicons-arrow-uturn-left" color="gray" size="xl" class="mt-6"/>
          </div>
          <UForm
            :state="formState"
            :schema="formSchema"
            class="mt-6 border-t"
            @submit="onSubmit"
            @error="onError"
          >
            <UFormGroup
              name="message"
              class="grid gap-2 mb-6"
              :ui="{ container: '' }"
            >
            <div class="lg:flex lg:justify-between lg:items-center lg:gap-6">
              <UTextarea
                v-model="formState.message"
                :rows="8"
                size="md"
                placeholder="最大1000文字まで入力可能です"
                class="flex-1 mt-6"
              />
              <div class="flex lg:block justify-center">
                <SubmitButton
                  label="送信する"
                  size="xl"
                  icon="i-heroicons-chevron-right"
                  trailing
                  :disabled="!formState.message"
                  class="mt-6"
                />
              </div>
            </div>
            </UFormGroup>
          </UForm>
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
  </UContainer>
</template>

<script setup lang="ts">
import * as dateFns from "date-fns";
import { ja as dateFnsJa } from "date-fns/locale";
import * as yup from "yup";
import type { paths } from "@/types/api/contents";

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

type RoomResponse = paths["/user/me/message-room/{messageRoomId}"]["get"]["responses"][200]["content"]["application/json"];
const thisRoom = ref<RoomResponse>();
type PostListResponse = paths["/user/me/message-room/{messageRoomId}/post"]["get"]["responses"][200]["content"]["application/json"];
const roomPostList = ref<PostListResponse["posts"]>([]);

const loadRoom = async () => {
  const { data } = await useCallApi<RoomResponse>(
    apiEndpoint.value.endpoint + "/v1/user/me/message-room/" + route.params.messageRoomId,
    { method: "get" },
  );
  if (!data.value) {
    return;
  }
  thisRoom.value = data.value;
};

const loadRoomPosts = async () => {
  const { data } = await useCallApi<PostListResponse>(
    apiEndpoint.value.endpoint + "/v1/user/me/message-room/" + route.params.messageRoomId + "/post",
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
  type ApiRequest = paths["/user/me/message-room/{messageRoomId}/post"]["post"]["requestBody"]["content"]["application/json"];
  const requestBody: ApiRequest = {
    postBody: formState.message,
  };
  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/user/me/message-room/" + route.params.messageRoomId + "/post",
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
