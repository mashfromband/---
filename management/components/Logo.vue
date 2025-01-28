<template>
    <NuxtImg :src=bgImageUrl alt="REALIZE LEARNING Logo" sizes="200px" />
</template>



<script setup lang="ts">
const bgImageUrl = useStaticCdnUrl("/img/logo_1_a.png").staticCdnUrl;
</script>