export const useStaticCdnUrl = (urlRef: MaybeRefOrGetter<string>) => {
    const staticCdnUrl = ref("");
    const { staticCdnBaseUrl } = useRuntimeConfig().public;

    watchEffect(() => {
        let url = toValue(urlRef);
        if (staticCdnBaseUrl) {
            if (!url.startsWith("/")) {
                url = "/" + url;
            }
            url = staticCdnBaseUrl + url;
        }
        staticCdnUrl.value = url;
    });

    return { staticCdnUrl };
}

export const useQuestMissionCdnBaseUrl = () => useState<{
    baseUrl: string,
}>(
    "questMissionCdnBaseUrl",
    () => {
        const runtimeConfig = useRuntimeConfig();
        return {
            baseUrl: runtimeConfig.public.questMissionCdnBaseUrl as string,
        };
    }
);
