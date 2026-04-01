import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TableMaker from "@/components/common/table/TableMaker";
import TableSearch from "@/components/common/table/TableSearch";
import { activityLogColumns } from "./utils/columns";
import activityLogApi from "./api";
import useApi from "@/hooks/useApi";
import useSyncParams from "@/hooks/useSyncParams";
import Loader from "@/components/common/Loader";

const ActivityLog = () => {
  const { routerSyncParams, searchParamsSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;
  const search = searchParams?.get("search") || "";

  // API call (no pagination, always fetch latest 50)
  const { data, isLoading } = useApi({
    api: activityLogApi.list,
    cacheKey: activityLogApi.cacheKey,
    params: {},
    filter: search ? { search } : {},
    trigger: true,
  });

  return (
    <div className="space-y-6">
      {/* <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground">
          Immutable audit trail of all critical system events
        </p>
      </div> */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">
            Recent Activity
          </CardTitle>
          <div className="w-full md:w-96">
            <TableSearch
              placeholder="Search activity..."
              searchTableParams={search}
              tableInfo={{ routerSyncParams }}
              className="w-full"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader message="Loading activity logs..." />
          ) : (
            <TableMaker
              columns={activityLogColumns}
              tableInfo={{
                data: { data: data || [] },
                isLoading: false,
              }}
              showPagination={false}
              noDataRender={() => (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-lg font-semibold text-slate-700">
                    No Activity Found
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    No recent system events to display
                  </p>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;
