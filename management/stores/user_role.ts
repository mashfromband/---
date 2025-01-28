export type UserRoleType = "admin" | "recruitCompany";

export const useUserRoleStore = defineStore(
    "managementUserRole", () => {
        const role = ref<UserRoleType>();

        const isAdmin = computed(() => {
            return role.value === "admin";
        })

        const isRecruitCompany = computed(() => {
            return role.value === "recruitCompany";
        })

        const setRole = (newRole: UserRoleType) => {
            role.value = newRole;
        }

        const clearRole = () => {
            role.value = undefined;
        }

        return {
            role, isAdmin, isRecruitCompany, setRole, clearRole,
        }
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
