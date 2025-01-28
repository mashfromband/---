<template>
  <ClientOnly>
    <UButton label="キーワードで検索" @click="openSearchTag"
      icon="i-heroicons-magnifying-glass-20-solid"
      variant="solid"
      color="gray"
      size="xl"
      class="flex-1"
      block
      :ui="{ block: 'justify-start w-full lg:w-72' }"
    />

    <UModal v-model="isOpen">
      <div class="h-[60vh]">
      <!-- フィルター -->
      <UTabs v-if="tabs.length > 1" :items="tabs" @change="onTabChange" />

      <UCommandPalette
        placeholder="キーワードを入力してください"
        :loading="loading"
        :empty-state="{
          icon: 'i-heroicons-magnifying-glass-20-solid',
          label: 'タグを検索',
          queryLabel: 'お探しのキーワードを含むタグが見つかりません。'
        }"
        @close="isOpen = false"
        ref="commandPaletteRef"
        :groups="groups" :autoselect="false" @update:model-value="onSelect"
        :ui="{
          group: {container:'flex flex-wrap'}
        }"
      >
      </UCommandPalette>
      </div>
    </UModal>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { components, paths } from '~/types/api/contents';
const props = defineProps<{
  genreId?: string;
  categoryId?: string;
}>();
const tabDefine = {
  'none': [
    { label: 'すべて', alias: 'all' }
  ],
  'genre': [
    { label: 'すべて', alias: 'all' },
    { label: 'ジャンル以下', alias: 'with_genre' }
  ],
  'category': [
    { label: 'すべて', alias: 'all' },
    { label: 'カテゴリ以下', alias: 'with_category' }
  ]
};
let tabs = tabDefine.none;
if (props.genreId) {
  tabs = tabDefine.genre;
} else if (props.categoryId) {
  tabs = tabDefine.category;
}

const onTabChange = async (index:number) => {
  const item = tabs[index];
  if(item.alias == 'with_genre') {
    if(!filteredTags.value) {
      await fetchGenreTags();
    }
    currentTags.value = filteredTags.value;
    return;
  }

  if(item.alias == 'with_category') {
    if(!filteredTags.value) {
      await fetchCategoryTags();
    }
    currentTags.value = filteredTags.value;
    return;
  }

  if(item.alias == 'all') {
    currentTags.value = allTags.value;
    return;
  }
};


const router = useRouter()
const isOpen = ref(false)
const loading = ref(false)
function onSelect (option:any) {
  isOpen.value = false
  if (option.click) {
    option.click()
  } else if (option.to) {
    router.push(option.to)
  } else if (option.href) {
    window.open(option.href, '_blank')
  }
}
const openSearchTag = async () => {
  isOpen.value = true;
  if(!allTags.value) {
    await fetchAllTags();
  }
  currentTags.value = allTags.value
};

/** API連発を防止するため、TagsとFilterの結果を個別に保存して表示を切り替える構成にする */
const allTags = ref();
const filteredTags = ref();

const currentTags = ref([]);
const commandPaletteRef = ref();
const groups = computed(() => {
  if (commandPaletteRef.value?.query) {
    return [
      { key: 'tags', commands: currentTags.value },
    ];
  } else {
    return [
      { key: 'tags', label: '新着タグ', commands: currentTags.value.slice(0, 3) }
    ];
  }
});

const apiEndpoint = useApiEndpoint();
const fetchAllTags = async () => {
  type ResponseGetTagList = paths["/tag"]["get"]["responses"][200]["content"]["application/json"];
  type tag = components["schemas"]["oneTag"];
  const { data } = await useCallApi<ResponseGetTagList>(
    apiEndpoint.value.endpoint + "/v1/tag",
    { 
      method: "get",
      query: { sort: "-id", limit:100 },
    }
  );
  if(data.value) {
    allTags.value = data.value.tags.map((tag: tag) => {
      return {
        id: tag.id,
        label: tag.name,
        to: `/tag/${tag.id}`
      };
    });
    currentTags.value = allTags.value;
  }
}

const fetchGenreTags = async () => {
  type ApiResponse = paths["/genre/{genreId}"]["get"]["responses"][200]["content"]["application/json"];
  const { data } = await useCallApi<ApiResponse>(
    apiEndpoint.value.endpoint + "/v1/genre/" + props.genreId,
    { method: "get" },
  );
  if(data.value) {
    filteredTags.value = data.value.tags.map((tag) => {
      return {
        id: tag.id,
        label: tag.name,
        to: `/tag/${tag.id}`
      };
    })
  }
}

const fetchCategoryTags = async () => {
  type ApiResponse = paths["/category/{categoryId}"]["get"]["responses"][200]["content"]["application/json"];
  const { data } = await useCallApi<ApiResponse>(
    apiEndpoint.value.endpoint + "/v1/category/" + props.categoryId,
    { method: "get" },
  );
  if(data.value) {
    filteredTags.value = data.value.tags.map((tag) => {
      return {
        id: tag.id,
        label: tag.name,
        to: `/tag/${tag.id}`
      };
    })
  }
}
</script>
