<script setup lang="ts">
const bgImageUrl0 = useStaticCdnUrl("/img/logo_2_a.png").staticCdnUrl;
const bgImageUrl1 = useStaticCdnUrl("/img/logo_2_b.png").staticCdnUrl;
const bgImageUrl2 = useStaticCdnUrl("/img/logo_1_a.png").staticCdnUrl;
const items = [{
  id:0,
  to:'/news',
  src:bgImageUrl0.value
}]

const carouselRef = ref()

onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, 6000)
})
</script>

<template>
  <UContainer class="bg-secondary-500 py-8 w-full">
    <!-- link paging off -->
    <UCarousel ref="carouselRef" v-slot="{ item }" :items="items" :ui="{ item: 'basis-full' }"
      class="bg-white dark:bg-gray-800/50 rounded-lg overflow-hidden max-h-64 flex justify-center items-center"
    >
        
      <NuxtImg :src="item.src" class="object-contain max-h-80 max-w-full mx-auto" draggable="false" />
    </UCarousel>
  </UContainer>

</template>

