<template>
  <URadio v-for="option of answer.options" v-model="answer.select" v-bind="option" :key="option.value"
    :ui="{
      wrapper:'items-center rounded-lg ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900 shadow has-[:checked]:bg-primary-200 has-[:checked]:dark:bg-primary-700 relative hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
      base:'hidden',
      inner:'grow sm:ms-0',
      label:'px-0 py-0 lg:py-2 sm:px-6 min-h-20 content-center text-2xl cursor-pointer',
    }"
  >
    <template #label>
      <div class="option-border"> <!-- option全体を囲む -->
        <span class="option-index font-midium" :class="calcClassSelected(option.value)"> <!-- 問題のインデックス部分 -->
          {{ option.value }}
        </span>
        <span class="option-description"> <!-- 問題の質問部分 -->
          <span v-html="option.label"></span>
        </span>
      </div>
    </template>
  </URadio>
</template>

<script setup lang="ts">
const answer = useMissionAnswerOneChoice();

const calcClassSelected = (optionValue: string) => {
  return optionValue === answer.value.select ? 'selected' : 'not-selected';
};
</script>

<style scoped>
.option-border {
  @apply flex items-center pr-4;
}

.option-index {
  @apply
    w-10
    h-10 
    flex 
    items-center 
    justify-center 
    rounded-full
}
.option-index.selected {
  @apply 
    bg-el_red-500 
    text-white
} 
.option-index.not-selected{
  @apply 
    bg-transparent
    text-gray-700
    border border-gray-700;
}

.option-description {
  @apply flex-1 ml-4;
}
</style>