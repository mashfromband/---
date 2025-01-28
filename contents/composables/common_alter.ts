const icons = {
    warn: "i-heroicons-exclamation-triangle",
    success: "i-heroicons-check",
};
type AlertColor = "secondary" | "primary";  //使用可能の色はnuxtuiのAlertColorに制限される

/** アラート状態 */
export const useCommonAlertState = () => useState<{
    icon: string,
    background: AlertColor,
    isOpen: boolean,
    message: string,
    afterRedirectUrl: string | null,
    descriptionDynamicClass: string,
}>(
    "common_alert_state",
    () => {
        const iconDefault = icons.warn;
        const bgDefault = "secondary";
        return {
            icon: iconDefault,
            background: bgDefault,
            isOpen: false,
            message: "",
            afterRedirectUrl: null,
            descriptionDynamicClass: ""
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
        afterRedirectUrl?: string,
        descriptionDynamicClass?: string
    ) => {
        state.value.icon = icon;
        state.value.background = background;
        state.value.message = message;
        state.value.afterRedirectUrl = afterRedirectUrl ? afterRedirectUrl : null;
        state.value.descriptionDynamicClass = descriptionDynamicClass ? descriptionDynamicClass : '';

        state.value.isOpen = true;
    };

    const showSuccess = (
        message: string = "success.",
        afterRedirectUrl?: string
    ) => {
        openAlert(
            icons.success,
            "primary",
            message,
            afterRedirectUrl,
            "text-gray-900 dark:text-white"
        );
    };

    const showWarn = (
        message: string = "warn.",
        afterRedirectUrl?: string
    ) => {
        openAlert(
            icons.warn,
            "secondary",
            message,
            afterRedirectUrl,
            "text-secondary-500 dark:text-secondary-500"
        );
    };

    const showNotFoundWarn = ()=> {
        showWarn("このページは存在しません。もしくはすでに処理が完了したため再表示できません。", "/");
    }

    const close = () => {
        state.value.isOpen = false;
    };

    return {
        showSuccess,
        showWarn,
        showNotFoundWarn,
        close
    };
}
