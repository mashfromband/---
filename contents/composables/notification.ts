type ToastOptions = Parameters<ReturnType<typeof useToast>["add"]>[0];

export const useNotification = () => {
    const toast = useToast();
    const toastIdSeq = useState("toastIdSeq", () => 0);

    const getToastId = () => String(++toastIdSeq.value);

    const toToastOptions = (options: ToastOptions | string) => {
        return typeof options === "string" ? { description: options } : options;
    };

    const notifySuccess = (options: ToastOptions | string) => {
        return toast.add({
            id: getToastId(),
            icon: "i-heroicons-check",
            color: "primary",
            ui: {
              description: "text-gray-900 dark:text-white",
              background: "bg-primary-50 dark:bg-primary-400",
            },
            ...toToastOptions(options),
        });
    };

    const notifyWarn = (options: ToastOptions | string) => {
        return toast.add({
            id: getToastId(),
            icon: "i-heroicons-exclamation-triangle",
            color: "secondary",
            ui: {
              description: "text-secondary-500 dark:text-secondary-500",
              background: "bg-secondary-50 dark:bg-secondary-400",
            },
            ...toToastOptions(options),
        });
    };

    return {
        notifySuccess,
        notifyWarn,
    };
};
