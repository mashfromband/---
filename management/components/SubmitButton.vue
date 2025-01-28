<template>
  <UButton
    :type="$attrs.type ?? 'submit'"
    :class="guardClass"
    @click="onClick"
  >
    <slot />
  </UButton>
</template>

<script setup lang="ts">
import { useTimeout } from "@vueuse/core";

const props = withDefaults(defineProps<{
  /** 二度押し防止時間 ms (初期値 3000 ms)*/
  guardTime?: number;
}>(), {
  guardTime: 3000,
});

const guardTimer = useTimeout(props.guardTime, { controls: true, immediate: false });

const guardClass = computed(() => guardTimer.ready.value ? "" : "guarded");

const onClick = () => guardTimer.start();
</script>

<style scoped>
.guarded {
  pointer-events: none;
  opacity: 0.75;
}
</style>
