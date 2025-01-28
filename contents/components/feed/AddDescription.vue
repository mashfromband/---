<template>
  <div class="flex justify-between">
    <div>
      <div class="flex gap-2 items-center">
        <UBadge v-if="item.tag" class="min-w-0 line-clamp-1 leading-6" variant="subtle" :ui="{ rounded: 'rounded-full' }" :label=item.tag />
      </div>
      <div class="mt-2 text-xl font-semibold leading-6 h-12 line-clamp-2">
        {{ item.title }}
      </div>
      <div class="mt-4 text-md leading-5 h-10 line-clamp-2">
        {{ item.description }}
      </div>
    </div>
    <div class="content-center">
      <UIcon name="i-heroicons-chevron-right" class="h-10 w-10 flex-none text-secondary-500" />
    </div>
  </div>
</template>



<script setup lang="ts">

const item = defineProps({
  title: {
    type: String as PropType<string>,
    required: true,
  },
  description: {
    type: String as PropType<string>,
    required: true,
  },
  tag: {
    type: String as PropType<string>,
    required: false,
  },
})

</script>