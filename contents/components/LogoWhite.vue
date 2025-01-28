<template>
    <NuxtImg :src=bgImageUrl alt="REALIZE LEARNING" />
</template>



<script setup lang="ts">
const bgImageUrl = useStaticCdnUrl("/img/logo_1_a.png").staticCdnUrl;
</script>