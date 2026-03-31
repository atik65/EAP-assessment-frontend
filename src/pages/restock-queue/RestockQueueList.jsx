import useSyncParams from "@/hooks/useSyncParams";
import { restockQueueColumns } from "./utils/columns";
import restockQueueApi from "./api";
import { useState } from "react";
import useTable from "@/components/common/table/hooks/useTable";
import RestockAction from "./components/RestockAction";
import TableMaker from "@/components/common/table/TableMaker";
import TableSearch from "@/components/common/table/TableSearch";
import { PackageSearch, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RestockQueueList = () => {
  const { searchParamsSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;

  const search = searchParams?.get("search") || "";

  const [isRestockSheetOpen, setIsRestockSheetOpen] = useState(false);
  const [selectedQueueItem, setSelectedQueueItem] = useState(null);

  const handleRestock = (row) => {
    setSelectedQueueItem(row);
    setIsRestockSheetOpen(true);
  };

  const handleCloseRestockSheet = () => {
    setIsRestockSheetOpen(false);
    setSelectedQueueItem(null);
  };

  // Table configuration with real API
  const { tableInfo } = useTable({
    filter: {
      search,
    },
    api: restockQueueApi.list,
    apiCacheKey: restockQueueApi.cacheKey,
  });

  // Calculate priority stats for summary
  const priorityStats = (tableInfo?.data?.results || []).reduce(
    (acc, item) => {
      if (item.priority === "High") acc.high++;
      if (item.priority === "Medium") acc.medium++;
      if (item.priority === "Low") acc.low++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 },
  );

  return (
    <div className="space-y-6">
      <RestockAction
        open={isRestockSheetOpen}
        onClose={handleCloseRestockSheet}
        queueItem={selectedQueueItem}
      />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={restockQueueColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{ handleRestock }}
          render={(tableInfo) => (
            <>
              {/* Header with Stats */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-start flex-col gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <PackageSearch className="h-6 w-6 text-slate-700" />
                      <h1 className="text-2xl font-bold text-slate-900">
                        Restock Queue
                      </h1>
                    </div>
                    <p className="text-sm text-slate-500">
                      Products automatically added when stock falls below
                      threshold. Ordered by urgency (lowest stock first).
                    </p>
                  </div>

                  {/* Priority Summary Badges */}
                  {tableInfo?.data?.results?.length > 0 && (
                    <div className="flex items-center gap-3 flex-wrap w-full">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600">
                          Priority:
                        </span>
                      </div>
                      {priorityStats.high > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-rose-50 text-rose-700 border-rose-200"
                        >
                          High: {priorityStats.high}
                        </Badge>
                      )}
                      {priorityStats.medium > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          Medium: {priorityStats.medium}
                        </Badge>
                      )}
                      {priorityStats.low > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          Low: {priorityStats.low}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 flex-col md:flex-row mt-5">
                  <TableSearch
                    placeholder="Search by product name..."
                    searchTableParams={search}
                    tableInfo={tableInfo}
                    className="w-full md:w-96"
                  />
                </div>
              </div>
            </>
          )}
          noDataRender={() => (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <PackageSearch className="h-16 w-16 text-slate-300 mb-4" />
              <p className="text-lg font-semibold text-slate-700">
                No Products in Restock Queue
              </p>
              <p className="mt-2 text-sm text-slate-500 max-w-md">
                {search
                  ? "No products match your search. Try a different query."
                  : "Great news! All products are adequately stocked. Products will appear here automatically when stock falls below the minimum threshold."}
              </p>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default RestockQueueList;
