<template>
  <div class="h-screen flex items-center justify-center overlay">
    <NuxtLink class="absolute top-4" to="/">
      <Logo />
    </NuxtLink>
    <div class="error-page">
      <h1>{{ error.statusCode }} - エラーが発生しました</h1>
      <p>{{ error.message || '何か問題が発生しました。' }}</p>
      
      <pre v-if="isDevelop()" v-html="error.stack" class="text-left"></pre>
      <UButton to="/" label="トップに戻る" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Define props for the error object
const props = defineProps<{
  error: {
    statusCode?: number;
    message?: string;
    stack?: string;
  };
}>();

const error = props.error || { statusCode: 500, message: '何か問題が発生しました。' };

const isDevelop = () => {
  return process.env.NODE_ENV == 'development'; //production | development
}
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

</style>
