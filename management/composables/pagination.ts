const MAX_PAGE_COUNT = 100;
const DEFAULT_PAGE_COUNT = 10;

export interface UsePaginationParams {
    page?: number;
    total?: number;
    pageCount?: number;
}

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
    const page = computed(() => Number(route.query.page) || 1);
    const total = ref(params.total ?? 0);
    const pageCount = ref(Math.min(MAX_PAGE_COUNT, params.pageCount ?? DEFAULT_PAGE_COUNT));
    const getRouteLocation = (page: number) => ({ query: { page } });
    const totalWrapper = computed({
        get() { return total.value; },
        set(value) {
            const maxPage = Math.ceil(value / pageCount.value) || 1;
            if (page.value > maxPage) {
              navigateTo(getRouteLocation(maxPage), { replace: true });
            } else {
                total.value = value;
            }
        },
    });
    const lastPage = computed(() => Math.ceil(total.value / pageCount.value) || 1);
    return {
        page,
        total: totalWrapper,
        pageCount,
        lastPage,
        to: getRouteLocation,
    };
};
