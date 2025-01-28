import { defineStore } from "pinia";

export const useUserStore = defineStore(
    "user",
    () => {
        // 本当はリフレッシュトークンのクッキーをリアクティブ参照したい。
        //   const isLogin = computed(() => !!useCookie("RL_RFT").value),
        // しかし、それができない(クッキー削除が伝播しない)ので、
        // middleware から update() で逐次更新する。
        const isLogin = ref(false);

        const update = () => {
            const newValue = !!useCookie("RL_RFT").value;
            if (newValue !== isLogin.value) {
                console.debug("[useUserStore] isLogin:", newValue);
                isLogin.value = newValue;
            }
        };

        update();

        return {
            isLogin,
            update,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);

export const useUserInfo = defineStore(
    "userInfo",
    () => {
        const userId = ref<string>("");
        const setUserId = (id: string) => {
            userId.value = id;
        }

        const nickName = ref<string>("");
        const setNickName = (nickname: string) => {
            nickName.value = nickname;
        }

        const mailAddress = ref<string>("");
        const setMailAddress = (email: string) => {
            mailAddress.value = email;
        }

        const iconUrl = ref<string>("");
        const setIconUrl = (url: string) => {
            iconUrl.value = url;
        }

        const userLevel = ref<number>(0);
        const setUserLevel = (level: number) => {
            userLevel.value = level;
        }

        const clear = () => {
            setUserId("");
            setNickName("");
            setMailAddress("");
            setIconUrl("");
            setUserLevel(0);
        };

        return {
            userId,
            nickName,
            mailAddress,
            iconUrl,
            userLevel,
            setUserId,
            setNickName,
            setMailAddress,
            setIconUrl,
            setUserLevel,
            clear,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
)
