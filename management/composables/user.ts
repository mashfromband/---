import { defineStore } from "pinia";

export const useUserStore = defineStore(
    "managementUser",
    () => {
        const refreshTokenCookie = useCookie<string | null>("RL_M_RFT");
        const isValidRefreshToken = refreshTokenCookie.value ? true : false;

        const isLogin = ref<boolean>(isValidRefreshToken);
        return {
            isLogin,
        }
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }    
);

export const useUserInfo = defineStore(
    "managementUserInfo",
    () => {
        const userId = ref<string>("");
        const setUserId = (id: string) => {
            userId.value = id;
        }

        const nickName = ref<string>("");
        const setNickName = (name: string) => {
            nickName.value = name;
        }

        const mailAddress = ref<string>("");
        const setMailAddress = (email: string) => {
            mailAddress.value = email;
        }

        return {
            userId,
            setUserId,

            nickName,
            setNickName,

            mailAddress,
            setMailAddress,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
)
