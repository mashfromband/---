const MAX_PAGE_COUNT = 100;
const DEFAULT_PAGE_COUNT = 10;

export interface UsePaginationParams {
    page?: number;
    total?: number;
    pageCount?: number;
}

/** deprecated */
export const usePagination = (params: UsePaginationParams = {}) => {
    return {
        page: ref(params.page ?? 1),
        total: ref(params.total ?? 0),
        pageCount: ref(Math.min(MAX_PAGE_COUNT, params.pageCount ?? DEFAULT_PAGE_COUNT)),
    };
};

export type UseRoutePaginationParams = Omit<UsePaginationParams, "page">;

export const useRoutePagination = (params: UseRoutePaginationParams = {}) => {
    const route = useRoute();
    const total = ref(params.total ?? 0);
    const pageCount = ref(Math.min(MAX_PAGE_COUNT, params.pageCount ?? DEFAULT_PAGE_COUNT));
    const getRouteLocation = (page: number) => ({ query: { ...route.query, page } });
    const pageWrapper = computed({
        get: () => Number(route.query.page) || 1,
        set: value => navigateTo(getRouteLocation(value), { replace: true }),
    });
    const totalWrapper = computed({
        get: () => total.value,
        set: value => {
            const maxPage = Math.ceil(value / pageCount.value) || 1;
            if (pageWrapper.value > maxPage) {
              pageWrapper.value = maxPage;
            } else {
              total.value = value;
            }
        },
    });
    const lastPage = computed(() => Math.ceil(total.value / pageCount.value) || 1);
    /** deprecated: `page.value = 1` を推奨 */
    const toTopPage = () => {
        navigateTo(getRouteLocation(1), { replace: true })
    };

    return {
        page: pageWrapper,
        total: totalWrapper,
        pageCount,
        lastPage,
        to: getRouteLocation,
        toTopPage,
    };
};
