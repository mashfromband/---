<template>
  <div class="flex items-center justify-center">
  <UPageCard
    class="w-full overflow-hidden"
    :ui="{
      header: { base:'', background:'', padding:'px-0 py-0 sm:px-0'},
      footer: { base:'', background:'', padding:'px-0 py-0 sm:px-0'}
    }"
  >
  <template #header>
    <div class="bg-primary-500 p-3 lg:p-4">
      <span />
    </div>
  </template>
    <div class="border-b-2 pb-4">
      <div class="inline-flex items-center gap-3 min-w-0">
        <UIcon name="i-heroicons-identification" class="w-10 h-10"/>
        <span class="text-gray-900 dark:text-white font-bold text-2xl leading-6">履歴書</span>
        <UButton
          to="/home/profile/edit/personal"
          color="white"
          icon="i-heroicons-pencil-square"
          size="md"
        />
      </div>
      <div>
        <span class="text-gray-900 dark:text-white leading-6">「求人への応募」や「スカウト受諾」で、対象企業に公開する履歴書の雛形です</span>
      </div>
    </div>
    <UPageBody prose class="break-words break-all">
    <h3>基本情報</h3>
      <table>
        <tbody>
          <tr>
            <th>氏名</th>
            <td>
              <div>
                <span v-if="userInfo.nameCalling">{{ userInfo.nameCalling }}</span>
              </div>
              <div>
                <span v-if="userInfo.name">{{ userInfo.name }}</span>
                <span v-else>未設定</span>
              </div>
            </td>
          </tr>
          <tr>
            <th>生年月日</th>
            <td>
              <span v-if="birthDay">
                {{ birthDay.year }}年{{ birthDay.month }}月{{ birthDay.day }}日
              </span>
              <span v-else>未設定</span>
            </td>
          </tr>
          <tr>
            <th>郵便番号</th>
            <td>
              <span v-if="userInfo.postalCode">{{ userInfo.postalCode }}</span>
              <span v-else>未設定</span>
            </td>
          </tr>
          <tr>
            <th>現住所</th>
            <td>
              <div>
                <span v-if="userInfo.addressCalling">{{ userInfo.addressCalling }}</span>
              </div>
              <div>
                <span v-if="userInfo.prefectureCode || userInfo.address">{{ addressPrefectureName }}{{ userInfo.address }}</span>
                <span v-else>未設定</span>
              </div>
            </td>
          </tr>
          <tr>
            <th>電話番号</th>
            <td>
              <span v-if="userInfo.phoneNumber">{{ userInfo.phoneNumber }}</span>
              <span v-else>未設定</span>
            </td>
          </tr>
          <tr v-if="userInfo.contactPostalCode">
            <th>連絡先郵便番号</th>
            <td>{{ userInfo.contactPostalCode }}</td>
          </tr>
          <tr v-if="userInfo.contactPrefectureCode || userInfo.contactAddress">
            <th>連絡先住所</th>
            <td>
              <div>
                <span v-if="userInfo.addressCalling">{{ userInfo.contactAddressCalling }}</span>
              </div>
              <div>
                {{ contactAddressPrefectureName }}{{ userInfo.contactAddress }}
              </div>
            </td>
          </tr>
          <tr v-if="userInfo.contactPhoneNumber">
            <th>連絡先電話番号</th>
            <td>{{ userInfo.contactPhoneNumber }}</td>
          </tr>
        </tbody>
      </table>
    <hr />
    <h3>経歴</h3>
    <h4>学歴</h4>
    <span v-if="userEducationalHistory.educationalHistory.length == 0">未設定</span>
    <table v-else>
      <tbody>
        <tr v-for="history in userEducationalHistory.educationalHistory">
          <th>{{new Date(Number(history.targetYear),Number(history.targetMonth)-1).toLocaleDateString('ja', { year: 'numeric', month: 'short' })}}</th>
          <td>{{ history.educationalHistory }}</td>
        </tr>
      </tbody>
    </table>
    <h4>職歴</h4>
    <span v-if="userJobHistory.jobHistory.length == 0">未設定</span>
    <table v-else>
      <tbody>
        <tr v-for="history in userJobHistory.jobHistory">
          <th>{{new Date(Number(history.targetYear),Number(history.targetMonth)-1).toLocaleDateString('ja', { year: 'numeric', month: 'short' })}}</th>
          <td class="whitespace-pre-line">{{ history.jobHistory }}</td>
        </tr>
      </tbody>
    </table>
    <hr />
    <h3>免許・資格</h3>
    <span v-if="userLicenseList.haveLicense.length == 0">未設定</span>
    <table v-else>
      <tbody>
        <tr v-for="history in userLicenseList.haveLicense">
          <th>{{new Date(Number(history.targetYear),Number(history.targetMonth)-1).toLocaleDateString('ja', { year: 'numeric', month: 'short' })}}</th>
          <td>{{ history.license }}</td>
        </tr>
      </tbody>
    </table>
    <hr />
    <h3>志望の動機、特技、好きな学科、アピールポイントなど</h3>
    <p style="white-space: pre-wrap">{{ userInfo.appealPoint }}</p>
    <hr />
    <h3>本人希望</h3>
    <p style="white-space: pre-wrap">{{ userInfo.wishes }}</p>
    </UPageBody>
    
  </UPageCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'profile'
})

import type {
    paths,
    components,
} from "@/types/api/contents";
type SuccessResponseType = paths["/user/me/private-profile"]["get"]["responses"][200]["content"]["application/json"];

const apiEndpoint = useApiEndpoint();
const { data: response, error } = await useCallApi(
  apiEndpoint.value.endpoint + "/v1/user/me/private-profile",
  {
    method: "get",
  }
);
const userInfo = ref<SuccessResponseType>(response.value as SuccessResponseType);

import { getCode2Prefecture } from "@/utils/prefecture";
const addressPrefectureName = getCode2Prefecture(userInfo.value.prefectureCode) || "";
const contactAddressPrefectureName = getCode2Prefecture(userInfo.value.contactPrefectureCode) || "";

const parsedBirthDay = (birthDay: string) => {
  const parsed = birthDay.split("-");
  if (parsed.length == 3) {
    return {
      year: parsed[0],
      month: parsed[1],
      day: parsed[2],
    }
  }
}

const birthDay = userInfo.value.birthDay ? parsedBirthDay(userInfo.value.birthDay) : null;

const getUserEducationalHistory = async () => {
  type SuccessResponseType =
    paths["/user/me/educational-history"]["get"]["responses"][200]["content"]["application/json"];
  const { data: response, error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/user/me/educational-history",
    {
      method: "get",
    }
  );
  return response.value as SuccessResponseType;
}
const getUserJobHistory = async () => {
  type GetJobHistorySuccessResponseType = paths["/user/me/job-history"]["get"]["responses"][200]["content"]["application/json"];
  const { data: response } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/user/me/job-history",
    { method: "get" }
  );
  return response.value as GetJobHistorySuccessResponseType;
}

const getUserLicenseList = async () => {
  type GetLicenseSuccessResponseType = paths["/user/me/have-license"]["get"]["responses"][200]["content"]["application/json"];
  const { data: response } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/user/me/have-license",
    { method: "get" }
  );
  return response.value as GetLicenseSuccessResponseType;
}

const userEducationalHistory = ref(await getUserEducationalHistory());
const userJobHistory = ref(await getUserJobHistory());
const userLicenseList = ref(await getUserLicenseList());

const displayTargetDate = (targetYear: string, targetMonth: string) => {
  return targetYear + "年" + targetMonth + "月";
}

const links: BreadcrumbLinkItem[] = [
{
  to: "/home",
  icon: "i-heroicons-home-20-solid",
},
{
  to: "/home/profile",
  label: "プロフィール",
},
{
  label: "履歴書",
},
];
const breadcrumblinks = useState<BreadcrumbLinkItem[]>('breadcrumblinks', () => []);
onMounted(() => {
  breadcrumblinks.value = [...links];
});
</script>

<style scoped>
th {
  white-space: nowrap;
}
</style>
