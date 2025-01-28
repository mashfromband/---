<template>
  <AppHeader />
    <slot />
  <AppFooter />
  <CommonAlert />
  <FooterMenu class="lg:hidden" />
</template>

<script setup lang="ts">
import { _container } from '#tailwind-config/theme';

const appConfig = useAppConfig()
</script>
