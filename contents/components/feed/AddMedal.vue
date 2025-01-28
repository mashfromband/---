<template>
  <NuxtLink :to= "item.to" >
    <div class="relative pb-8  rounded hover:bg-gray-100 dark:hover:bg-gray-800/50">
      <span v-if="!isLastIndex" class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
      <div class="relative flex space-x-3">
        <div>
          <span :class="[item.iconBackground, 'flex h-8 w-8 items-center justify-center rounded-full']">
            <UIcon :name="item.icon" class="h-5 w-5 text-white" />
          </span>
        </div>
        <div class="flex flex-wrap min-w-0 flex-1 justify-between space-x-4 pt-1.5">
          <div>
            <p class="text-sm text-gray-500">
              <span class="font-medium text-gray-900 dark:text-gray-200">{{ item.title }}</span>
              {{ item.content }} 
            </p>
          </div>
          <div class="whitespace-nowrap text-right text-sm text-gray-500">
            <time :datetime="item.date">{{ item.date }}</time>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const item = defineProps<ItemProps>();

type ItemProps ={
  title: string;
  content: string;
  date: string;
  to: string;
  icon: string;
  iconBackground: string;
  isLastIndex?: boolean;
}

</script>