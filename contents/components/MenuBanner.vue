<template>
    <!-- *need height setting -->
    <div>
      <div v-if="items"
        :class="[
          'grid gap-6 lg:gap-0 min-h-full grid-cols-1 grid-rows-2 lg:grid-rows-1',
          items.length === 1 ? 'lg:grid-cols-1' : items.length >= 2 ? 'lg:grid-cols-2' : ''
        ]"
      >
        <div v-for="(item, index) in props.items" :key="index" class="relative flex">
          <NuxtImg :src="item.img" class="absolute inset-0 h-full w-full object-cover object-center" />
          <div class="relative flex w-full flex-col items-center justify-end bg-black bg-opacity-40 p-8 sm:p-12">
            <h2 class="text-lg font-medium text-white text-opacity-75">{{item.headline}}</h2>
            <p class="mt-1 text-2xl font-medium text-white">{{item.text}}</p>
            <UButton :label="item.label" :to="item.link" size="lg" variant="solid" class="mt-4"><template #trailing><UIcon class="w-4 h-4" name="i-heroicons-chevron-right"/></template></UButton>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">

interface MenuItem {
  link: string;
  label: string;
  img?:string;
  headline?:string;
  text?: string;
}

const bgImageUrl0 = useStaticCdnUrl("/img/logo_3_b.png").staticCdnUrl;

const props = defineProps<{
  items?: MenuItem[];
}>();


</script>

