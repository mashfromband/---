import { FetchError } from "ofetch";
import type {
    paths,
} from "@/types/api/auth";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete" | "options";

export const useSetCallApiHeader = (headers?: any) => {
    const requestHeaders = headers ? headers : {
        "content-type": "application/json; charset=UTF-8"
    };
    if (!("content-type" in requestHeaders)) {
        requestHeaders["content-type"] = "application/json; charset=UTF-8";
    }
    return requestHeaders;
}

export const useApiEndpoint = () => useState<{
    endpoint: string,
}>(
    "apiEndpoint",
    () => {
        const runtimeConfig = useRuntimeConfig();
        return {
            endpoint: runtimeConfig.public.apiEndpoint as string,
        };
    },
);

export const useAuthApiEndpoint = () => useState<{
    endpoint: string,
}>(
    "authApiEndpoint",
    () => {
        const runtimeConfig = useRuntimeConfig();
        return {
            endpoint: runtimeConfig.public.authApiEndpoint as string,
        };
    }
);

const alertRelogin = () => {
    const reloginAlert = useCommonAlert();
    reloginAlert.showWarn(
        "ログインセッションが期限切れです。再度ログインをお願いします。",
        "/auth/login"
    );
    
    return;
}

type postAccessTokenSuccessResponse =
    paths["/auth/accessToken"]["post"]["responses"][200]["content"]["application/json"];

const getAccessTokenUseRefreshToken = async () => {
    const refreshTokenCookie = useCookie("RL_RFT");
    if (!refreshTokenCookie || !refreshTokenCookie.value) {
        return false;
    }

    const runtimeConfig = useRuntimeConfig();
    const url = runtimeConfig.public.authApiEndpoint as string + "/v1/auth/accessToken";
    const requestHeaders = {
        "content-type": "application/json; charset=UTF-8",
    };
    const requestBody = {
        refreshToken: refreshTokenCookie.value,
    };

    try {
        const response = await $fetch<postAccessTokenSuccessResponse>(url, {
            method: "post",
            headers: requestHeaders,
            body: requestBody,
        });

        const accessTokenCookie = useCookie<string | null>("RL_ACT", {
            expires: new Date(response.accessTokenExpireAt * 1000),
        });
        accessTokenCookie.value = response.accessToken;

        const refreshTokenCookie = useCookie<string | null>("RL_RFT", {
            expires: new Date(response.refreshTokenExpireAt * 1000),
        });
        refreshTokenCookie.value = response.refreshToken;

        if (import.meta.server) {
            setRequestHeaderCookie("RL_ACT", response.accessToken);
            setRequestHeaderCookie("RL_RFT", response.refreshToken);
        }
        return response;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// SSR 時、クッキー設定後にそのクッキーを読み込めない不具合への対策。
// リクエストヘッダーを編集することで読み込めるようにする。
// Nuxt 側で不具合が修正されれば、この処理は不要になる。
// 参考: https://github.com/nuxt/nuxt/issues/22631
const setRequestHeaderCookie = (name: string, value: string) => {
    if (value === useCookie(name).value) {
        return;
    }
    const event = useRequestEvent();
    if (!event) {
        console.warn("[setRequestHeaderCookie] request event not found");
        return;
    }
    event.node.req.headers.cookie = [
        event.node.req.headers.cookie,
        name + "=" + encodeURIComponent(value),
    ].filter(Boolean)
    .join("; ");
};

export interface UseCallApiPendingResult<DataT> {
    data: Ref<DataT | undefined>;
    refresh: () => Promise<void>;
    error: Ref<FetchError | undefined>;
    status: Ref<"pending">;
}
export interface UseCallApiSuccessResult<DataT> {
    data: Ref<DataT | undefined>;
    refresh: () => Promise<void>;
    error: Ref<undefined>;
    status: Ref<"success">;
}
export interface UseCallApiErrorResult {
    data: Ref<undefined>;
    refresh: () => Promise<void>;
    error: Ref<FetchError>;
    status: Ref<"error">;
}
export type UseCallApiResult<DataT> = UseCallApiPendingResult<DataT> | UseCallApiSuccessResult<DataT> | UseCallApiErrorResult;

export const useCallApi = async <ResT>(
    url: string,
    options: {
        method: HttpMethod;
        headers?: any;
        query?: Record<string, any>;
        body?: any;
        unuseReloadAccessToken?: boolean;
    },
    withoutAuthorization: boolean = false,
): Promise<UseCallApiResult<ResT>> => {
    const apiUrl = getUrlWithQueryParams(url, options.query);
    const fetchOptions = {
        method: options.method,
        headers: options.headers,
        body: options.body,
    };
    if (!fetchOptions.headers) {
        fetchOptions.headers = {};
    }
    if (!("content-type" in fetchOptions.headers)) {
        fetchOptions.headers["content-type"] = "application/json; charset=UTF-8";
    }

    const refresh = async () => {
        console.debug(`[useCallApi] ${fetchOptions.method}:`, apiUrl);
        let lastError: FetchError | undefined;
        result.status.value = "pending";
        for (let retries = 0; retries < 3; retries++) {
            const accessToken = useCookie("RL_ACT").value;
            if (!withoutAuthorization) {
                fetchOptions.headers["authorization"] = "Bearer " + accessToken;
            }
            try {
                const data = await $fetch<ResT>(apiUrl, fetchOptions);
                console.debug("[useCallApi] data:", data);
                result.data.value = data as unknown as ResT;
                result.error.value = undefined;
                result.status.value = "success";
                return;
            }
            catch (error: any) {
                lastError = error;
                if (error instanceof FetchError) {
                    const responseStatus = error.statusCode || 500;
                    if (!withoutAuthorization && responseStatus == 401) {
                        if (!options.unuseReloadAccessToken) {
                            if (await getAccessTokenUseRefreshToken()) {
                                continue;
                            } else {
                                console.warn("[useCallApi] failed to refresh API token");
                                const newAccessToken = useCookie("RL_ACT").value;
                                if (newAccessToken && newAccessToken !== accessToken) {
                                    console.warn("[useCallApi] API token already changed, retry");
                                    continue;
                                }
                            }
                            alertRelogin();
                        }
                    }
                    break;
                }
                throw error;
            }
        }
        if (!lastError) {
            throw new Error("assertion error: lastError");
        }
        console.error("[useCallApi] error:", lastError);
        result.data.value = undefined;
        result.error.value = lastError;
        result.status.value = "error";
    };

    const result: UseCallApiResult<ResT> = {
        data: ref(),
        refresh: refresh,
        error: ref(),
        status: ref("pending"),
    };
    await refresh();
    return result;
}

// $fetch は、クエリパラメーター中の "," を URL エンコードしない。
// かといって "%2C" を渡すと、それを更に URL エンコードして "%252C" としてしまう。
// (正確には、これは $fetch が使用している ufo.withQuery の挙動)
// よってクエリパラメーターは自力で処理する。
const getUrlWithQueryParams = (url: string, query: Record<string, any> = {}) => {
    const newUrl = new URL(url);
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
            newUrl.searchParams.set(key, String(value));
        }
    }
    return newUrl.toString();
};
