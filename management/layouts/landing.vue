<template>
<div>
  <slot />
  <UContainer>
    <UDivider />
      <UFooter class="pb-16 lg:pb-0">
        <template #top>
          <UFooterLinks :links="footerMenu" class="custom-footer-links"
            :ui="{
              wrapper:'md:flex-col lg:flex-row'
            }"
          />
        </template>
        <template #left>
        </template>
        <template #right>
        </template>
        <template #center>
          © {{ new Date().getFullYear() }} BESTPRACTICE Inc.
        </template>
      </UFooter>
  </UContainer>
  <CommonAlert />
</div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()


const footerMenu = [{
  label: '会社概要',
  to: 'https://www.best-practice.co.jp/',
  target: '_blank'
}]
</script>
