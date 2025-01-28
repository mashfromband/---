<template>
  <div class="relative flex justify-center pt-4 lg:py-8 before:h-[30vh] before:w-full before:absolute before:inset-0"
  :class="color.gradient">
    <NuxtImg :src="color.bgImageUrl.value" class="z-[10] max-w-20 lg:max-w-32 rounded-full bg-white translate-y-2" />
  </div>
</template>

<script setup lang="ts">
const bgImageUrl0 = useStaticCdnUrl("/img/logo_3_a.png").staticCdnUrl;
const bgImageUrl1 = useStaticCdnUrl("/img/parts_3.png").staticCdnUrl;

const props = defineProps({
  color: {
    type: String,
    default: 'default'
  }
});

interface style {
  gradient: string;
  bgImageUrl: Ref<string>;
}

const color = computed<style>(() => {
  if (props.color === 'red') {
    return{
      gradient:'before:bg-gradient-to-r before:from-secondary-500 before:to-el_yellow-500',
      bgImageUrl: bgImageUrl0
    } 
  } else if (props.color === 'gray') {
    return{
      gradient: 'before:bg-gradient-to-r before:from-gray-500 before:to-gray-300',
      bgImageUrl: bgImageUrl1
    }
  } else {
    return{
      gradient: 'before:bg-gradient-to-r before:from-secondary-500 before:to-el_yellow-500',
      bgImageUrl: bgImageUrl0
    }
  }
})

</script>