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
              <UForm
                :state="formState"
                :schema="formSchema"
                @submit="onSubmit"
                @error="onError"
              >
                <UFormGroup
                  name="message"
                  class="grid gap-2 mb-6"
                  :ui="{ container: '' }"
                >
                <UInput placeholder="ユーザーID" v-model="formState.userId">
                </UInput>
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
        </UPageGrid>
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
import { getApplyJobStatusName } from "@/utils/apply_job_status";
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

const applyJobStatus = ref<MessageRoomApplyJobStatus>();

const loadRoom = async () => {
  const { data } = await useCallApi<RoomResponse>(
    apiEndpoint.value.endpoint + "/v1/rc/user/me/message-room/" + route.params.messageRoomId,
    { method: "get" },
  );
  if (!data.value) {
    return;
  }
  thisRoom.value = data.value;
  applyJobStatus.value = data.value.applyJobStatus;
};

const loadRoomPosts = async () => {
  const { data } = await useCallApi<PostListResponse>(
    apiEndpoint.value.endpoint + "/v1/rc/user/me/message-room/" + route.params.messageRoomId + "/post",
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
  userId: "",
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
  type ApiRequest = paths["/rc/offer"]["post"]["requestBody"]["content"]["application/json"];
  const requestBody: ApiRequest = {
    userId: formState.userId,
    postBody: formState.message,
  };
  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/rc/offer",
    {
      method: "post",
      body: requestBody,
    },
  );
  if (error.value) {
    if (error.value.data && error.value.data.reason) {
      commonAlert.showWarn(error.value.data.reason);
    }
    else {
      commonAlert.showWarn("送信に失敗しました。");
    }
    return;
  }

  formState.userId = "";
  formState.message = "";
  commonAlert.showSuccess("オファーをユーザーに送信しました。", "/recruit_company/message");
};
</script>
