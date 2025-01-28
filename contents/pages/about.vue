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
        <PageheaderGeneral title="Realize Learningについて" />
        <div class="p-6 bg-gray-50 dark:bg-gray-800/50">
          <UCard>
            <ULandingSection
              :title="page.features.title"
              :ui="{
                wrapper: 'py-0 sm:py-4',
                container:'max-w-screen-lg gap-4 sm:gap-6',
                title: 'text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-3xl'
              }"    
            >
              <UPageGrid
                id="features"
                :ui="{
                  wrapper:'xl:grid-cols-2'
                }"
              >
                <ULandingCard
                  v-for="(item, index) in page.features.items"
                  :key="index"
                  :icon="item.icon"
                  :title="item.title"
                  data-aos="fade-left"
                  :data-aos-delay="index * 100"
                  data-aos-offset="200"
                  :ui="{
                    wrapper: 'before:content-none',
                    container: 'flex flex-wrap items-center',
                    body:{
                      base:'flex',
                    },
                    icon:{
                      wrapper:'mb-0 mr-2 w-8 h-8',
                      base:'text-primary dark:text-primary'
                    }
                  }"
                >
                  <template #description>
                    <p v-html="item.description"></p>
                  </template>
                </ULandingCard>
              </UPageGrid>
            </ULandingSection>
            <ULandingSection
              :headline="page.comingsoon.headline"
              :title="page.comingsoon.title"
              :ui="{
                wrapper: 'py^0 sm:py-4',
                container: 'sm:gap-16',
                headline: 'text-xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white',
                title: 'text-xl sm:text-3xl lg:text-3xl'
              }"    
            >
              <UPageGrid
                id="comingsoon"
                :ui="{
                  wrapper:'xl:grid-cols-3',
                }"
              >
                <ULandingCard
                  v-for="(item, index) in page.comingsoon.items"
                  :key="index"
                  :icon="item.icon"
                  :title="item.title"
                  data-aos="fade-left"
                  :data-aos-delay="index * 100"
                  data-aos-offset="200"
                  :ui="{
                    wrapper: 'before:content-none',
                    container: 'flex items-center',
                    body:{
                      base:'flex-row',
                    },
                    title:'overflow-visible text-overflow-clip whitespace-normal',
                    icon:{
                      wrapper:'mb-0 mr-2 w-8 h-8',
                      base:'text-primary dark:text-primary'
                    }
                  }"
                />
              </UPageGrid>
            </ULandingSection>
            <div class="flex justify-center">
            <AdNinja sizeType="300x250" adScriptUrl="https://adm.shinobi.jp/s/568fb516ab3f7075b5cb26d53f9e408b" />
            </div>
            <ULandingSection
              :headline="page.contents.headline"
              :title="page.contents.title"
              :description="page.contents.description"
              :ui="{
                wrapper:'py-0 sm:py-4',
                  container:'max-w-screen-lg sm:gap-16',
                  title :'text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-3xl'
              }"
            >
              <UPageGrid
                id="contents"
                :ui="{
                  wrapper:'xl:grid-cols-2'
                }"
              >
                <ULandingCard
                  v-for="(item, index) in page.contents.items"
                  :key="index"
                  :icon="item.icon"
                  :title="item.title"
                  data-aos="fade-left"
                  :data-aos-delay="index * 100"
                  data-aos-offset="200"
                  :ui="{
                    wrapper: 'before:content-none',
                    container: 'flex flex-wrap items-center',
                    body:{
                      base:'flex',
                    },
                    icon:{
                      wrapper:'mb-0 mr-2 w-8 h-8 rounded-full bg-secondary-500',
                      base:'text-white mt-1 ml-1 w-6 h-6'
                    }
                  }"
                >
                  <template #description>
                    <p v-html="item.description"></p>
                  </template>
                </ULandingCard>
              </UPageGrid>
            </ULandingSection>
            <ULandingSection class="bg-primary-50 dark:bg-primary-500 dark:bg-opacity-10"
              :ui="{
                wrapper:'sm:py-12',
                container: 'sm:gap-10 flex flex-col'
              }"
            >
              <ULandingCTA
                :title="page.cta.title"
                :card="false"
                :ui="{
                  body:{
                    base:'',
                    padding:'py-0 sm:py-0',
                    background:''
                  },
                }"
              />
              <template #links>
                <UButton v-for="link in page.cta.links" :to="link.to" :label="link.label" :size="link.size" :icon="link.icon" block class="max-w-screen-sm mb-8" />
              </template>
            </ULandingSection>
          </UCard>
        </div>
        <div class="hidden lg:flex justify-center">
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
    label: "Realize Learningについて",
  },
];
</script>
