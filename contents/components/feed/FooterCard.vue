<template>
  <div class="bg-primary-50 dark:bg-gray-800/50 lg:rounded-b-3xl -mt-12">
    <div class="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
      <div ref="marqueeContainer" class="flex flex-wrap items-center justify-between">
        <span v-if="props.text" class="hidden lg:flex p-2 bg-primary-500 rounded-full">
          <UIcon name="i-heroicons-megaphone" class="h-8 w-8 text-white dark:text-gray-800" />
        </span>
        <div class="hidden lg:flex w-full lg:w-0 flex-1 items-center marquee">
          <p ref="marqueeContent" class="ml-3 truncate font-medium lg:whitespace-nowrap lg:overflow-visible lg:marquee-content">
            {{props.text}}
          </p>
        </div>
        <div class="my-4 w-full flex-shrink-0 lg:mt-0 lg:w-auto">
          <ElTextLink :to="props.link">
            <div class="flex justify-end items-center">
              <span>{{ props.label }}</span>
              <UIcon name="i-heroicons-chevron-right" class="ml-2 w-6 h-6"/>
            </div>
          </ElTextLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  link: string;
  label: string;
  text?: string;
}

const props = defineProps<Props>();
const marqueeContainer = ref<HTMLElement | null>(null);
const marqueeContent = ref<HTMLElement | null>(null);

onMounted(() => {
  if (marqueeContainer.value && marqueeContent.value) {
    const containerWidth = marqueeContainer.value.offsetWidth;
    const contentWidth = marqueeContent.value.scrollWidth;

    if (contentWidth > containerWidth) {
      const scrollDuration = (contentWidth / containerWidth) * 10; // 10秒
      marqueeContent.value.style.animationDuration = `${scrollDuration}s`;
    }
  }
});
</script>


<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.marquee {
  white-space: nowrap;
  overflow: hidden;
  display: flex;
}

@media (min-width: 1024px) {
  .lg\:marquee-content {
    animation: marquee 10s linear infinite;
    will-change: transform;
  }
}
</style>
