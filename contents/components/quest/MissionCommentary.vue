<template>
  <div class="mission_commentary_body" v-html="commentaryState.commentary">
  </div>
</template>

<script setup lang="ts">
const commentaryState = useMissionCommentary();
</script>
