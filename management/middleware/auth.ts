import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore();
    const { isLogin } = storeToRefs(userStore);
    if (!isLogin.value) {
        return navigateTo({name: "auth-login"});
    }

    const userRoles = useUserRoleStore();
    const { isAdmin, isRecruitCompany } = storeToRefs(userRoles);
    if (!isAdmin && !isRecruitCompany) {
        return navigateTo({name: "auth-login"});
    }
});
