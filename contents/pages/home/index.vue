<template>
  <BreadcrumbLinks v-bind:links="links" />
<UContainer
  :ui="{
    padding: 'px-0 sm:px-0'
  }"
>
  <UPageGrid
    :ui="{
      wrapper:'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-12'
    }"    
  >
    <!--中央カラム-->
    <div class="flex flex-col col-span-full lg:col-span-3 gap-12">

    <!-- 広告SP -->
    <div class="lg:hidden flex justify-center">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/c7cf86a7644ba7a1d2f601492227bc97" />
    </div>

    <!--PCメインメニュー-->
    <MenuBanner :items="mainLinks"/>

    <!-- 広告SP -->
    <div class="lg:hidden flex justify-center">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/ba094e3e6c7f0829cee897eb1673d6e2" />
    </div>

    <!--お知らせ-->
    <UPageCard
      :ui="{
        icon:{
          wrapper:'mb-0 flex',
          base: 'w-10 h-10 flex-shrink-0 text-primary'
        }
      }"
    >
      <FeedNews limit="3" />
      <ElTextLink to="/news">
        <div class="flex justify-end items-center mt-4">
          <span>過去のお知らせ</span>
          <UIcon name="i-heroicons-chevron-right" class="w-6 h-6"/>
        </div>
      </ElTextLink>
    </UPageCard>

    <!--バナーリンク-->
    <!--
    <CarouselBanner />
    -->
    <!--フィード-->
    <FeedQuestWhatNew limit="3"/>
    <FeedFooterCard label="さらにクエストを探す" link="/genre" />

    <!--フィード-->
    <!--
    <FeedWantedAds limit="4"/>
    <FeedFooterCard label="さらに求人を探す" link="/wanted_ads" />
    -->
   
    <!--広告-->
    <div class="hidden lg:flex justify-center">
      <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/8dcc02c9a723b264f17fa025ad9966e3" />
    </div>
    <!-- 広告SP -->
    <div class="lg:hidden flex justify-center">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/36bf5de4bead6447f8afa347f81a494b" />
    </div>

    </div>
    
    <!--右カラム-->
    <div class="flex flex-col col-span-full lg:col-start-4 gap-12">

    <!--広告-->
    <div class="hidden lg:flex justify-center">
      <AdNinja sizeType="160x600" adScriptUrl="https://adm.shinobi.jp/s/15ed5d86c4f5bcfa88d621b64952bd89" />
    </div>

    <!-- 新着タグ -->
    <UPageCard icon="i-heroicons-tag" title="新着タグ"
      :ui="{
        icon:{
          wrapper:'mb-0 flex',
          base: 'w-10 h-10 flex-shrink-0 text-primary'
        }
      }"
    >

      <QuestTagCloud
        :enabledTagLink="true"
        :length="10"
      />
    </UPageCard>

    <!-- 広告SP -->
    <div class="lg:hidden flex justify-center">
      <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/b6df04a8853db185be518bedfb7d102f" />
    </div>

    <!--クエストクリア履歴-->
    <UPageCard icon="i-heroicons-bars-arrow-up" title="クエストクリア履歴" class=""
      :ui="{
        icon:{
          wrapper:'mb-0 flex',
          base: 'w-10 h-10 flex-shrink-0 text-primary'
        }
      }"
    >
      <FeedQuestHistory :limit=4 />
      <ElTextLink to="/home/record/quest">
        <div class="flex justify-end items-center mt-4">
          <span>過去のクエストクリア履歴</span>
          <UIcon name="i-heroicons-chevron-right" class="w-6 h-6"/>
        </div>
      </ElTextLink>
    </UPageCard>
    </div>

  </UPageGrid>
</UContainer>
</template>

<script setup lang="ts">

const links = [
  {
    to: "/home",
    label: "HOME",
    icon:"i-heroicons-home-20-solid",
  }
];

const questList = ref({
  title: '新着クエスト',
  img: useStaticCdnUrl("/img/logo_3_a.png").staticCdnUrl.value,
  icon: '',
  list: [
    {
      name: 'クエスト名クエスト名クエスト名クエスト名クエスト名クエスト名クエスト名クエスト名クエスト名',
      description: '概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト概要テキスト',
      tag: 'ジャンル名ジャンル名ジャンル名ジャンル名ジャンル名ジャンル名ジャンル名ジャンル名',
      to: '/genre'
    },
    {
      name: 'Michael Foster',
      description: '概要テキスト概要テキスト概要テキスト概要テキスト',
      tag: 'Co-Founder / CTO',
      to: '/home/profile'
    },
    {
      name: 'Dries Vincent',
      description: 'dries.vincent@example.com',
      tag: 'Business Relations',
      to: '/home'
    },
    {
      name: 'Lindsay Walton',
      description: 'lindsay.walton@example.com',
      tag: 'Front-end Developer',
      to: '/profile'
    }
  ]
});

const bgImageUrl0 = useStaticCdnUrl("/img/home_quest.jpeg").staticCdnUrl;
const bgImageUrl1 = useStaticCdnUrl("/img/home_wanted_ads.jpeg").staticCdnUrl;

const mainLinks = ref([ 
  {
    link: '/genre',
    headline: 'クエスト',
    text: 'AI時代を生き抜くスキル学習',
    label: 'クエストに挑戦',
    img:bgImageUrl0.value
  },  {
    link: '/wanted_ads',
    headline: '求人',
    text: '理想のキャリアを手に入れよう',
    label: '求人をチェック',
    img:bgImageUrl1.value
  },
])
</script>
