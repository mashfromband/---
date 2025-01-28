<template>
  <div class="flex items-center justify-between border-gray-200 bg-gray-50 dark:bg-gray-800/50 py-3">
    <!-- screen size sm : Buttons only -->
    <div class="flex flex-1 justify-between lg:hidden">
      <UButton
        label="前へ"
        icon="i-heroicons-chevron-left"
        size="lg"
        color="gray"
        :to="$props.to?.(pageModel - 1)"
        :disabled="!canBackward"
        class="relative inline-flex items-center"
        @click="onClickBackward"
      />
      <div>
        <p class="text-sm">
          <template v-if="$props.total">
            <span class="font-medium">{{ firstNumber }}</span>
            ～
          </template>
          <span class="font-medium">{{ lastNumber }}</span>
          件を表示中
          （全
          <span class="font-medium text-xl text-primary">{{ $props.total }}</span>
          件）
        </p>
      </div>
      <UButton
        label="次へ"
        icon="i-heroicons-chevron-right"
        trailing
        size="lg"
        color="gray"
        :to="$props.to?.(pageModel + 1)"
        :disabled="!canForward"
        class="relative ml-3 inline-flex items-center"
        @click="onClickForward"
      />
    </div>

    <!-- screen size pc : pagenation -->
    <div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
        <div>
        <p class="text-sm">
          <template v-if="$props.total">
            <span class="font-medium">{{ firstNumber }}</span>
            ～
          </template>
          <span class="font-medium">{{ lastNumber }}</span>
          件を表示中
          （全
          <span class="font-medium text-xl text-primary">{{ $props.total }}</span>
          件）
        </p>
      </div>
      <UPagination
        v-model="pageModel"
        :total="$props.total"
        :page-count="$props.pageCount"
        :to="$props.to"
        size="md"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RouteLocationAsRelativeGeneric, RouteLocationAsPathGeneric } from "#vue-router";

const props = defineProps<{
  total: number;
  pageCount: number;
  to?: (page: number) => string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric,
}>();
const pageModel = defineModel("page", {
  type: Number,
  required: true,
});

const maxPage = computed(() => Math.ceil(props.total / props.pageCount));
const firstNumber = computed(() => (pageModel.value - 1) * props.pageCount + 1);
const lastNumber = computed(() => Math.min(props.total, pageModel.value * props.pageCount));
const canBackward = computed(() => 1 < pageModel.value);
const canForward = computed(() => pageModel.value < maxPage.value);

const onClickBackward = () => {
  if (canBackward.value) {
    pageModel.value -= 1;
  }
};
const onClickForward = () => {
  if (canForward.value) {
    pageModel.value += 1;
  }
};
</script>
