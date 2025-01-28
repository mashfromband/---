<template>
  <UAccordion :items="filter" variant="ghost" size="lg" v-if="isTargetPath"
  :ui="{
    default: {
      class: 'px-0 text-secondary-500 dark:text-el_red-300'
    }
  }"
>
    <template #filter>
      <UAccordion :items="filters" variant="solid" open-icon="i-heroicons-plus" close-icon="i-heroicons-minus" multiple>
        <template #item="{ item }">
          <form :key="item.id">
            <UAsideLinks :links="item.options.map(option => ({ label: option.label, to: `${option.value}` }))" />
          </form>
        </template>
      </UAccordion>
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
const route = useRoute();

const targetPaths =[
  '/category/'
]

const isTargetPath = computed(() => targetPaths.some(path => route.path.startsWith(path)));

const filter =[{
  label: 'フィルタを追加',
  defaultOpen: false,
  slot: 'filter'
}]

// sample_data
const filters = [
  {
    id: 'point',
    label: 'ポイント',
    selected: 'default',
    options: [
      { value: 'default', label: '指定なし'},
      { value: '10', label: '10以上'},
      { value: '100', label: '100以上'},
      { value: '300', label: '300以上'},
    ]
  },
  {
    id: 'time',
    label: '時間',
    selected: 'default',
    options: [
      { value: 'default', label: '指定なし'},
      { value: '5', label: '5分未満'},
      { value: '15', label: '15分未満'},
      { value: '30', label: '30分未満'},
      { value: '31', label: '30分以上'}
    ]
  }
];


</script>
