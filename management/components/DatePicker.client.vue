<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
// @ts-expect-error - no types available
import type { DatePickerDate, DatePickerRangeObject } from 'v-calendar/dist/types/src/use/datePicker'
import 'v-calendar/dist/style.css'
import { format, parse } from 'date-fns'
import { onMounted } from 'vue';

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => {
    if (props.modelValue) {
      return parse(props.modelValue, 'yyyy-MM-dd', new Date());
    }
    return null;
  },
  set: (newDate) => {
    const isCannelAction = newDate == null;
    emit(
      'update:model-value', 
      isCannelAction ? null : format(newDate, 'yyyy-MM-dd')
    );
    emit('close');
  }
})

const breakpoints = useBreakpoints(breakpointsTailwind)

const smallerThanSm = breakpoints.smaller('sm')

const attrs = {
  'transparent': true,
  'borderless': true,
  'color': 'primary',
  'is-dark': { selector: 'html', darkClass: 'dark' },
  'first-day-of-week': 2
}

/**
 * UPopoverの位置調整機能を発火する
 * 
 * 初回表示時、UPopover機能の表示位置はoverflowが発生しております (何かとコンフリクトしている可能性あり)
 * 対応するため、UI表示後に意図的にUPopoverの調整機能を発火させる
 */
const dispatchPopoverReposition = () => {
  window.dispatchEvent(new Event('resize'));
}
onMounted(() => {
  dispatchPopoverReposition();
});
</script>

<template>
  <VCalendarDatePicker
    v-if="date && (date as DatePickerRangeObject)?.start && (date as DatePickerRangeObject)?.end"
    v-model.range="date"
    :columns="smallerThanSm ? 1 : 2"
    :rows="smallerThanSm ? 2 : 1"
    v-bind="{ ...attrs, ...$attrs }"
  />
  <VCalendarDatePicker
    v-else
    v-model="date"
    v-bind="{ ...attrs, ...$attrs }"
  />
</template>

<style>
:root {
  --vc-gray-50: rgb(var(--color-gray-50));
  --vc-gray-100: rgb(var(--color-gray-100));
  --vc-gray-200: rgb(var(--color-gray-200));
  --vc-gray-300: rgb(var(--color-gray-300));
  --vc-gray-400: rgb(var(--color-gray-400));
  --vc-gray-500: rgb(var(--color-gray-500));
  --vc-gray-600: rgb(var(--color-gray-600));
  --vc-gray-700: rgb(var(--color-gray-700));
  --vc-gray-800: rgb(var(--color-gray-800));
  --vc-gray-900: rgb(var(--color-gray-900));
}

.vc-primary {
  --vc-accent-50: rgb(var(--color-primary-50));
  --vc-accent-100: rgb(var(--color-primary-100));
  --vc-accent-200: rgb(var(--color-primary-200));
  --vc-accent-300: rgb(var(--color-primary-300));
  --vc-accent-400: rgb(var(--color-primary-400));
  --vc-accent-500: rgb(var(--color-primary-500));
  --vc-accent-600: rgb(var(--color-primary-600));
  --vc-accent-700: rgb(var(--color-primary-700));
  --vc-accent-800: rgb(var(--color-primary-800));
  --vc-accent-900: rgb(var(--color-primary-900));
}
</style>
