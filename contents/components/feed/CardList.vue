<template>
  <div class="bg-el_yellow-50 dark:bg-gray-800/50 py-4 px-4 lg:p-8 lg:rounded-t-3xl">
    <div class="flex items-center mb-4">
      <NuxtImg v-if="feed.img" :src=feed.img class="w-16 h-16 grayscale contrast-0"/>
      <UIcon v-if="feed.icon" :name=feed.icon class="w-16 h-16 text-primary"/>
      <span class="font-bold text-xl">{{feed.title}}</span>
    </div>
    <UPageGrid
      v-if="feed.list && feed.list.length > 0"
      class="lg:grid gap-6 lg:gap-8 relative"
      :ui="{
        wrapper: 'xl:grid-cols-2'
      }"
    >
      <ULink v-for="item in props.feed.list" :to="item.to">
        <UCard class="relative"
          :ui="{
            base:'hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
          }"
        >
          <FeedAddDescription :title=item.name :description=item.description :tag="item.tag" />
        </UCard>
      </ULink>
    </UPageGrid>
    <div
      v-else-if="feed.list && feed.list.length === 0"
      class="h-[200px] flex items-center justify-center text-center"
    >
      {{`${props.feed.title}がありません` }}
    </div>
    <div
      v-else
      class="h-[200px] flex items-center justify-center text-center animate-pulse"
    >
      読み込み中...
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  feed: {
    type: Object as PropType<Partial<{
      title: string,
      img: string,
      icon: string,
      list: Array<{
        name: string,
        description: string,
        tag: string,
        to: string
      }>
    }>>,
    required: true,
  }
});



</script>