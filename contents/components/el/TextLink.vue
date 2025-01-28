<template>
  <ULink
    v-bind="props"
    :to="to"
    active-class="text-gray-500 dark:text-gray-400"
    inactive-class="text-el_blue-600 hover:text-gray-700 dark:hover:text-gray-200"
    class="font-medium"
  >
    <slot />
  </ULink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: object | string;
}>();
</script>
