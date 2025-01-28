<template>
  <div role="progressbar" class="w-full">
    <slot
      v-if="indicator || $slots.indicator"
      name="indicator"
      v-bind="{ percent }"
    >
      <div :style="{ width: `${percent}%` }">
        <div>{{ Math.round(percent) }}%</div>
      </div>
    </slot>

    <div
      ref="barElementRef"
      :class="progressBarClass"
    >
      <div
        :class="progressValueClass"
        :style="{
          width: `${percent}%`,
          backgroundSize: `${width}px 100%`,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// グラデーション対応プログレスバー
// 参考: https://stackoverflow.com/questions/66952087/#66952121
import { useElementSize } from "@vueuse/core";
import { twMerge } from "tailwind-merge";

const props = defineProps<{
  value: number;
  max?: number;
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  valueClass?: string;
  barClass?: string;
  indicator?: boolean;
}>();

const percent = computed(() => {
  const max = props.max ?? 100;
  return props.value < 0 ? 0
    : props.value > max ? 100
    : props.value / max * 100;
});

const progressValueClass = computed(() => twMerge(
  'h-full rounded-full bg-primary',
  props.valueClass,
));

const progressBarClass = computed(() => {
  const height = {
    '2xs': 'h-px',
    xs: 'h-0.5',
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
    '2xl': 'h-5',
  }[props.size || "md"];
  return twMerge(
    'w-full rounded-full bg-gray-200 dark:bg-gray-700',
    height,
    props.barClass,
  );
});

const barElementRef = ref();
const { width } = useElementSize(barElementRef);
</script>
