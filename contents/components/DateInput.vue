<template>
  <div>
    <USelectMenu
      v-model="state.year"
      :options="yearOptions"
      option-attribute="label"
      value-attribute="value"
      selected-icon="i-heroicons-check-16-solid"
      placeholder="年"
      size="md"
      class="min-w-24"
    >
      <template #label>
        {{ state.year.replace(/^0+/, '') }}年
      </template>
    </USelectMenu>
    <USelectMenu
      v-model="state.month"
      :options="monthOptions"
      option-attribute="label"
      value-attribute="value"
      selected-icon="i-heroicons-check-16-solid"
      placeholder="月"
      size="md"
      class="min-w-20"
    >
      <template #label>
        {{ state.month.replace(/^0+/, '') }}月
      </template>
    </USelectMenu>
    <USelectMenu
      v-if="!$props.noDay"
      v-model="state.day"
      :options="dayOptions"
      option-attribute="label"
      value-attribute="value"
      selected-icon="i-heroicons-check-16-solid"
      placeholder="日"
      size="md"
      class="min-w-20"
    >
      <template #label>
        {{ state.day.replace(/^0+/, '') }}日
      </template>
    </USelectMenu>
  </div>
</template>

<script setup lang="ts">
import * as dateFns from "date-fns";

// 本当は useFormGroup の emitFormChange を使いたいが、
// なぜか useFormGroup するとエラーになるので、再実装する。
import { type UseEventBusReturn } from "@vueuse/core";
import type { FormEvent, FormEventType, InjectedFormGroupValue } from "#ui/types";
const formBus = inject<UseEventBusReturn<FormEvent, string> | undefined>("form-events", undefined);
const formGroup = inject<InjectedFormGroupValue | undefined>("form-group", undefined);
function emitFormEvent(type: FormEventType, path: string) {
  formBus?.emit({ type, path });
}
function emitFormChange() {
  const name = formGroup?.name.value;
  if (name) {
    emitFormEvent('change', name);
  }
}

const props = defineProps<{
  noDay?: boolean;
}>();
const model = defineModel({
  type: String, // ex. "2000-01-02" or "2000-01" (noDay=false)
});

const state = reactive({
  year: "", // ex. "2000"
  month: "", // ex. "01"
  day: "", // ex. "02"
});
const stateToString = computed(() => {
  const text = `${state.year}-${state.month}-${state.day}`;
  return props.noDay ? text.replace(/-\d*$/, "") : text;
});
const stateIsEmpty = computed(() => {
  return !state.year && !state.month && (props.noDay || !state.day);
});
const initState = () => {
  if (model.value) {
    const [year, month, day] = model.value.split("-");
    state.year = year ? year.padStart(4, "0") : "";
    state.month = month ? month.padStart(2, "0") : "";
    state.day = !props.noDay && day ? day.padStart(2, "0") : "";
  } else {
    state.year = "";
    state.month = "";
    state.day = "";
  }
};
initState();
watch(model, initState);

watch(state, () => {
  const newValue = stateIsEmpty.value ? "" : stateToString.value;
  if (model.value !== newValue) {
    console.debug(`[DateInput] emit: '${model.value}' -> '${newValue}'`);
    model.value = newValue;
  }
});

const getSeq = (first: number, last: number) => {
  let n = first;
  return new Array(last - first + 1).fill(null).map(_ => n++);
}
const optionGetter = (unit: string, length: number) => {
  return (value: number) => ({
    label: `${value}${unit}`,
    value: String(value).padStart(length, "0"),
  });
};
const yearOptions = (() => {
  const thisYear = new Date().getFullYear();
  return [
    { label: "　", value: "" },
    ...getSeq(thisYear - 100, thisYear).map(optionGetter("年", 4)).reverse(),
  ];
})();
const monthOptions = [
  { label: "　", value: "" },
  ...getSeq(1, 12).map(optionGetter("月", 2)),
];
const dayOptions = computed(() => {
  const { year, month } = state;
  const date = dateFns.parse(`${year}-${month}`, "yyyy-MM", new Date);
  const maxDay = dateFns.isValid(date) ? dateFns.getDaysInMonth(date) : 31;
  return [
    { label: "　", value: "" },
    ...getSeq(1, maxDay).map(optionGetter("日", 2)),
  ];
});

const validateForm = computed(() => {
  if (stateIsEmpty.value) {
    return true;
  }
  const format = props.noDay ? "yyyy-MM" : "yyyy-MM-dd";
  const date = dateFns.parse(stateToString.value, format, new Date);
  return dateFns.isValid(date);
});

defineExpose({
  validate: () => {
    return validateForm.value ? [] : ["正しい日付を入力してください"];
  },
  emitFormChange,
});
</script>

<style scoped>
/* ドロップダウンの truncate を無効にする */
:deep() [role=listbox] [role=option] .truncate {
  @apply overflow-visible;
}
</style>
