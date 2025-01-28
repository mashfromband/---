<template>
  <USelect
    :options="prefectureSelectList"
    option-attribute="name"
    v-on:change="onSelect"
    v-model="props.default"
  />
</template>

<script setup lang="ts">
import { getAllCode2Prefecture } from "~/utils/prefecture";

interface Props {
  default: number,
}
const props = defineProps<Props>();

interface Emits {
  (event: string, prefectureId: number): void;
}
const emit = defineEmits<Emits>();

type PrefectureType = {
  id: number,
  name: string,
  value: string,
}
const prefectureSelectList: PrefectureType[] = [];
const allCode2Prefecture = getAllCode2Prefecture();
for (const [code, name] of allCode2Prefecture) {
  prefectureSelectList.push({
    id: code,
    name: name,
    value: code.toString(),
  });
}

const onSelect = (prefectureCode: string) => {
  emit("onSelectPrefecture", parseInt(prefectureCode, 10));
}
</script>
