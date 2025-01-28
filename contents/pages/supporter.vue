<template>
  <div v-if="page" class="overflow-hidden">
    <BreadcrumbLinks v-bind:links="links" />
  <UContainer
    :ui="{
      padding: 'px-0 sm:px-0'
    }"
  >
  <UPageGrid
      :ui="{
        wrapper:'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 xl:grid-cols-5'
      }"
    >
      <!--中央カラム-->
      <div class="flex flex-col col-span-full lg:col-span-4">
        <PageheaderGeneral title="サポーターの皆様のご紹介" />
        <div class="p-6 bg-gray-50 dark:bg-gray-800/50">
          <UCard>
            <ULandingSection
              :description="page.testimonials.description"
              :ui="{
                wrapper:'py-0 sm:py-4',
                container: ' gap-4 sm:gap-6'
              }"
            >
              <UPageColumns
                id="testimonials"
                class="xl:columns-2"
              >
                <div
                  v-for="(testimonial, index) in page.testimonials.items"
                  :key="index"
                  class="break-inside-avoid"
                >
                  <ULandingTestimonial v-bind="testimonial"
                    data-aos="zoom-in"
                    :data-aos-delay="index * 100"
                    data-aos-offset="300"
                  />
                </div>
              </UPageColumns>
            </ULandingSection>
          </UCard>
        </div>
        <!--広告-->
        <div class="hidden lg:flex justify-center mt-6">
          <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/d2a0c13c364f0b6cb03808491af06e9d" />
        </div>
      </div>
      <!--右カラム-->
      <div class="flex flex-col col-span-full lg:col-start-5 gap-12">
        <!--広告-->
        <div class="hidden lg:flex justify-center">
          <AdNinja sizeType="160x600" adScriptUrl="https://adm.shinobi.jp/s/5498aaa14e05b5b551c6c3bb0831dc14" />
        </div>
        <div class="lg:hidden flex justify-center">
          <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/8fc25152826f75cc801d3081ea29aa88" />
        </div>
      </div>
  </UPageGrid>
  </UContainer>
</div>
</template>

<script setup lang="ts">
definePageMeta({
  noAuthRequired: true
});

// 表示データ読み込み
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'ページが見つかりません', fatal: true })
}

const links = [
  {
    label: "TOP",
    to: "/",
  },
  {
    label: "サポーターの皆様のご紹介",
  },
];
</script>
