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
        <PageheaderGeneral title="メッセージ" />
        <div class="px-0 py-6">
        <!-- 広告SP -->
        <div class="lg:hidden flex justify-center mb-6">
          <!-- 求人広告　転用 -->
          <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/78c9374e1d890df26bcb4bc138e4ac9b" />
        </div>
        <div v-if="roomItemList.length" class="flex flex-col gap-2">
          <NuxtLink v-for="message in roomItemList" :key="message.id" :to="'/home/message/' + message.id">
            <UCard
              :ui="{
                base:'h-48 lg:h-auto hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
              }"
            >
              <div class="flex justify-between">
                <div class="group relative w-full">
                  <div class="lg:flex lg:justify-between" :class="{'font-semibold': !message.read}">
                    <UChip v-if="!message.read" size="xl">
                      <div class="text-xl line-clamp-1 mr-2">
                        {{ message.title }}
                      </div>
                    </UChip>
                    <div v-else>
                      {{ message.title }}
                    </div>
                    <div class="flex items-center text-xs leading-8">
                      {{message.date}}
                    </div>
                  </div>
                  <p class="mt-2 line-clamp-4 lg:line-clamp-1 text-sm">{{ message.detail }}</p>
                </div>
                <div class="content-center ml-6">
                  <UButton
                    icon="i-heroicons-trash"
                    size="sm"
                    variant="link"
                    @click.prevent="onDeleteModalOpen(message)"
                  />
                </div>
              </div> 
            </UCard>
          </NuxtLink>
        </div>
        <div v-else class="h-[160px] flex items-center justify-center text-center">
          メッセージはありません。
        </div>
        <Pagination v-bind="pagination" />

        </div>
        <!-- 広告 -->
        <div class="hidden lg:flex justify-center">
          <!-- 求人広告　転用 -->
          <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/3d8d90888d4aa58efb567d498ba86db1" />
        </div>
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

  <UModal v-model="isDeleteModalOpen" @close="onDeleteModalClose">
    <UCard>
      <UAlert title="削除" :ui="{ inner:'flex justify-center', title:'text-gray-900 font-bold text-xl' }"/>
      <div class="leading-6 my-4 scroll-area">
        「{{ deletingRoomItem?.title }}」を削除します。よろしいですか？
      </div>
      <div class="flex justify-center gap-6">
        <SubmitButton label="はい" class="mt-4" @click="onDeleteConfirm" />
        <UButton label="いいえ" color="white" class="mt-4" @click="onDeleteModalClose" />
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import * as dateFns from "date-fns";
import { ja as dateFnsJa } from "date-fns/locale";
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

const apiEndpoint = useApiEndpoint();
const pagination = reactive(useRoutePagination());
const commonAlert = useCommonAlert();

type RoomListResponse = paths["/user/me/message-room"]["get"]["responses"][200]["content"]["application/json"];
type MessageRoom = RoomListResponse["messageRooms"][number];
const messageRoomList = ref<MessageRoom[]>([]);

const loadPage = async () => {
  const limit = pagination.pageCount;
  const offset = (pagination.page - 1) * pagination.pageCount;
  const { data } = await useCallApi<RoomListResponse>(
    apiEndpoint.value.endpoint + "/v1/user/me/message-room",
    {
      method: "get",
      query: { offset, limit },
    },
  );
  if (!data.value) {
    return;
  }
  messageRoomList.value = data.value.messageRooms;
  pagination.total = data.value.total;
};
await loadPage();
watch(() => [pagination.page, pagination.pageCount].toString(), loadPage);

interface RoomItem {
  date: string;
  title: string;
  detail: string;
  id: string;
  read: boolean;
};

const roomItemList = computed<RoomItem[]>(() => {
  const getDateString = (epoch: number) => isNaN(epoch) ? "" : dateFns.format(new Date(epoch), "YoModo(eee)HH:mm", { locale: dateFnsJa });
  const getOtherPartyName = (room: MessageRoom) => room.isOwner
    ? room.invitedRecruitCompanyName || room.invitedUserName
    : room.ownerRecruitCompanyName || room.ownerUserName;
  return messageRoomList.value.map(room => ({
    date: getDateString(Number(room.latestPost?.postUnixTime) * 1000),
    title: getOtherPartyName(room),
    detail: room.latestPost?.postBody || "(メッセージはありません)",
    id: room.id,
    read: !room.isNewPost,
  }));
});

const deletingRoomItem = ref<RoomItem>();
const isDeleteModalOpen = ref(false);

const onDeleteModalOpen = (message: RoomItem) => {
  deletingRoomItem.value = message;
  isDeleteModalOpen.value = true;
};

const onDeleteModalClose = () => {
  deletingRoomItem.value = undefined;
  isDeleteModalOpen.value = false;
};

const onDeleteConfirm = async () => {
  if (!deletingRoomItem.value) {
    return;
  }
  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/user/me/message-room/" + deletingRoomItem.value.id,
    { method: "delete" },
  );
  if (error.value) {
    commonAlert.showWarn("削除できませんでした。");
    return;
  }

  onDeleteModalClose();
  commonAlert.showSuccess("削除しました。");
  if (messageRoomList.value.length === 1 && pagination.page > 1 && pagination.page === pagination.lastPage) {
    // 最終ページに一項目しかなかった場合、前のページを表示
    pagination.page -= 1;
  } else {
    void loadPage();
  }
};
</script>
