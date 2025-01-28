<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-800 space-y-6 *:pt-6 first:*:pt-2 mb-6">
    <div v-for="(model, index) in modelList" :key="index">
      <PersonalHistory
        ref="historyRefList"
        v-model="modelList[index]"
        :name="`${$props.name}.${index}`"
        :label="$props.label + circledNumberChar(index + 1)"
        :placeholder="$props.placeholder"
        :deletable="!!$props.minLength && index >= $props.minLength"
        :textarea=$props.textarea
        @delete="onDelete(index)"
      />
    </div>
    <div class="flex border-dashed">
      <UButton
        class="text-sm font-semibold leading-6"
        icon="i-heroicons-plus"
        color="gray"
        block
        :disabled="!canAdd"
        @click="onAdd"
      >
        {{ $props.label }}を追加
        <template v-if="!canAdd">
          (これ以上追加できません)
        </template>
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type PersonalHistory from './PersonalHistory.vue';
import type { PersonalHistoryModel } from './PersonalHistory.vue';

const props = defineProps<{
  name: string;
  label: string;
  placeholder?: string;
  minLength?: number;
  textarea?: boolean;
}>();
const modelList = defineModel({
  type: Array as PropType<PersonalHistoryModel[]>,
  required: true,
});

const maxHistoryLength = 100;
const canAdd = computed(() => modelList.value.length < maxHistoryLength);

const addEmptyModel = () => {
  if (canAdd.value) {
    modelList.value.push({ year: "", month: "", text: "" });
  }
};

if (props.minLength) {
  while (modelList.value.length < props.minLength) {
    addEmptyModel();
  }
}

const onAdd = addEmptyModel;

const onDelete = (index: number) => {
  modelList.value.splice(index, 1);
};

const circledNumberChar = (n: number) => {
  const code = n === 0 ? 0x24ea
    : n < 21 ? 0x2460 + n - 1
    : n < 36 ? 0x3251 + n - 21
    : n < 51 ? 0x32b1 + n - 36
    : 0;
  return code ? String.fromCharCode(code) : `(${n})`;
};

const historyRefList = ref<InstanceType<typeof PersonalHistory>[]>([]);

defineExpose({
  validate: () => {
    return historyRefList.value.map(_ => _.validate()).flat();
  },
});
</script>
