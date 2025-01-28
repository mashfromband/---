<template>
  <UDropdown
    :items="menu"
    :ui="{
      width: 'w-60',
      item: {
        disabled: 'cursor-text select-text'
      }
    }"
    :popper="{ placement: 'bottom-start' }"
  >
    <!--通知チップ-->
    <UChip size="md" color="primary" v-for="item in notice" :key="item.count" :show="item.count > 0">
      <UButton color="gray" class="w-60">
        <ClientOnly>
          <template #fallback>
            <UAvatar :ui="{ rounded: 'rounded' }" />
            <span class="animate-pulse">読み込み中...</span>
          </template>

          <template v-if="nickName">
            <!--プロフ画像などを表示するエリア-->
            <UAvatar
              :src="iconUrl"
              :alt="nickName"
              :ui="{ rounded: 'rounded' }"
            />
            <!--会員ニックネームなどを表示するエリア-->
            <span class="overflow-hidden text-ellipsis whitespace-nowrap">
              {{getLevel()}} {{ nickName }}
            </span>
          </template>
          <template v-else>
            <UAvatar :ui="{ rounded: 'rounded' }" />
            <span class="overflow-hidden text-ellipsis whitespace-nowrap">
              ユーザー情報取得失敗
            </span>
          </template>
        </ClientOnly>
      </UButton>
    </UChip>
  </UDropdown>
</template>

<script setup lang="ts">
const { nickName, mailAddress, iconUrl, userLevel } = storeToRefs(useUserInfo());
const getLevel = () => {
  if(!userLevel.value || userLevel.value == 0) {
    return "";
  }
  return `Lv.${userLevel.value}`;
}

// menu links
interface MenuItem {
  label: string;
  icon?: string;
  to?: string;
  disabled?: boolean;
}

const props = defineProps<{
  addItems: MenuItem[][];
}>();

// メニュー部品
const menu  = ref([
  [{
    label: '一般会員', 
    slot: 'accountmenu',
    disabled: true
  }, {
    label: mailAddress,
    disabled: true
  }]
]);

onMounted(() => {
    menu.value.splice(2, 0, ...props.addItems);
});

// 通知チップ
const notice = [{
  count: 0
}];

</script>
