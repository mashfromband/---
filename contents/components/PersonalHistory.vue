<template>
  <UFormGroup
    :name="$props.name"
    :label="$props.label"
    class="grid grid-cols-2 gap-2"
    :ui="{ container: 'items-center gap-3'}"
  >
    <div class="sm:flex gap-2" :ui="{ container: 'sm:flex items-center gap-3' }">
      <UFormGroup :name="dateInputName">
        <DateInput
          ref="dateInputRef"
          v-model="computedDate"
          no-day
          class="flex flex-col sm:flex-row gap-2"
        />
      </UFormGroup>
    </div>
    <UFormGroup :name="textInputName">
      <UTextarea
        v-if="textarea"
        v-model="computedText"
        autocomplete="off"
        autoresize
        :placeholder="$props.placeholder"
        class="mt-2"
      />
      <UInput
        v-else
        v-model="computedText"
        autocomplete="off"
        :placeholder="$props.placeholder"
        class="mt-2"
        size="md"
      />
    </UFormGroup>
    <div class="flex justify-end pt-2">
      <div
        v-if="$props.deletable"
        class="left-0 bottom-0 flex justify-end"
      >
        <UButton
          label="項目を削除"
          icon="i-heroicons-x-mark"
          variant="link"
          @click="emit('delete')"
        />
      </div>
    </div>
  </UFormGroup>
</template>

<script setup lang="ts">
import type DateInput from './DateInput.vue';

export interface PersonalHistoryModel {
  id?: string;
  year: string;
  month: string;
  text: string;
}

const props = withDefaults(defineProps<{
  name: string;
  label: string;
  textarea?: boolean;
  maxLength?: number;
  placeholder?: string;
  deletable?: boolean;
}>(), {
  textarea: false,
  maxLength: 255,
});
const model = defineModel({
  type: Object as PropType<PersonalHistoryModel>,
  required: true,
});
const emit = defineEmits<{
  delete: [];
}>();

const computedDate = computed({
  get() {
    return `${model.value.year}-${model.value.month}`;
  },
  set(value) {
    if (value) {
      const [year, month] = value.split("-");
      model.value.year = year;
      model.value.month = month;
    } else {
      model.value.year = "";
      model.value.month = "";
    }
  },
});

const computedText = computed({
  get: () => model.value.text,
  set: value => {
    model.value.text = value;
    // DateInput のバリデーションを再実行
    dateInputRef.value?.emitFormChange();
  },
});

const dateInputName = computed(() => `${props.name}.date`);
const textInputName = computed(() => `${props.name}.text`);
const dateInputRef = ref<InstanceType<typeof DateInput>>();

defineExpose({
  validate: () => {
    const errors: { path: string; message: string; }[] = [];
    dateInputRef.value!.validate().forEach(message => errors.push({ path: dateInputName.value, message }));
    if (model.value.text && !(model.value.year && model.value.month)) {
      errors.push({ path: dateInputName.value, message: "日付の入力が必要です" });
    }
    if (model.value.text.length > props.maxLength) {
      errors.push({ path: textInputName.value, message: `${props.label}は${props.maxLength}文字以内です` });
    }
    return errors;
  },
});
</script>
