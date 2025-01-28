<template>
  <iframe 
    ref="adIframe" 
    :style="{
      height: `${getAdSize.height}px`,
      width: `${getAdSize.width}px`
    }"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
const adIframe = ref<HTMLIFrameElement | null>(null);

type AdSizeType = '300x250'|'728x90'|'468x60'|'160x600';
type AdSize = {
  width: number;
  height: number;
};

const props = withDefaults(defineProps<{
  sizeType: AdSizeType;
  adScriptUrl: string;
}>(),{
  //default
  sizeType:'300x250',
  adScriptUrl:'https://adm.shinobi.jp/s/568fb516ab3f7075b5cb26d53f9e408b'
});

const getAdSize = computed((): AdSize => {
  const [width, height] = props.sizeType.split('x').map(Number);
  return { width, height };
});

/* 忍者Adが提供するスクリプトを注入するHTMLを生成する */
const makeScriptHtml = () => {
  return `
    <body style="margin:0;">
      <script src="${props.adScriptUrl}"><\/script>
    <\/body>
  `;
}

onMounted(() => {
  if (adIframe.value) {
    const iframeDocument = adIframe.value.contentWindow?.document;
    if (iframeDocument) {
      const html = makeScriptHtml();
      iframeDocument.open();
      iframeDocument.write(html);
      iframeDocument.close();
    }
  }
});
</script>