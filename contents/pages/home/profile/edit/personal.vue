<template>
  <UDashboardPage class="py-8"
    :ui="{
        wrapper:'p-0 bg-white/80 dark:bg-gray-800/50'
      }"
  >
    <UForm
      ref="formRef"
      :state="userInfo"
      :schema="validationSchema"
      :validate="validateChildren"
      @submit="onSubmit"
      @error="onError"
    >
    <UDashboardSection
      title="履歴書の編集"
      description="求人への応募やスカウトを受諾した際に、対象企業に履歴書として公開されます。"
      icon="i-heroicons-pencil-square"
    >
      <template #links>
        <SubmitButton
          label="保存する"
          color="black"
        />
        <UButton
          label="すべてクリア"
          color="white"
          @click="onClear"
        />
      </template>
      <UFormGroup
        name="agreement"
        label="履歴書情報取り扱いの確認"
        description=""
        class="flex flex-col pb-6"
        :ui="{
          wrapper: 'bg-gray-100 dark:bg-gray-800/50',
          label: {
            wrapper: 'justify-center'
          }
        }"
      >
        <UCheckbox
          label="入力した情報が「求人への応募」または「スカウト受託」を行った際に、対象企業に公開されることを理解しています"
          class="mx-4"
          :ui="{
            label: 'font-normal',
          }"
        />
      </UFormGroup>
    </UDashboardSection>
    <UDashboardSection
      title="基本情報"
      class="px-4 py-6"
    >
      <UFormGroup
        label="名前"
        class="grid grid-cols-2 gap-2"
      >
        <UFormGroup name="name">
          <UInput
            autocomplete="off"
            size="md"
            placeholder="氏名"
            v-model="userInfo.name"
          />
        </UFormGroup>
        <UFormGroup name="nameCalling">
          <UInput
            autocomplete="off"
            size="md"
            placeholder="ふりがな"
            class="mt-2"
            v-model="userInfo.nameCalling"
          />
        </UFormGroup>
      </UFormGroup>
      <UFormGroup
        name="birthDay"
        label="生年月日"
        class="grid grid-cols-2 gap-2"
      >
        <DateInput
          v-model="userInfo.birthDay"
          class="flex flex-col sm:flex-row gap-2"
        />
      </UFormGroup>
      <UFormGroup
        label="現住所"
        class="grid grid-cols-2 gap-2"
      >
        <UFormGroup name="postalCode">
          <UInput
            autocomplete="off"
            size="md"
            placeholder="郵便番号"
            class="sm:w-40"
            v-model="userInfo.postalCode"
          />
        </UFormGroup>
        <USelectMenu
          size="md"
          :options="prefectureOptions"
          placeholder="都道府県"
          class="mt-2 sm:w-40"
          v-model="prefectureText"
        />
        <UFormGroup name="address">
          <UInput
            autocomplete="off"
            size="md"
            placeholder="住所"
            class="mt-2"
            v-model="userInfo.address"
          />
        </UFormGroup>
        <UFormGroup name="addressCalling">
          <UInput
            autocomplete="off"
            size="md"
            placeholder="ふりがな"
            class="mt-2"
            v-model="userInfo.addressCalling"
          />
        </UFormGroup>
      </UFormGroup>
      <UFormGroup
        name="phoneNumber"
        label="電話番号"
        class="grid grid-cols-2 gap-2 items-center"
        :ui="{ container: '' }"
      >
        <UInput
          autocomplete="off"
          size="md"
          class="sm:w-60"
          placeholder="電話番号"
          v-model="userInfo.phoneNumber"
        />
      </UFormGroup>
      <UAccordion
        :items="[{label:'※現住所以外に連絡先がある場合', color:'black', slot:'contact',}]"
        :ui="{ container: 'bg-gray-200 dark:bg-gray-700 rounded-md p-2'}"
      >
        <template #contact>
          <UFormGroup
            name="address"
            label="連絡先住所"
            class="grid grid-cols-2 gap-2"
          >
            <UFormGroup name="contactPostalCode">
              <UInput
                autocomplete="off"
                size="md"
                placeholder="郵便番号"
                class="sm:w-40"
                v-model="userInfo.contactPostalCode"
              />
            </UFormGroup>
            <USelectMenu
              size="md"
              :options="prefectureOptions"
              placeholder="都道府県"
              class="mt-2 sm:w-40"
              v-model="contactPrefectureText"
            />
            <UFormGroup name="contactAddress">
              <UInput
                autocomplete="off"
                size="md"
                placeholder="連絡先住所"
                class="mt-2"
                v-model="userInfo.contactAddress"
              />
            </UFormGroup>
            <UFormGroup name="contactAddressCalling">
              <UInput
                autocomplete="off"
                size="md"
                placeholder="ふりがな"
                class="mt-2"
                v-model="userInfo.contactAddressCalling"
              />
            </UFormGroup>
          </UFormGroup>
          <UFormGroup
            name="contactPhoneNumber"
            label="連絡先電話番号"
            class="grid grid-cols-2 gap-2 items-center"
            :ui="{ container: '' }"
          >
            <UInput
              autocomplete="off"
              size="md"
              placeholder="連絡先電話番号"
              class="mt-2"
              v-model="userInfo.contactPhoneNumber"
            />
          </UFormGroup>
        </template>
      </UAccordion>
    </UDashboardSection>
    <UDashboardSection
      title="経歴"
      class="px-4 py-6"
    >
      <!-- 学歴 デフォルト３個-->
      <PersonalHistoryGroup
        ref="educationHistoryGroupRef"
        v-model="educationalHistoryList"
        name="educationHistoryList"
        label="学歴"
        placeholder="（例）△△高等学校　卒業"
        :min-length="3"
      />

      <!-- 職歴 デフォルト３個-->
      <PersonalHistoryGroup
        ref="jobHistoryGroupRef"
        v-model="jobHistoryList"
        :textarea="true"
        name="jobHistoryList"
        label="職歴"
        placeholder="（例）株式会社△△ 入社　営業担当として新規開拓の提案営業を行う"
        :min-length="3"
      />

      <!-- 免許・資格 デフォルト１個-->
      <PersonalHistoryGroup
        ref="licenseGroupRef"
        v-model="licenseHistoryList"
        name="licenseList"
        label="免許・資格"
        placeholder="（例）普通自動車第一種運転免許　取得"
        :min-length="1"
      />
    </UDashboardSection>
    <UDashboardSection
      title="その他"
      class="px-4 py-6"
    >
      <UFormGroup
        name="appealPoint"
        label="志望の動機、特技、好きな学科、アピールポイントなど"
        class="grid grid-cols-2 gap-2"
        :ui="{ container: '' }"
      >
        <UTextarea
          :rows="5"
          autoresize
          size="md"
          v-model="userInfo.appealPoint"
        />
      </UFormGroup>
      <UFormGroup
        name="wishes"
        label="本人希望記入欄"
        description="特に給料・職種・勤務時間・勤務地・その他についての希望などがあれば記入"
        class="grid grid-cols-2 gap-2"
        :ui="{ container: '' }"
      >
        <UTextarea
          :rows="5"
          autoresize
          size="md"
          v-model="userInfo.wishes"
        />
      </UFormGroup>
    </UDashboardSection>
    <UDashboardSection>
      <template #links>
        <SubmitButton
          label="保存する"
          color="black"
        />
        <UButton
          label="すべてクリア"
          color="white"
          @click="onClear"
        />
      </template>
    </UDashboardSection>
    </UForm>
  </UDashboardPage>
</template>

<script setup lang="ts">
import * as dateFns from "date-fns";
import * as yup from "yup";
import type { Form } from "#ui/types";
import type { paths } from "@/types/api/contents";
import type { PersonalHistoryModel } from "~/components/PersonalHistory.vue";
import type PersonalHistoryGroup from "~/components/PersonalHistoryGroup.vue";

definePageMeta({
  layout: 'profile'
})

const validationSchema = (() => {
  const { object, string } = yup;
  const postalCodeTestOptions = {
    name: "is-postal-code-string",
    test: (value: string | undefined) => /^[-\d]*$/.test(value || ""),
    message: "数字、ハイフン(-)以外は入力できません",
  };
  const phoneNumberTestOptions = {
    name: "is-phone-number-string",
    test: (value: string | undefined) => /^[-\d()]*$/.test(value || ""),
    message: "数字、括弧、ハイフン(-)以外は入力できません",
  };
  const hiraganaTestOptions = {
    name: "is-hiragana-string",
    test: (value: string | undefined) => /^[　ぁ-んー゛゜ゔゐゑ]*$/.test(value || ""),
    message: "ひらがなを入力してください",
  };
  const dateTestOptions = {
    name: "is-date-string",
    test: (value: string | undefined) => {
      if (!value) {
        return true;
      }
      const date = dateFns.parse(value, "yyyy-MM-dd", new Date());
      return dateFns.isValid(date);
    },
    message: "正しい日付を入力してください",
  };
  return ref(object({
    name: string()
      .max(255, "氏名は255文字以内です"),
    nameCalling: string()
      .test(hiraganaTestOptions)
      .max(255, "ふりがなは255文字以内です"),
    birthDay: string()
      .test(dateTestOptions),
    postalCode: string()
      .test(postalCodeTestOptions)
      .max(16, "郵便番号は16桁以内です"),
    address: string()
      .max(255, "住所は255文字以内です"),
    addressCalling: string()
      .test(hiraganaTestOptions)
      .max(255, "ふりがなは255文字以内です"),
    phoneNumber: string()
      .test(phoneNumberTestOptions)
      .max(16, "電話番号は16桁以内です"),
    contactPostalCode: string()
      .test(postalCodeTestOptions)
      .max(16, "郵便番号は16桁以内です"),
    contactAddress: string()
      .max(255, "住所は255文字以内です"),
    contactAddressCalling: string()
      .test(hiraganaTestOptions)
      .max(255, "ふりがなは255文字以内です"),
    contactPhoneNumber: string()
      .test(phoneNumberTestOptions)
      .max(16, "電話番号は16桁以内です"),
    appealPoint: string()
      .max(20000, "入力可能な文字数は20,000文字以内です"),
    wishes: string()
      .max(20000, "入力可能な文字数は20,000文字以内です"),
  }));
})();


const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();
const notifier = useNotification();

/** 学歴を取得する */
const loadEducationalHistoryModel = async () => {
  type GetEducationalHistorySuccessResponseType = paths["/user/me/educational-history"]["get"]["responses"][200]["content"]["application/json"];
  const { data } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/user/me/educational-history",
    { method: "get" }
  );
  const response = data.value as GetEducationalHistorySuccessResponseType;
  return response.educationalHistory.map((item)=>{
    return {
      id: item.id,
      year: item.targetYear,
      month: item.targetMonth,
      text: item.educationalHistory,
    } as PersonalHistoryModel;
  })
}
/** 職歴を取得する */
const loadJobHistoryModel = async () => {
  type GetJobHistorySuccessResponseType = paths["/user/me/job-history"]["get"]["responses"][200]["content"]["application/json"];
  const { data } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/user/me/job-history",
    { method: "get" }
  );
  const response = data.value as GetJobHistorySuccessResponseType;
  return response.jobHistory.map((item)=>{
    return {
      id: item.id,
      year: item.targetYear,
      month: item.targetMonth,
      text: item.jobHistory,
    } as PersonalHistoryModel;
  })
}
/** 免許・資格を取得する */
const loadLicenseHistoryModel = async () => {
  type GetLicenseSuccessResponseType = paths["/user/me/have-license"]["get"]["responses"][200]["content"]["application/json"];
  const { data } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/user/me/have-license",
    { method: "get" }
  );
  const response = data.value as GetLicenseSuccessResponseType;
  return response.haveLicense.map((item)=>{
    return {
      id: item.id,
      year: item.targetYear,
      month: item.targetMonth,
      text: item.license,
    } as PersonalHistoryModel;
  })
}

const isEmptyHistory = (history: PersonalHistoryModel) => !(history.year || history.month || history.text);

/**
 * 保存用の PersonalHistoryModel[] を作成する。
 * - `idList` 順に id が振られる。
 * - 値が空でないものを先に、空のものを後に並び替える。
 * - id なし & 値が空のものは削除される。
 */
 const getHistoryModelListToSave = (historyList: PersonalHistoryModel[], idList: string[]) => {
  historyList = historyList.map(_ => ({ ..._ }));
  while (historyList.length < idList.length) {
    historyList.push({ year: "", month: "", text: "" });
  }
  const emptyList: PersonalHistoryModel[] = [];
  const notEmptyList: PersonalHistoryModel[] = [];
  for (const history of historyList) {
    (isEmptyHistory(history) ? emptyList : notEmptyList).push(history);
  }
  return [...notEmptyList, ...emptyList]
    .map((history, index) => ({
      ...history,
      id: idList[index],
    })).filter(history => history.id || !isEmptyHistory(history));
};

/** 学歴を保存する */
const saveEducationalHistoryList = async ()=> {
  const insertOne = async (history: PersonalHistoryModel) => {
    type ApiRequest = paths["/user/me/educational-history"]["post"]["requestBody"]["content"]["application/json"];
    const url = apiEndpoint.value.endpoint + "/v1/user/me/educational-history";
    const requestBody: ApiRequest = {
      targetYear: history.year,
      targetMonth: history.month,
      educationalHistory: history.text,
    };
    const { error } = await useCallApi(url, {
      method: "post",
      body: requestBody,
    });
    if (error.value) {
      throw error.value;
    }
  };

  const updateOne = async (history: PersonalHistoryModel) => {
    type ApiRequest = paths["/user/me/educational-history/{id}"]["put"]["requestBody"]["content"]["application/json"];
    const url = apiEndpoint.value.endpoint + `/v1/user/me/educational-history/${history.id}`;
    const requestBody: ApiRequest = {
      targetYear: history.year,
      targetMonth: history.month,
      educationalHistory: history.text,
    };
    const { error } = await useCallApi(url, {
      method: "put",
      body: requestBody,
    });
    if (error.value) {
      throw error.value;
    }
  };

  const deleteOne = async (model: PersonalHistoryModel) => {
    const url = apiEndpoint.value.endpoint + `/v1/user/me/educational-history/${model.id}`;
    const { error } = await useCallApi(url, { method: "delete" });
    if (error.value) {
      throw error.value;
    }
  };

  const historyList = getHistoryModelListToSave(educationalHistoryList.value, origEducationalHistoryList.map(_ => _.id!));
  for (const history of historyList) {
    if (history.id) {
      if (isEmptyHistory(history)) {
        await deleteOne(history);
      } else {
        await updateOne(history);
      }
    } else {
      await insertOne(history);
    }
  }
};

/** 職歴を保存する */
const saveJobHistoryList = async () => {
  const insertOne = async (history: PersonalHistoryModel) => {
    type ApiRequest = paths["/user/me/job-history"]["post"]["requestBody"]["content"]["application/json"];
    const url = apiEndpoint.value.endpoint + "/v1/user/me/job-history";
    const requestBody: ApiRequest = {
      targetYear: history.year,
      targetMonth: history.month,
      jobHistory: history.text,
    };
    const { error } = await useCallApi(url, {
      method: "post",
      body: requestBody,
    });
    if (error.value) {
      throw error.value;
    }
  };

  const updateOne = async (history: PersonalHistoryModel) => {
    type ApiRequest = paths["/user/me/job-history/{id}"]["put"]["requestBody"]["content"]["application/json"];
    const url = apiEndpoint.value.endpoint + `/v1/user/me/job-history/${history.id}`;
    const requestBody: ApiRequest = {
      targetYear: history.year,
      targetMonth: history.month,
      jobHistory: history.text,
    };
    const { error } = await useCallApi(url, {
      method: "put",
      body: requestBody,
    });
    if (error.value) {
      throw error.value;
    }
  };

  const deleteOne = async (model: PersonalHistoryModel) => {
    const url = apiEndpoint.value.endpoint + `/v1/user/me/job-history/${model.id}`;
    const { error } = await useCallApi(url, { method: "delete" });
    if (error.value) {
      throw error.value;
    }
  };

  const historyList = getHistoryModelListToSave(jobHistoryList.value, origJobHistoryList.map(_ => _.id!));
  for (const history of historyList) {
    if (history.id) {
      if (isEmptyHistory(history)) {
        await deleteOne(history);
      } else {
        await updateOne(history);
      }
    } else {
      await insertOne(history);
    }
  }
};

/** 免許・資格を保存する */
const saveLicenseHistoryList = async () => {
  const insertOne = async (history: PersonalHistoryModel) => {
    type ApiRequest = paths["/user/me/have-license"]["post"]["requestBody"]["content"]["application/json"];
    const url = apiEndpoint.value.endpoint + "/v1/user/me/have-license";
    const requestBody: ApiRequest = {
      targetYear: history.year,
      targetMonth: history.month,
      license: history.text,
    };
    const { error } = await useCallApi(url, {
      method: "post",
      body: requestBody,
    });
    if (error.value) {
      throw error.value;
    }
  };

  const updateOne = async (history: PersonalHistoryModel) => {
    type ApiRequest = paths["/user/me/have-license/{id}"]["put"]["requestBody"]["content"]["application/json"];
    const url = apiEndpoint.value.endpoint + `/v1/user/me/have-license/${history.id}`;
    const requestBody: ApiRequest = {
      targetYear: history.year,
      targetMonth: history.month,
      license: history.text,
    };
    const { error } = await useCallApi(url, {
      method: "put",
      body: requestBody,
    });
    if (error.value) {
      throw error.value;
    }
  };

  const deleteOne = async (model: PersonalHistoryModel) => {
    const url = apiEndpoint.value.endpoint + `/v1/user/me/have-license/${model.id}`;
    const { error } = await useCallApi(url, { method: "delete" });
    if (error.value) {
      throw error.value;
    }
  };

  const historyList = getHistoryModelListToSave(licenseHistoryList.value, origLicenseHistoryList.map(_ => _.id!));
  for (const history of historyList) {
    if (history.id) {
      if (isEmptyHistory(history)) {
        await deleteOne(history);
      } else {
        await updateOne(history);
      }
    } else {
      await insertOne(history);
    }
  }
};

/** 個人情報を更新する */
const updatePrivateProfile = async ()=> {
  type RequestBodyType = paths["/user/me/private-profile"]["put"]["requestBody"]["content"]["application/json"];
  const requestBody: RequestBodyType = {
    name: userInfo.value.name,
    nameCalling: userInfo.value.nameCalling,
    postalCode: userInfo.value.postalCode,
    prefectureCode: Number(userInfo.value.prefectureCode),
    address: userInfo.value.address,
    addressCalling: userInfo.value.addressCalling,
    phoneNumber: userInfo.value.phoneNumber,
    contactPostalCode: userInfo.value.contactPostalCode,
    contactPrefectureCode: Number(userInfo.value.contactPrefectureCode),
    contactAddress: userInfo.value.contactAddress,
    contactAddressCalling: userInfo.value.contactAddressCalling,
    contactPhoneNumber: userInfo.value.contactPhoneNumber,
    picturePath: userInfo.value.picturePath,
    birthDay: userInfo.value.birthDay,
    sex: userInfo.value.sex,
    rewardsAndPunishments: userInfo.value.rewardsAndPunishments,
    appealPoint: userInfo.value.appealPoint,
    wishes: userInfo.value.wishes,
  }

  const url = apiEndpoint.value.endpoint + "/v1/user/me/private-profile"; // TODO: 外に出す
  const response = await useCallApi(url, {
    method: "put",
    body: requestBody,
  });

  if(response.error.value) {
    throw response.error.value;
  }
}


/** 個人情報を取得する */
const { data: response, error } = await useCallApi(
  apiEndpoint.value.endpoint + "/v1/user/me/private-profile",
  {
    method: "get",
  }
);

type SuccessResponseType = paths["/user/me/private-profile"]["get"]["responses"][200]["content"]["application/json"];
const userInfo = ref<SuccessResponseType>(response.value as SuccessResponseType);
const origEducationalHistoryList = await loadEducationalHistoryModel();
const origJobHistoryList = await loadJobHistoryModel();
const origLicenseHistoryList = await loadLicenseHistoryModel();
const educationalHistoryList = ref(origEducationalHistoryList.map(_ => ({ ..._ })));
const jobHistoryList = ref(origJobHistoryList.map(_ => ({ ..._ })));
const licenseHistoryList = ref(origLicenseHistoryList.map(_ => ({ ..._ })));
watch(
  () => [
    educationalHistoryList.value.length,
    jobHistoryList.value.length,
    licenseHistoryList.value.length,
  ].toString(),
  () => validateManually());

const prefectureOptions = ["　", ...getAllPrefecture2Code().keys()];
const prefectureText = computed({
  get: () => getCode2Prefecture(userInfo.value.prefectureCode),
  set: (value) => userInfo.value.prefectureCode = getPrefecture2Code(value || "") ?? 0,
});
const contactPrefectureText = computed({
  get: () => getCode2Prefecture(userInfo.value.contactPrefectureCode),
  set: (value) => userInfo.value.contactPrefectureCode = getPrefecture2Code(value || "") ?? 0,
});

const onClear = () => {
  userInfo.value.name = "";
  userInfo.value.nameCalling = "";
  userInfo.value.postalCode = "";
  userInfo.value.prefectureCode = 0;
  userInfo.value.address = "";
  userInfo.value.addressCalling = "";
  userInfo.value.phoneNumber = "";
  userInfo.value.contactPostalCode = "";
  userInfo.value.contactPrefectureCode = 0;
  userInfo.value.contactAddress = "";
  userInfo.value.contactAddressCalling = "";
  userInfo.value.contactPhoneNumber = "";
  // userInfo.value.picturePath
  userInfo.value.birthDay = "";
  // userInfo.value.sex
  // userInfo.value.rewardsAndPunishments
  userInfo.value.appealPoint = "";
  userInfo.value.wishes = "";

  const clearHistory = (history: PersonalHistoryModel) => {
    history.year = "";
    history.month = "";
    history.text = "";
  };
  educationalHistoryList.value.forEach(clearHistory);
  jobHistoryList.value.forEach(clearHistory);
  licenseHistoryList.value.forEach(clearHistory);

  void validateManually();
};

const formRef = ref<Form<typeof userInfo>>();
const educationHistoryGroupRef = ref<InstanceType<typeof PersonalHistoryGroup>>();
const jobHistoryGroupRef = ref<InstanceType<typeof PersonalHistoryGroup>>();
const licenseGroupRef = ref<InstanceType<typeof PersonalHistoryGroup>>();

const validateChildren = () => {
  const errors = [
    educationHistoryGroupRef.value!.validate(),
    jobHistoryGroupRef.value!.validate(),
    licenseGroupRef.value!.validate(),
  ].flat();
  return errors;
};

// UI を経由せずに直接 model を変更するとバリデーションが掛からないので、
// 手動でバーリデーションを掛ける
const validateManually = async () => {
  await nextTick();
  await formRef.value?.validate(undefined, { silent: true });
};

const onError = () => {
  commonAlert.showWarn("入力項目に不備があります。");
};

const onSubmit = async () => {
  try {
    await updatePrivateProfile();
    await Promise.all([
      saveEducationalHistoryList(),
      saveJobHistoryList(),
      saveLicenseHistoryList(),
    ]);
  } catch (error) {
    commonAlert.showWarn("更新に失敗しました。");
    return;
  }

  notifier.notifySuccess("更新完了しました。");
  navigateTo("/home/profile/personal");
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
    label: "履歴書",
    to: "/home/profile/personal",
  },
  {
    label: "編集",
  },
];
const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);
onMounted(() => {
  breadcrumblinks.value = [...links];
});
</script>
