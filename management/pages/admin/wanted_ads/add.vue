<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="求人広告　新規追加" />
    <UDashboardPanelContent>
      <UForm ref="form" :schema="schema" :state="state" @submit="onSubmit" @error="onError">
        <UDashboardSection
          description="すべての項目が入力必須です"
        >
        <UFormGroup label="求人広告出稿企業ID" name="companyId" description="1～64文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" v-model="state.companyId" placeholder="" />
        </UFormGroup>
        <UFormGroup label="求人タイトル" name="title" description="1～128文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" v-model="state.title" placeholder="（例）【急募】Webエンジニア／フレックスタイム制・リモートワーク可" />
        </UFormGroup>
        <UFormGroup label="掲載期間(開始日)" name="beginAt" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UButtonGroup size="sm" orientation="horizontal">
            <UInput type="text" v-model="state.beginAt" />
            <UPopover>
              <template #default>
                <UButton icon="i-heroicons-calendar-date-range" color="gray" variant="solid" />
              </template>
              <template #panel="{ close }">
                <DatePicker v-model="state.beginAt" @close="close" />
              </template>
            </UPopover>
          </UButtonGroup>
        </UFormGroup>
        <UFormGroup label="掲載期間(終了日)" name="endAt" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UButtonGroup size="sm" orientation="horizontal">
            <UInput type="text" v-model="state.endAt" />
            <UPopover>
              <template #default>
                <UButton icon="i-heroicons-calendar-date-range" color="gray" size="xl" variant="solid" />
              </template>
              <template #panel="{ close }">
                <DatePicker v-model="state.endAt" @close="close" />
              </template>
            </UPopover>
          </UButtonGroup>
        </UFormGroup>
        <UFormGroup label="募集職種" name="position" description="1～64文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" v-model="state.position" placeholder="（例）Webエンジニア（バックエンド／フロントエンド）" />
        </UFormGroup>
        <UFormGroup label="勤務地" name="workLocation" description="1～64文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" v-model="state.workLocation" placeholder="（例）東京都千代田区（リモートワーク可）" />
        </UFormGroup>
        <UFormGroup label="雇用形態" name="employmentStatus" description="1～64文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" v-model="state.employmentStatus" placeholder="（例）正社員（試用期間3ヶ月）" />
        </UFormGroup>
        <UFormGroup label="募集人数" name="numberOfPeople" description="1～32文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput type="text" v-model="state.numberOfPeople" placeholder="（例）若干名" />
        </UFormGroup>
        <UFormGroup label="仕事内容の詳細" name="details" description="1～2048文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="state.details" resize placeholder="（例）&#10;弊社プロジェクトチームにおけるWebアプリケーションの開発業務を担当いただきます。" />
        </UFormGroup>
        <UFormGroup label="応募条件" name="requirements" description="1～255文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="state.requirements" resize placeholder="（例）&#10;Webアプリケーション開発の実務経験（3年以上）&#10;JavaScript、TypeScript、React または Vue.js の使用経験" />
        </UFormGroup>
        <UFormGroup label="給与・待遇" name="salaryAndBenefits" description="1～255文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="state.salaryAndBenefits" resize  placeholder="（例）&#10;年収：◯◯万円～◯◯万円（経験・スキルにより応相談）" />
        </UFormGroup>
        <UFormGroup label="勤務時間" name="officeHour" placeholder="1～128文字まで" description="1～128文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="state.officeHour" resize  placeholder="（例）フレックスタイム制（コアタイム：11:00～15:00）" />
        </UFormGroup>
        <UFormGroup label="休日・休暇" name="dayOff" description="1～128文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="state.dayOff" resize placeholder="（例）完全週休2日制（土・日）" />
        </UFormGroup>
        <UFormGroup label="福利厚生" name="welfareProgram" description="1～255文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="state.welfareProgram" resize placeholder="（例）社会保険完備" />
        </UFormGroup>
        <UFormGroup label="応募方法" name="howToApply" description="1～128文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="state.howToApply" resize placeholder="（例）下記の応募フォームにてご応募ください。" />
        </UFormGroup>
        <UFormGroup label="応募書類" name="applicationDocuments" description="1～255文字まで" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UTextarea v-model="state.applicationDocuments" resize placeholder="" />
        </UFormGroup>
        <UFormGroup label="応募締切日" name="applicationDeadline" required class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UButtonGroup size="sm" orientation="horizontal">
            <UInput type="text" v-model="state.applicationDeadline" />
            <UPopover :popper="{ placement: 'top-end' }">
              <template #default>
                <UButton icon="i-heroicons-calendar-date-range" color="gray" variant="solid" />
              </template>
              <template #panel="{ close }">
                <DatePicker v-model="state.applicationDeadline" @close="close" />
              </template>
            </UPopover>
          </UButtonGroup>
        </UFormGroup>
        </UDashboardSection>
        <SubmitButton label="この内容で求人広告を新規追加する" size="xl" />
      </UForm>
    </UDashboardPanelContent>

    <UModal v-model="isOpenComfirmModal">
      <div class="p-4">
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="green"
          variant="outline"
          title="この内容で新規追加しますか?"
        />
      </div>
      <div class="p-4">
        <div class="font-bold">新規追加対象</div>
        <UCard>
          <div class="grid grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto">
            <div class="font-bold">求人広告出稿企業ID</div>
            <div class="col-span-3">{{ state.companyId }}</div>
            <div class="font-bold">求人タイトル</div>
            <div class="col-span-3">{{ state.title }}</div>
            <div class="font-bold">掲載期間(開始日)</div>
            <div class="col-span-3">{{ state.beginAt }}</div>
            <div class="font-bold">掲載期間(終了日)</div>
            <div class="col-span-3">{{ state.endAt }}</div>
            <div class="font-bold">募集職種</div>
            <div class="col-span-3">{{ state.position }}</div>
            <div class="font-bold">勤務地</div>
            <div class="col-span-3">{{ state.workLocation }}</div>
            <div class="font-bold">雇用形態</div>
            <div class="col-span-3">{{ state.employmentStatus }}</div>
            <div class="font-bold">募集人数</div>
            <div class="col-span-3">{{ state.numberOfPeople }}</div>
            <div class="font-bold">仕事内容の詳細</div>
            <div class="col-span-3">{{ state.details }}</div>
            <div class="font-bold">応募条件</div>
            <div class="col-span-3">{{ state.requirements }}</div>
            <div class="font-bold">給与・待遇</div>
            <div class="col-span-3">{{ state.salaryAndBenefits }}</div>
            <div class="font-bold">勤務時間</div>
            <div class="col-span-3">{{ state.officeHour }}</div>
            <div class="font-bold">休日・休暇</div>
            <div class="col-span-3">{{ state.dayOff }}</div>
            <div class="font-bold">福利厚生</div>
            <div class="col-span-3">{{ state.welfareProgram }}</div>
            <div class="font-bold">応募方法</div>
            <div class="col-span-3">{{ state.howToApply }}</div>
            <div class="font-bold">応募書類</div>
            <div class="col-span-3">{{ state.applicationDocuments }}</div>
            <div class="font-bold">応募締切日</div>
            <div class="col-span-3">{{ state.applicationDeadline }}</div>
          </div>
        </UCard>
      </div>
      <div class="p-4">
        <UButton label="新規追加する" color="green" class="mr-2" @click="onConfirm(true)" />
        <UButton label="キャンセル" color="white" class="mr-2" @click="onConfirm(false)" />
      </div>
    </UModal>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
});

import { format } from "date-fns";

const now = new Date();
const state = reactive({
  companyId: "",
  title: "",
  position: "",
  workLocation: "",
  employmentStatus: "",
  numberOfPeople: "",
  details: "",
  requirements: "",
  salaryAndBenefits: "",
  officeHour: "",
  dayOff: "",
  welfareProgram: "",
  howToApply: "",
  applicationDocuments: "",
  applicationDeadline: format(now, "yyyy-MM-dd"),
  beginAt: format(now, "yyyy-MM-dd"),
  endAt: format(now, "yyyy-MM-dd"),
});

import { object, string } from 'yup'
const form = ref();
const schema = object({
  companyId: string()
    .required("無効な企業IDです")
    .max(64, "求人広告出稿企業IDは64文字以内です"),

  title: string()
    .required("求人タイトルは必須です")
    .max(128, "求人タイトルは128文字以内です"),

  beginAt: string()
    .required("掲載期間(開始日)は必須です")
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "掲載期間(開始日)はYYYY-MM-DD形式です"),

  endAt: string()
    .required("掲載期間(終了日)は必須です")
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "掲載期間(終了日)はYYYY-MM-DD形式です"),

  position: string()
    .required("募集職種は必須です")
    .max(64, "募集職種は64文字以内です"),

  workLocation: string()
    .required("勤務地は必須です")
    .max(64, "勤務地は64文字以内です"),

  employmentStatus: string()
    .required("雇用形態は必須です")
    .max(64, "雇用形態は64文字以内です"),

  numberOfPeople: string()
    .required("募集人数は必須です")
    .max(32, "募集人数は32文字以内です"),

  details: string()
    .required("仕事内容の詳細は必須です")
    .max(2048, "仕事内容の詳細は2048文字以内です"),

  requirements: string()
    .required("応募条件は必須です")
    .max(255, "応募条件は255文字以内です"),

  salaryAndBenefits: string()
    .required("給与・待遇は必須です")
    .max(255, "給与・待遇は255文字以内です"),

  officeHour: string()
    .required("勤務時間は必須です")
    .max(128, "勤務時間は128文字以内です"),

  dayOff: string()
    .required("休日・休暇は必須です")
    .max(128, "休日・休暇は128文字以内です"),

  welfareProgram: string()
    .required("福利厚生は必須です")
    .max(255, "福利厚生は255文字以内です"),

  howToApply: string()
    .required("応募方法は必須です")
    .max(128, "応募方法は128文字以内です"),

  applicationDocuments: string()
    .required("応募書類は必須です")
    .max(255, "応募書類は255文字以内です"),

  applicationDeadline: string()
    .required("応募締切日は必須です")
    .matches(/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}$/, "応募締切日はYYYY-MM-DD形式です"),
});

const apiEndpoint = useApiEndpoint();
const commonAlert = useCommonAlert();

const isOpenComfirmModal = ref(false);

const onSubmit = async () => {
  isOpenComfirmModal.value = true;
};

const onError = () => {
  commonAlert.showInputWarning();
};

const onConfirm = async (confirmed: boolean) => {
  isOpenComfirmModal.value = false;
  if (!confirmed) {
    return;
  }

  const { error } = await useCallApi(
    apiEndpoint.value.endpoint + "/v1/wanted-ads",
    {
      method: "post",
      body: state,
    },
  );

  if(error.value) {
    if(error.value.statusCode == 404) {
      form.value.setErrors([{path: "companyId", message: "無効な企業IDです"}]);
      commonAlert.showInputWarning();
      return;
    }

    commonAlert.showWarn(
      "新規追加失敗しました。"
    );
  } else {
    commonAlert.showSuccess(
      "求人広告の新規追加が完了しました。",
      "/admin/wanted_ads",
    );
  }
};
</script>
