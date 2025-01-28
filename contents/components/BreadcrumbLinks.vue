<template>
  <UContainer class="hidden lg:block breadcrumb-link"
    :ui="{
      padding: 'px-0 sm:px-0 lg:px-0'
    }"
  >
  <div class="flex flex-col lg:items-center mx-auto lg:px-8">
    <UBreadcrumb :links="props.links"
      :ui="{
        wrapper: 'flex w-full min-w-0 truncate border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 lg:min-h-11',
        ol:'px-4',
        active:'text-el_blue-600'
      }"
    >
      <template #divider>
        <svg class="h-full w-6 flex-shrink-0 text-gray-200 dark:text-gray-800" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
          <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
        </svg>
      </template>
    </UBreadcrumb>
  </div>
  </UContainer>
</template>

<script setup lang="ts">
type Props = {
  links: any[],
}

const props = defineProps<Props>();


</script>
