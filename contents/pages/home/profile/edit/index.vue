<template>
  <UDashboardPanelContent class="py-8"
    :ui="{
      wrapper:'p-0 bg-white/80 dark:bg-gray-800/50'
    }"
  >
  <UForm
    :state="state"
    :schema="schema"
    @submit="onSubmit"
    @error="onError"
  >
    <UDashboardSection
      title="基本情報"
      icon="i-heroicons-pencil-square"
    >
      <template #links>
        <SubmitButton
          label="保存する"
          color="black"
        />
      </template>

      <UFormGroup
        name="nickname"
        label="ニックネーム"
        required
        class="grid grid-cols-2 gap-2 items-center px-4 py-6"
        :ui="{ container: '' }"
      >
        <UInput
          v-model="state.nickname"
          autocomplete="off"
          size="md"
        />
      </UFormGroup>

      <UFormGroup
        label="プロフィールアイコン"
        class="grid grid-cols-2 gap-2 px-4 py-6"
        :ui="{ container: 'flex flex-wrap items-center gap-3', help: 'mt-0' }"
      >
        <UAvatar
          :src="userIconUrl"
          :alt="state.nickname"
          size="lg"
          :ui="{ rounded: 'rounded' }"
        />

        <UButton
          label="アイコンを選択"
          color="white"
          size="md"
          @click="onOpenIconDialog"
        />
      </UFormGroup>

      <UFormGroup
        name="selfIntroduction"
        label="自己紹介文"
        description="自分自身を表現する簡単な文章です。"
        class="grid grid-cols-2 gap-2 px-4 py-6"
        :ui="{ container: '' }"
      >
        <UTextarea
          v-model="state.selfIntroduction"
          :rows="5"
          autoresize
          size="md"
        />
      </UFormGroup>

    </UDashboardSection>
  </UForm>
  </UDashboardPanelContent>

  <UModal v-model="iconDialogState.isOpen">
    <UPageCard>
      <template #header>
        <div class="flex justify-center">
          <span class="font-bold">プロフィールアイコン</span>
        </div>
      </template>
      <div class="scroll-area flex justify-center">
        <div class="grid grid-cols-4 gap-4">
          <URadio
            v-for="option in iconDialogState.options"
            :key="option.value"
            v-model="iconDialogState.userIconId"
            :value="option.value"
          >
            <template #label>
              <div class="radio-label flex flex-col items-center">
                <input
                  :id="option.value"
                  type="radio"
                  class="hidden-radio"
                  :value="option.value"
                  v-model="iconDialogState.userIconId"
                />
                <div class="custom-radio rounded-lg" :style="{ backgroundImage: `url(${option.image})` }"></div>
              </div>
            </template>
          </URadio>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-evenly">
          <UButton @click="onSubmitIcon" label="設定する" size="xl" />
          <UButton @click="onCancelIcon" label="キャンセル" size="xl" color="white" />
        </div>
      </template>
    </UPageCard>
  </UModal>
</template>


<script setup lang="ts">
import type { paths } from "@/types/api/contents";
import * as yup from "yup";

definePageMeta({
  layout: 'profile'
})

const state = reactive({
  nickname: "",
  selfIntroduction: "",
  userIconId: 0,
})

const schema = (() => {
  const { object, string } = yup;
  return object({
    nickname: string()
      .required("ニックネームの入力は必須です")
      .max(32, "ニックネームは32文字以内です"),

    selfIntroduction: string()
      .max(20000, "自己紹介文は20000文字以内です"),
  });
})();

const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();
const notifier = useNotification();

const userInfo = await (async () => {
  type ApiResponse = paths["/user/me"]["get"]["responses"]["200"]["content"]["application/json"];
  const { data } = await useCallApi<ApiResponse>(
    apiEndpoint.value.endpoint + "/v1/user/me",
    { method: "get" },
  );
  return data;
})();
if (userInfo.value) {
  state.nickname = userInfo.value.nickname;
  state.selfIntroduction = userInfo.value.selfIntroduction;
  state.userIconId = userInfo.value.userIconId;
}

const loadIconOptions = async () => {
  type ApiResponse = paths["/user-icon"]["get"]["responses"]["200"]["content"]["application/json"];
  const { data } = await useCallApi<ApiResponse>(
    apiEndpoint.value.endpoint + "/v1/user-icon",
    { method: "get" },
  );
  return data.value?.userIcons.map(userIcon => ({
    value: userIcon.id,
    image: userIcon.iconPath,
  })) || [];
};

const iconDialogState = reactive({
  isOpen: false,
  userIconId: "",
  options: await loadIconOptions(),
});

const userIconUrl = computed(() => {
  const option = iconDialogState.options.find(_ => _.value === String(state.userIconId));
  return option?.image || "";
});

const onOpenIconDialog = () => {
  iconDialogState.isOpen = true;
  iconDialogState.userIconId = String(state.userIconId);
};

const onSubmitIcon = () => {
  state.userIconId = Number(iconDialogState.userIconId);
  iconDialogState.isOpen = false;
};

const onCancelIcon = () => {
  iconDialogState.isOpen = false;
};

onMounted(() => {
  if (!userInfo.value) {
    commonAlert.showWarn("プロフィールを読み込めませんでした。");
  }
});

const onError = () => {
  commonAlert.showWarn("入力項目に不備があります。");
};

const onSubmit = async () => {
  if (!userInfo.value) {
    return;
  }

  type ApiRequest = paths["/user/me"]["put"]["requestBody"]["content"]["application/json"];
  type ApiResponse = paths["/user/me"]["put"]["responses"]["200"]["content"]["application/json"];
  const requestBody: ApiRequest = {
    nickname: state.nickname,
    userIconId: state.userIconId,
    selfIntroduction: state.selfIntroduction,
    purpose: userInfo.value.purpose,
    targetSkill: userInfo.value.targetSkill,
    targetKnowledge: userInfo.value.targetKnowledge,
  };

  const url = apiEndpoint.value.endpoint + "/v1/user/me"; // TODO: 外に出す
  const { data } = await useCallApi<ApiResponse>(url, {
    method: "put",
    body: requestBody,
  });
  if (!data.value) {
    commonAlert.showWarn("更新に失敗しました。");
    return;
  }

  const { setNickName, setIconUrl } = useUserInfo();
  setNickName(data.value.nickname);
  setIconUrl(useStaticCdnUrl(data.value.userIconPath).staticCdnUrl.value);

  notifier.notifySuccess("更新完了しました。");
  navigateTo("/home/profile");
};

const links : BreadcrumbLinkItem[] = [
  {
    to: "/home",
    icon:"i-heroicons-home-20-solid"
  },
  {
    label: "プロフィール",
    to: "/home/profile",
  },
  {
    label: "基本情報の編集",
  },
];
const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);
onMounted(() => {
  breadcrumblinks.value = [...links];
});
</script>


<style scoped>
:deep(input[type="radio"]) {
  display: none;
}

.hidden-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* カスタムラジオボタン */
.custom-radio {
  width: 40px;
  height: 40px;
  background-size: cover;
  background-position: center;
/*  border-radius: 50%;*/
  border: 2px solid #ccc;
  cursor: pointer;
}

.hidden-radio:checked + .custom-radio {
  border-color: #c30002;
  border-width: 2.5px
}

.scroll-area {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
