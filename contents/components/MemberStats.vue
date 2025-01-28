<template>
  <div class="relative isolate overflow-hidden border-y">
    <div>
      <dl v-if="props.items && props.items.length > 0"
        :class="[
          'grid max-w-7xl grid-cols-1 gap-px bg-gray-200 dark:bg-gray-900',
          props.items.length === 1 ? 'lg:grid-cols-1' : props.items.length === 2 ? 'lg:grid-cols-2' : `lg:${gridClass}`,
          'lg:px-0 xl:px-0'
        ]"
      >
        <div v-for="(item, index) in stats" :key="index"
          class="bg-white dark:bg-gray-800/50 flex flex-wrap items-baseline justify-center p-2 lg:p-4 gap-4"
        >
          <div class="w-full flex justify-end">
            <UButton v-if="item.to != '' " :to="item.to" icon="i-heroicons-chevron-right" color="white" variant="solid" />
            <span v-else class="h-8"></span>
          </div>
          <div class="text-xl font-medium text-gray-500 flex">
            <UIcon v-if="item.icon" :name=item.icon class="w-6 h-6 flex-shrink-0"/>
            <span class="flex-grow">{{ item.title }}</span>
          </div>
          <div class="w-full flex justify-center text-6xl font-medium leading-10 text-gray-900 dark:text-white">
            {{ item.change }}
          </div>
          <div class="text-lg font-medium flex justify-end">
            <span v-if="item.unit">{{ item.unit }}</span><span v-if="item.caption">{{ item.caption }}</span>
            <span v-else class="h-8"></span>
          </div>
        </div>
      </dl>
      <p v-else class="flex justify-center">データの読み込みに失敗しました</p>
    </div>
    <!--背景-->
    <div v-if="type === 'positive'" class="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl lg:left-1/2 lg:-ml-96 lg:-mt-10 lg:translate-y-0 lg:rotate-0 lg:transform-gpu lg:opacity-50" aria-hidden="true">
      <div class="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#C30002] to-[#EFB203]" style="clip-path: polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)" />
    </div>
    <div v-else-if="type === 'negative'" class="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl lg:left-1/2 lg:-ml-96 lg:-mt-10 lg:translate-y-0 lg:rotate-0 lg:transform-gpu lg:opacity-50" aria-hidden="true">
      <div class="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-gray-800 to-gray-900" style="clip-path: polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)" />
    </div>
    <div v-else></div>
  </div>
</template>

<script setup lang="ts">
interface Item {
  title: string;
  unit?: number;
  caption?: string;
  change: number;
  to?: string;
  icon?: string;
}

const props = defineProps({
  type: { type: String, default:'none' },
  cols: { type: String, default:'3'},
  items: { type: Array as () => Item[], required: true }
});

const gridClass = computed(() => {
  return props.cols === '2' ? 'grid-cols-2' : 'grid-cols-3';
});


const stats = computed(() =>
  props.items.map(item => ({
    ...item,
    unit: item.unit ?? 0,
    caption: item.caption ?? '',
    change: item.change ?? 0,
    to: item.to ?? '',
    icon: item.icon ?? '',
    type: props.type === 'negative' ? 'negative' : props.type === 'positive' ? 'positive' : 'none',
  }))
);

</script>
