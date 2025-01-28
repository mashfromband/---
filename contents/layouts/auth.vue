<template>
  <div class="h-screen flex items-center justify-center overlay">
    <NuxtLink class="absolute top-4" to="/">
      <div class="max-w-sm w-full mx-auto px-4 sm:px-1 lg:px-1 ">
        <LogoWhite />
      </div>
    </NuxtLink>
    <slot />
  </div>
  <CommonAlert />
</template>
