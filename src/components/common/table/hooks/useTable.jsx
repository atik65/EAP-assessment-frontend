import useApi from "@/hooks/useApi";
import useSyncParams from "@/hooks/useSyncParams";
import useSelect from "./useSelect";
import { useEffect } from "react";

const useTable = ({ filter, api, apiCacheKey, staleTime }) => {
  const { selectedRows, handleRowSelect, handleSelectAll, handleUnselectAll } =
    useSelect();

  const { routerSyncParams, searchParamsSyncParams } = useSyncParams();

  const searchParams = searchParamsSyncParams;
  const pageParams = searchParams?.get("page");
  const per_pageParams = searchParams?.get("per_page");
  const page =
    (isNaN(per_pageParams) || pageParams) < 1 ? 1 : (pageParams ?? 1);
  const per_page =
    (isNaN(per_pageParams) || per_pageParams < 1 ? 10 : per_pageParams) ?? 10;

  const { data, isLoading, isFetching } = useApi({
    params: {
      page,
      limit: per_page,
      ...filter,
    },
    api,
    cacheKey: apiCacheKey,
    staleTime,
  });

  useEffect(() => {
    handleUnselectAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsSyncParams]);

  // Django REST Framework pagination response:
  // {
  //   "count": 1,
  //   "next": null,
  //   "previous": null,
  //   "results": [...]
  // }

  // console.log("Table Data:", data); // Debug log for API response

  // Calculate pagination values based on DRF response
  const total = data?.count || 0;
  const currentPage = Number(page);
  const itemsPerPage = Number(per_page);
  const lastPage = Math.ceil(total / itemsPerPage) || 1;
  const from = total > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const to = Math.min(currentPage * itemsPerPage, total);

  const tableInfo = {
    data: {
      data: data?.results || [],
      items: data?.results || [], // For select all functionality
    },
    pagination: {
      page: currentPage,
      per_page: itemsPerPage,
      total,
      lastPage,
      from,
      to,
      next_page: data?.next ? currentPage + 1 : null,
      prev_page: data?.previous ? currentPage - 1 : null,
    },
    routerSyncParams,
    handleRowSelect,
    handleSelectAll,
    handleUnselectAll,
    selectedRows,
    cacheKey: apiCacheKey,
    isLoading: isLoading || isFetching,
  };
  return { tableInfo };
};
export default useTable;
