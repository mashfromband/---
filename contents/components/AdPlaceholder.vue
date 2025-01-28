<template>
  <ClientOnly>
    <div class="flex items-center space-x-4 border border-gray-50 border-opacity-20" 
      :style="{
        height: `${getAdSize.height}px`,
        width: `${getAdSize.width}px`
      }"
    >
      <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
      広告
      <div class="space-y-2">
        <div>{{ getAdSizeType }}</div>
        <USkeleton class="h-4" :ui="{ rounded: 'rounded-full' }" :style="{width: `${getAdSize.width/3}px`}" />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

/** ビッグバナー | レクタングル | レクタングル | モバイルバナー | ワイド スカイスクレイパー  */ 
type AdSizeType = 'big-banner' | 'large-rectangle' | 'medium-rectangle' | 'mobile-banner' | 'wide-skyscraper';
type AdSize = {
  width: number;
  height: number;
};

const props = defineProps<{
  sizeType: AdSizeType;
}>();

const breakpoints = useBreakpoints(breakpointsTailwind)

const getAdSizeType = computed(() => {
  return props.sizeType === 'big-banner' && breakpoints.smaller('md').value
    ? 'mobile-banner' : props.sizeType;
});

const getAdSize = computed((): AdSize => {
  switch (getAdSizeType.value) {
    case 'big-banner':
      return { width: 728, height: 90 };
    case 'large-rectangle':
      return { width: 336, height: 280 };
    case 'medium-rectangle':
      return { width: 300, height: 250 };
    case 'mobile-banner':
      return { width: 300, height: 50 };
    case 'wide-skyscraper':
      return { width: 160, height: 600 };
    default:
      throw new Error("予想外のタイプを選択しています");
  }
});

</script>
