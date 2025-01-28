<template>
      <div v-if="props.tree" class="-mx-4 sm:-mx-6 bg-el_yellow-400 dark:bg-gray-800/50 text-sm lg:hidden">
        <div class="flex items-center border-b">
          <div class="w-[4.5rem] flex-shrink-0 ml-2">
            <span>ジャンル</span>
          </div>
          <div>
            <svg class="h-full w-6 flex-shrink-0 text-gray-200 dark:text-gray-800" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
            </svg>
          </div>
          <div class="flex flex-wrap gap-y-1">
            <div class="ml-2">
              <UButton to="/genre":label="isCategory ? item.genreName : item.name" size="sm" variant="soft" :ui="{ rounded: 'rounded-full' }">
                <template #trailing>
                  <UIcon name="i-heroicons-x-circle" class="w-5 h-5" />
                </template>
              </UButton>
            </div>
          </div>
        </div>
        <div v-if="isCategory" class="flex items-center border-b">
          <div class="w-[4.5rem] flex-shrink-0 ml-2">
            <span>カテゴリ</span>
          </div>
          <div>
            <svg class="h-full w-6 flex-shrink-0 text-gray-200 dark:text-gray-800" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
            </svg>
          </div>
          <div v-if="item.parentCategory" class="flex flex-wrap gap-y-1">
            <div class="ml-2">
              <UButton :to="'/genre/' + item.genreId" :label="item.parentCategory.name" size="sm" variant="soft" :ui="{ rounded: 'rounded-full' }">
                <template #trailing>
                  <UIcon name="i-heroicons-x-circle" class="w-5 h-5" />
                </template>
              </UButton>
            </div>
            <div class="ml-2">
              <UButton :to="'/category/' + item.parentCategory.id" :label="item.name" size="sm" variant="soft" :ui="{ rounded: 'rounded-full' }">
                <template #trailing>
                  <UIcon name="i-heroicons-x-circle" class="w-5 h-5" />
                </template>
              </UButton>
            </div>
          </div>
          <div v-else class="ml-2">
            <UButton :to="'/genre/' + item.genreId" :label="item.name" size="sm" variant="soft" :ui="{ rounded: 'rounded-full' }">
              <template #trailing>
                <UIcon name="i-heroicons-x-circle" class="w-5 h-5" />
              </template>
              </UButton>
          </div>
        </div>
      </div>

</template>

<script setup lang="ts">
import type {
    paths,
} from "@/types/api/contents";

type Genre = paths["/genre/{genreId}"]["get"]["responses"][200]["content"]["application/json"];
type Category = paths["/category/{categoryId}"]["get"]["responses"][200]["content"]["application/json"];

type Response = Genre | Category;

const props = defineProps<{
  tree?: Response;
  genreId?: string;
  categoryId?: string;
}>();

const item = computed(() => ({ ...props.tree }));

const isGenre = computed(() => {
  const tree = props.tree;
  return tree && 'categories' in tree && Array.isArray(tree.categories);
});

const isCategory = computed(() => {
  const tree = props.tree;
  return tree && 'genreId' in tree && !('categories' in tree);
});
</script>
