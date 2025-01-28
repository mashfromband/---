<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
//SEO設定
import { useRoute } from 'vue-router'
import { watch, ref } from 'vue'

// タイトルを動的に管理するための変数
const titleChunk = ref('')

// 現在のルートを取得
const route = useRoute()

// ルートが変わるたびにタイトルを更新
watch(route, async () => {
  // まずはデフォルトのタイトルをリセット
  useHead({
    title: 'REALIZE LEARNING - リアライズラーニング',
    titleTemplate: () => 'REALIZE LEARNING - リアライズラーニング'
  })

  // 動的ルートの場合は Nuxt Content からタイトルを取得
  //  ...できない ayan
  //  titleChunk.value = 動的なタイトル

  // タイトルを更新
  useHead({
    title: titleChunk.value,
    titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} - REALIZE LEARNING - リアライズラーニング` : 'REALIZE LEARNING - リアライズラーニング'
  })
}, { immediate: true }) // ページ読み込み時にも即実行

const fabiconImageUrl = useStaticCdnUrl("/favicon.ico").staticCdnUrl;
const icon192ImageUrl = useStaticCdnUrl("/img/icon_192.png").staticCdnUrl;
const icon512ImageUrl = useStaticCdnUrl("/img/icon_512.png").staticCdnUrl;
const svgiconImageUrl = useStaticCdnUrl("/img/favicon.svg").staticCdnUrl;
const appleiconImageUrl = useStaticCdnUrl("/apple-touch-icon.png").staticCdnUrl;
useHead({
  meta: [
    { // Google Adsense 用
      name: "google-adsense-account",
      content: "ca-pub-6778564467483361",
    },
  ],
  link: [
    {
      rel: 'icon', href: fabiconImageUrl // favicon設定
    },
    {
      rel: 'icon', href: icon192ImageUrl, sizes:'192x192', type:'image/png' // 192icon設定
    },
    {
      rel: 'icon', href: icon512ImageUrl, sizes:'512x512', type:'image/png' // 512icon設定
    },
    {
      rel: 'icon', href: svgiconImageUrl, type:'image/svg+xml' // svgicon設定
    },
    {
      rel: 'apple-touch-icon', href: appleiconImageUrl // apple-touch-icon設定
    }
  ]
})

const socialImageUrl = useStaticCdnUrl("/img/social-card.png").staticCdnUrl;
useSeoMeta({
//  titleTemplate: '%s - REALIZE LEARNING - リアライズラーニング',
  ogImage: socialImageUrl,
  twitterImage: socialImageUrl,
  twitterCard: 'summary_large_image'
})
</script>

<style>
body{
  letter-spacing: 0.15em;
}
/*
 * app.config.ts で class 追加。
 * UNotification プログレスバーの減少方向を逆(左から右)にする。
 */
.el_notification-progress {
  inset-inline: unset;
  bottom: 0;
  right: 0;
}
</style>
