<template>
  <div class="relative isolate overflow-hidden">
    <div
      :class="[
        'mx-auto grid max-w-7xl grid-cols-1',
        'lg:grid-cols-3',
        'lg:px-2 xl:px-0',
      ]"
    >
      <div
        v-for="(item, index) in itemList"
        :key="index"
        :class="[
          index % 2 === 1 ? 'lg:border-l' : index === 2 ? 'lg:border-l' : '',
          index < itemList.length - 1 ? 'border-b' : '',
          'flex flex-col place-items-center gap-4 border-gray-900/10 dark:border-white/20 px-4 py-4 lg:border-b-0 xl:px-8'
        ]"
      >
        <div >{{ item.title }}</div>
        <ClientOnly>
          <ve-progress
            v-if="isMounted"
            :progress="item.value / item.denominator * 100"
            thickness="8%"
            empty-thickness="8%"
            v-bind="item.progressProps"
            class="text-center"
          >
            <template #default="{ counterTick }">
              <div class="font-medium">
                <span :class="[
                  'text-6xl tracking-tighter',
                  props.isPerfect && item.value ? 'text-el_orange-600' : '',
                ]">{{ Math.round(counterTick.currentValue / 100 * item.denominator) }}
                </span>
                <span
                  v-if="item.title !== '獲得EFO'"
                  class="text-2xl tracking-tighter"
                >/{{ item.denominator }}
                </span>
              </div>
              <div>
                <span>{{ item.caption }}</span>
              </div>
            </template>
          </ve-progress>
        </ClientOnly>
      </div>
    </div>

    <!--背景-->
    <div
      v-if="$props.isPerfect"
      class="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl lg:left-1/2 lg:-ml-96 lg:-mt-10 lg:translate-y-0 lg:rotate-0 lg:transform-gpu lg:opacity-50"
      aria-hidden="true"
    >
      <div
        class="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#C30002] to-[#EFB203]"
        style="clip-path: polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)"
      />
    </div>
    <div v-else
      class="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl lg:left-1/2 lg:-ml-96 lg:-mt-10 lg:translate-y-0 lg:rotate-0 lg:transform-gpu lg:opacity-50"
      aria-hidden="true"
    >
      <div
        class="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-gray-800 to-gray-900"
        style="clip-path: polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface ItemProps {
  title: string;
  value: number;
  denominator: number;
  caption: string;
}

const props = defineProps<{
  items: ItemProps[];
  isPerfect: boolean;
  animationDuration?: number;
}>();

const itemList = computed(() => {
  const animation = (() => {
    const nItems = props.items.filter(_ => _.value).length;
    const duration = (props.animationDuration ?? 0) / (nItems || 1);
    let lastDelay = 0;
    return (index: number) => {
      if (!duration || !props.items[index]?.value) {
        return "default 0 0";
      }
      const delay = lastDelay;
      lastDelay += duration;
      return `default ${Math.round(duration)} ${Math.round(delay)}`;
    };
  })();

  const color = props.isPerfect ? {
    colors: [
      { color: "#ffc802", offset: "0" }, // el_yellow-400
      { color: "#c30002", offset: "100" }, // secondary-500
    ],
  } : "#e26602"; // el_orange-600

  return props.items.map((item, index) => ({
    ...item,
    progressProps: {
      animation: animation(index),
      color: item.value ? color : "rgba(0, 0, 0, 0)",
    },
  }));
});

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>
