<template>
  <div class="mission_question_body" v-html="question.body">
  </div>
</template>

<script setup lang="ts">
const question = useQuestionBodyHtml();
</script>
