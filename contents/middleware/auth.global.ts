export default defineNuxtRouteMiddleware((to) => {
    const userStore = useUserStore();
    {
        const wasLogin = userStore.isLogin;
        userStore.update();
        if (!userStore.isLogin && wasLogin) {
            useUserInfo().clear();
        }
    }

    if (to.meta.noAuthRequired) {
        return;
    }

    if (!userStore.isLogin) {
        return navigateTo({name: "auth-login"});
    }
});
