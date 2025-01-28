import veProgress from "vue-ellipse-progress";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(veProgress);
});
