/** 汎用処理用 */
export default defineNuxtRouteMiddleware((to, from) => {
    useCommonAlert().close();
});