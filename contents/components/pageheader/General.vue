<template>
  <div class="overflow-hidden">
    <div class="logo-container relative bg-gradient-to-r from-secondary-500 via-secondary-500 to-el_orange-600 bg-contain bg-no-repeat bg-right" :style="{ '--general-bg-image-url': `url(${bgImageUrl})` }">
      <UPageHeader
        :headline= "headlineTitle"
        :title= "headerTitle"
        :ui="{
          wrapper: 'z-10 py-2 lg:py-8 border-none',
          container:'flex-row lg:flex-row lg:items-center lg:justify-between',
          headline:'pl-4 lg:pl-8 font-medium',
          title:'pl-4 lg:pl-8 text-white',
        }"
      >
      </UPageHeader>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  headline: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'タイトル'  // デフォルト値
  },
  description:{
    type: String,
    default:''
  }
});

const headlineTitle = props.headline
const headerTitle = props.title;
const headerDescription = props.description;

const bgImageUrl = useStaticCdnUrl("/img/logo_3_a.png").staticCdnUrl;
const logoContainer = ref<HTMLElement | null>(null);

</script>

<style scoped>
.logo-container {
  position: relative;
}

.logo-container::after {
  content: "";
  position: absolute;
  top: 0;
  right: -10%;
  bottom: 0;
  left: 0;
  background-image: var(--general-bg-image-url);
  background-repeat: no-repeat;
  background-position: right;
  background-size: 60%;
  z-index: 2;
  pointer-events: none;
}

</style>