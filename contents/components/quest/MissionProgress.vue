<template>
  <div class="flex justify-center">
    <ol role="list" class="flex flex-wrap items-center mt-4 lg:mt-0 mx-4">
      <li v-for="(step, stepIdx) in steps" :key="step.name" :class="[stepIdx !== steps.length - 1 ? 'pr-2 sm:pr-10' : '', 'relative my-4']">
        <template v-if="step.status === 'complete'">
          <div class="absolute inset-0 flex items-center">
            <div class="h-0.5 w-full bg-secondary-500" />
          </div>
          <span class="relative flex h-6 w-6 items-center justify-center rounded-full bg-secondary-500">
            <UIcon name="i-heroicons-check" class="h-6 w-6 text-white" />
          </span>
        </template>
        <template v-else-if="step.status === 'current'">
          <div class="absolute inset-0 flex items-center">
            <div class="h-0.5 w-full bg-gray-300" />
          </div>
          <span class="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-secondary-500 bg-white dark:bg-gray-800">
            <span class="h-4 w-4 rounded-full bg-secondary-500" />
            <span class="absolute -top-10 left-1/2 transform -translate-x-1/2 translate-y-1/2 font-medium">Mission.{{ props.currentMissionIndex + 1 }}</span>
          </span>
        </template>
        <template v-else>
          <div class="absolute inset-0 flex items-center">
            <div class="h-0.5 w-full bg-gray-300" />
          </div>
          <span class="group relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-300 dark:bg-gray-800">
            <span class="h-2.5 w-2.5 rounded-full bg-transparent" />
          </span>
        </template>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  totalMissions: {
    type: Number as PropType<number>,
    required: true,
  },
  currentMissionIndex: {
    type: Number as PropType<number>,
    required: true,
  },
});
const steps = computed(() => {
  return Array.from({ length: props.totalMissions }).map((_, index) => ({
    name: `Step ${index + 1}`,
    status:
      index < props.currentMissionIndex
        ? 'complete'
        : index === props.currentMissionIndex
        ? 'current'
        : 'upcoming',
  }));
});
</script>