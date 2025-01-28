<template>
  <UPageGrid
      :ui="{
        wrapper: 'mt-8 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3'
      }"
  >
    <NuxtLink v-for="link in processedLinks" :key="link.id" :to="link.url">
      <UPageCard
        class="overflow-hidden"
        :ui="{
          base: 'flex hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
          body: { base:'p-4 min-h-40 lg:min-h-44', background:' bg-gradient-to-b from-transparent via-transparent to-el_orange-600/20', padding:''},
          header: { base:'', background:'bg-secondary-500', padding:'px-0 py-0 sm:px-0'},
          footer: { base:'', background:'', padding:'px-0 py-0 sm:px-0'}
        }"
      >
        <template #header>
          <div class="bg-secondary-500 p-3 lg:p-4">
          </div>
        </template>
        <div class="relative h-full flex flex-col">
          <div>
            <p v-if="link.isClear" class="text-sm leading-5 h-5"><UIcon name="i-heroicons-check-badge" class="w-6 h-6 text-green-600 dark:text-green-300" /></p>
            <h3 class="mt-2 text-base font-semibold">{{ link.name }}</h3>
            <p class="mt-2 text-sm leading-5 overflow-hidden text-ellipsis line-clamp-1 lg:line-clamp-2">{{ link.detail }}</p>
          </div>
          <div class="absolute inset-x-0 bottom-0 mt-2 h-12 overflow-hidden">
            <QuestTagCloud v-if="link.type == 'category'" :category-id=link.id :length="3" />
            <QuestTagCloud v-else :genre-id=link.id :length="3" />
          </div>
        </div>
      </UPageCard>
    </NuxtLink>
  </UPageGrid>

</template>

<script setup lang="ts">
interface ApiResponse {
  id: string;
  name: string;
  detail: string;
  imageSrc?: string;
  type?:string;
  isClear?: boolean;
}
interface Props {
  links: {
    genres?: ApiResponse[];
    categories?: ApiResponse[];
  };
}

const props = defineProps({
  links: {
    type: Object as PropType<Props['links']>,
    default: () => ({})
  }
});

// URLを作る
function generateUrl(link: ApiResponse, type: 'genre' | 'category'): string {
  return `/${type}/${link.id}`;
}

 //デフォルト画像
const bgImageUrl = useStaticCdnUrl('/img/logo_2_b.png').staticCdnUrl;

// processedLinksを作る
const processedLinks = computed(() => {
  let type: 'genre' | 'category' = 'genre';
  let items: ApiResponse[] = [];

  // genres または categories を選択
  if (props.links.genres && props.links.genres.length > 0) {
    type = 'genre';
    items = props.links.genres;
  } else if (props.links.categories && props.links.categories.length > 0) {
    type = 'category';
    items = props.links.categories;
  }

  // itemsをprocessedLinksとして加工
  return items.map(link => {
    const finalImageSrc = link.imageSrc
      ? useStaticCdnUrl(`/img/${link.imageSrc}`).staticCdnUrl
      : bgImageUrl;

    return {
      ...link,
      imageSrc: finalImageSrc,
      url: generateUrl(link, type),
      type:type
    };
  });
});
</script>