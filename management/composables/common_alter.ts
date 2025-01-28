const icons = {
    warn: "i-heroicons-exclamation-triangle",
    success: "i-heroicons-check",
};
type AlertColor = "red" | "green";  //使用可能の色はnuxtuiのAlertColorに制限される

/** アラート状態 */
export const useCommonAlertState = () => useState<{
    icon: string,
    background: AlertColor,
    isOpen: boolean,
    message: string,
    afterRedirectUrl: string | null,
}>(
    "common_alert_state",
    () => {
        const iconDefault = icons.warn;
        const bgDefault = "red";
        return {
            icon: iconDefault,
            background: bgDefault,
            isOpen: false,
            message: "",
            afterRedirectUrl: null,
        };
    }
)

/** アラート制御処理 */
export const useCommonAlert =  () => {
    const state = useCommonAlertState();

    const openAlert = (
        icon: string,
        background: AlertColor,
        message: string,
        afterRedirectUrl?: string
    ) => {
        const redirectUrl = afterRedirectUrl ? afterRedirectUrl : null;

        state.value.icon = icon;
        state.value.background = background;
        state.value.message = message;
        state.value.afterRedirectUrl = redirectUrl;

        state.value.isOpen = true;
    };

    const showSuccess = (
        message: string = "success.",
        afterRedirectUrl?: string
    ) => {
        openAlert(
            icons.success,
            "green",
            message,
            afterRedirectUrl
        );
    };

    const showWarn = (
        message: string = "warn.",
        afterRedirectUrl?: string
    ) => {
        openAlert(
            icons.warn,
            "red",
            message,
            afterRedirectUrl
        );
    };

    const showInputWarning = () => {
        showWarn("入力項目に不備があります。");
    }

    const close = () => {
        state.value.isOpen = false;
    };

    onUnmounted(close);

    return {
        showSuccess,
        showWarn,
        showInputWarning,
        close
      };
}
