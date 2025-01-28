<template>
  <div class="flex justify-center">
    <div class="max-w-screen-sm">
      <div v-for="(step, stepIdx) in props.items" :key="step.name">
        <div :class="[step.button? 'pb-4':'pb-10','relative']">
          <span :class="[stepIdx !== props.items.length - 1 ? step.color : '',step.button ? 'top-8' : 'top-4',  'absolute left-4 -ml-px h-full w-0.5']"></span>
          <div class="relative flex space-x-8 items-center">
            <span :class="[step.color, 'flex flex-none h-8 w-8 items-center justify-center rounded-full text-white font-medium']">
              <UIcon v-if="step.icon" :name="step.icon" class="h-5 w-5" />
              <span v-else>{{ step.name }}</span>
            </span>
            <div class="min-w-0 pt-1.5">
              <div class="font-bold text-gray-900 dark:text-gray-200">{{ step.title }}</div>
              <div v-if="step.button">
                <UButton class="mt-2" :label="step.button.label" :to="step.button.to" :icon="step.button.icon" :size="step.button.size"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Item {
  readonly name: string;
  readonly color: string;
  readonly title: string;
  readonly button: {
    label: string;
    to: string;
    icon?: string;
    size?: string;
  };
  readonly icon?: string;
}

const props = defineProps({
  items: {
    type: Array as PropType<Readonly<Item[]>>,
    required: true,
  },
});

/*
const steps = [
  { name: '01', status: 'complete' , color:'bg-secondary-500', icon: 'i-heroicons-check', title: '無料で新規登録を行う', button:{label:'無料で新規登録', to:'/auth/mail_regist', icon:'i-heroicons-user-plus', size:'xl'} },
  { name: '02', status: 'complete' , color:'bg-secondary-500', title: '「クエスト」を選択して気になる学習コンテンツを選択する'},
  { name: '03', status: 'current' , title: '広告を視聴する'},
  { name: '04', status: 'upcoming' , color:'bg-secondary-500', title: '学習コンテンツでスキルを学ぶ' },
  { name: '05', status: 'upcoming' , color:'bg-secondary-500', title: 'ポイントを獲得する' },
]
*/

</script>