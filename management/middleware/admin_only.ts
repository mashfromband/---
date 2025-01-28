import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore();
    const { isLogin } = storeToRefs(userStore);
    if (!isLogin.value) {
        return navigateTo({name: "auth-login"});
    }

    const userRoles = useUserRoleStore();
    const { isAdmin } = storeToRefs(userRoles);
    if (!isAdmin.value) {
        useCommonAlert().showWarn(
            "アクセス権限がありません。",
            "/"
        );
        return;
    }
});
