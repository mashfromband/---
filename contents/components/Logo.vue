<template>
    <NuxtImg :src=bgImageUrl alt="REALIZE LEARNING" width="200px" />
</template>



<script setup lang="ts">
const bgImageUrl = useStaticCdnUrl("/img/logo_1_b.png").staticCdnUrl;
</script>