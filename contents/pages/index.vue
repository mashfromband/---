<template>
  <AppHeader />
  <div v-if="page" class="overflow-hidden">
    <div class="logo-container relative bg-gradient-to-l from-secondary-500 via-secondary-500 to-el_orange-600" :style="{ '--landing-bg-image-url': `url(${bgImageUrl0})` }">
      <div class="flex justify-center bg-el_red-500">
        <UHorizontalNavigation :links="links" class="max-w-screen-md justify-center"
          :ui="{
            base :'text-xs tracking-tighter lg:tracking-widest lg:text-sm',
            inactive: 'text-white',
            active: 'after:bg-el_red-500',
            label: 'text-wrap lg:truncate',
          }"
        />
      </div>
      <div class="lg:hidden relative w-full max-w-screen-lg mx-auto">
        <NuxtImg :src="ctaImageUrl3" class="absolute top-2 left-2 -translate-x-1/2 w-20 h-20 z-10" data-aos="zoom-out" data-aos-delay="2000" />
      </div>
      <div class="hidden lg:block relative w-full max-w-screen-lg mx-auto">
        <NuxtImg :src="ctaImageUrl3" class="absolute top-10 left-20 -translate-x-1/2 w-40 h-40 z-10" data-aos="zoom-out" data-aos-delay="2000" />
      </div>
      <!-- 広告 -->
      <div class="hidden lg:flex justify-end z-10 absolute top-16 right-6">
        <AdNinja sizeType="300x250" adScriptUrl="https://adm.shinobi.jp/s/568fb516ab3f7075b5cb26d53f9e408b" />
      </div>
      <ULandingSection
        :links="page.hero.links"
        :ui="{
          wrapper : 'relative z-10 py-20 sm:py-10',
          container: 'gap-8 sm:gap-4 lg:gap-4',
          headline: 'text-2xl lg:text-5xl text-white',
          title:'text-white',
          links:'mt-8 flex flex-wrap gap-x-3 gap-y-1.5'
        }"
      >
        <template #headline>
          <span data-aos="zoom-in" data-aos-duration="2000" v-html="page.hero.headline.label" />
        </template>
        <template #title>
          <span data-aos="zoom-in" data-aos-duration="2000" v-html="page.hero.title" />
        </template>
        <div class="flex justify-center">
          <NuxtImg :src=bgImageUrl1 class="max-w-svw h-auto lg:max-h-28" alt="リアライズラーニング -REALIZE LEARNING-"/>
        </div>
        <template #links>
          <div class="flex flex-wrap lg:flex-nowrap justify-center gap-6">
            <div v-for="link in page.hero.links">
              <UButton :to="link.to" class="min-w-64 max-w-full" block :label="link.label" :color="link.color" size="xl" :icon="link.icon" :trailing="link.trailing"/>
            </div>
          </div>
          <!-- 広告SP -->
          <div class="lg:hidden flex justify-center mt-6">
            <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/e75c11052813a0c07e56527b434cb46b" />
          </div>
        </template>
        <template #bottom>
          <div class="mt-4 flex flex-col sm:flex-row justify-center items-center gap-5 lg:gap-8 py-0 overflow-hidden">
            <div v-for="pics in landingPics" :key="pics.id" class="aspect-[9/10] w-52 max-w-full overflow-hidden"
              :data-aos="pics.id % 2 === 0 ? 'flip-left' : 'flip-right'"
              :data-aos-delay="pics.id * 500"
            >
              <NuxtImg v-if="pics.url && pics.url.value" class="absolute inset-0 h-full w-full object-contain" :src= pics.url.value alt="" />
            </div>
          </div>
        </template>
      </ULandingSection>
    </div>
    <ULandingSection
      :title="page.features.about"
      :ui="{
        wrapper:'bg-secondary-500 sm:py-16',
        title:'text-white',
        description:'text-left text-white max-w-screen-lg'
      }"
    >
      <template #top>
        <div class="flex justify-center">
          <NuxtImg :src=bgImageUrl2 class="lg:mb-6 h-16 lg:h-16" alt="リアライズラーニング -REALIZE LEARNING-"/>
        </div>
      </template>
      <template #description>
        <p v-html="page.features.description" class="mt-6"></p>
        <!-- 広告 -->
        <div class="flex justify-center mt-6">
          <AdNinja sizeType="300x250" adScriptUrl="https://adm.shinobi.jp/s/568fb516ab3f7075b5cb26d53f9e408b" />
        </div>
      </template>
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
</div>
</template>

<script setup lang="ts">
// ランディングページ用専用layout読み込み
definePageMeta({
  layout: 'landing',
  noAuthRequired: true
});

// 表示データ読み込み
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'ページが見つかりません', fatal: true })
}

// CTA画像
const ctaImageUrl0 = useStaticCdnUrl("/img/landing/lp-mv-img-01.png").staticCdnUrl;
const ctaImageUrl1 = useStaticCdnUrl("/img/landing/lp-mv-img-02.png").staticCdnUrl;
const ctaImageUrl2 = useStaticCdnUrl("/img/landing/lp-mv-img-03.png").staticCdnUrl;
const ctaImageUrl3 = useStaticCdnUrl("/img/landing/lp-mv-img-04-2.png").staticCdnUrl;
const ctaImageUrl4 = useStaticCdnUrl("/img/logo_2_a.png").staticCdnUrl;

const landingPics = [
  {id:0,url: ctaImageUrl0},
  {id:1,url: ctaImageUrl1},
  {id:2,url: ctaImageUrl2},
  //{id:3,url: ctaImageUrl3},
  //{id:4,url: ctaImageUrl4}
]

let rotations = ['rotate-2', '-rotate-2', 'rotate-2', '-rotate-2', 'rotate-2']

// 上部ロゴ画像
const bgImageUrl0 = useStaticCdnUrl("/img/logo_3_a.png").staticCdnUrl;
const bgImageUrl1 = useStaticCdnUrl("/img/logo_1_c.png").staticCdnUrl;
const bgImageUrl2 = useStaticCdnUrl("/img/logo_3_b.png").staticCdnUrl;

// リンク直打ち
const links = [
  {
    label : 'Realize Learningについて ＞',
    to : '/about'
  }, {
    label: '学習の流れ ＞',
    to: '/howto',
  }, {
    label: 'サポーターの皆様のご紹介 ＞',
    to: '/supporter',
  }, {
    label: 'よくある質問 ＞',
    to: '/faq',
  }
]
</script>

<style scoped>
.logo-container {
  position: relative;
}

.logo-container::after {
  content: "";
  position: absolute;
  top: 3%;
  right: 0;
  bottom: 0;
  left: -25%;
  background-image: var(--landing-bg-image-url);
  background-repeat: no-repeat;
  background-position: left top;
  background-size: 80vw;
  z-index: 2;
  pointer-events: none;
  overflow:hidden;
  }

  @media (min-width: 648px) {
.logo-container::after {
  top: 0;
  right: 0;
  bottom: 0;
  left: -15%;
  background-size: 55vw;
}
}


</style>