<template>
  <NuxtLink :to="item.to" class="w-full">
    <div class="flex justify-between items-center py-4 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-dashed">
      <!-- long -->
      <div v-if="item.size=='long'" class="lg:flex min-w-0 relative">
        <div class="flex items-center lg:min-w-[16rem] text-xs leading-5 text-gray-400">
          <p class="truncate flex-none min-w-32">{{item.date}}</p>
          <UBadge v-if="item.tag" :label=item.tag variant="solid" color="secondary" class="flex-none" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold leading-6 truncate"><span class="font-extrabold text-black dark:text-white">{{item.headline}}</span>{{ item.title }}</p>
        </div>
      </div>
      <!-- short -->
      <div v-else class=" min-w-0">
        <div class="flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
          <p class="truncate">{{item.date}}</p>
          <UBadge v-if="item.tag" :label=item.tag variant="solid" color="secondary" />
        </div>
        <div class="flex">
          <p class="text-sm font-semibold leading-6 truncate"><span class="font-extrabold text-black dark:text-white">{{item.headline}}</span>{{ item.title }}</p>
        </div>
      </div>
      <UIcon name="i-heroicons-chevron-right" class="h-6 w-6 flex-none" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">

const item = withDefaults(defineProps<{
  headline?: string;
  title: string;
  date: string;
  size?: 'long' | 'short'; 
  tag?:string,
  tagColor?: string,
  to: string
}>(),{
  size: 'short',
});

</script>