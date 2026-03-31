import useSyncParams from "@/hooks/useSyncParams";
import { orderColumns } from "./utils/columns";
import orderApi from "./api";
import { useState } from "react";
import useTable from "@/components/common/table/hooks/useTable";
import AddEdit from "./components/AddEdit";
import OrderDetail from "./components/OrderDetail";
import TableMaker from "@/components/common/table/TableMaker";
import { Button } from "@/components/ui/button";
import TableSearch from "@/components/common/table/TableSearch";
import { Plus } from "lucide-react";
import Select from "@/components/common/select/Select";
import { useSearchParams } from "react-router-dom";

const statusOptions = [
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const orderingOptions = [
  { id: "-created_at", label: "Newest First" },
  { id: "created_at", label: "Oldest First" },
  { id: "order_number", label: "Order Number (A-Z)" },
  { id: "-order_number", label: "Order Number (Z-A)" },
  { id: "total_price", label: "Price (Low to High)" },
  { id: "-total_price", label: "Price (High to Low)" },
];

const OrdersList = () => {
  const { routerSyncParams, searchParamsSyncParams } = useSyncParams();
  const [searchParams] = useSearchParams();
  const search = searchParamsSyncParams?.get("search") || "";
  const statusParam = searchParamsSyncParams?.get("status") || "";
  const orderingParam =
    searchParamsSyncParams?.get("ordering") || "-created_at";
  const orderId = searchParams.get("id");

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAdd = () => {
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const handleStatusChange = (value) => {
    routerSyncParams({ status: value, page: 1 });
  };

  const handleOrderingChange = (value) => {
    routerSyncParams({ ordering: value, page: 1 });
  };

  const handleBackToList = () => {
    routerSyncParams({ id: "" });
  };

  // Table configuration with real API
  const { tableInfo } = useTable({
    filter: {
      search,
      status: statusParam,
      ordering: orderingParam,
    },
    api: orderApi.list,
    apiCacheKey: orderApi.cacheKey,
  });

  // Show detail view if order ID is in URL
  if (orderId) {
    return <OrderDetail orderId={orderId} onBack={handleBackToList} />;
  }

  return (
    <div className="space-y-6">
      <AddEdit open={isSheetOpen} onClose={handleCloseSheet} />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={orderColumns}
          tableInfo={tableInfo}
          showPagination={true}
          render={(tableInfo) => (
            <>
              {/* table search and Add Action */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center flex-col md:flex-row gap-3 justify-between mb-5">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      Orders
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Manage customer orders and track order status
                    </p>
                  </div>
                  <Button
                    className="bg-(--color-erp-primary) hover:bg-erp-primary/90 w-full md:w-auto"
                    onClick={handleAdd}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Order
                  </Button>
                </div>

                <div className="flex items-center gap-2 flex-col md:flex-row">
                  <TableSearch
                    placeholder="Search by order number or customer name..."
                    searchTableParams={search}
                    tableInfo={tableInfo}
                    className="w-full md:w-96 "
                  />
                  <Select
                    inputClassName="min-w-[180px] md:max-w-[200px]"
                    placeholder="All Status"
                    manualOption={statusOptions}
                    optionSchema={{ id: "id", label: "label" }}
                    value={statusParam}
                    setValue={handleStatusChange}
                  />
                  <Select
                    inputClassName="min-w-[200px] md:max-w-[200px]"
                    placeholder="Sort by"
                    manualOption={orderingOptions}
                    optionSchema={{ id: "id", label: "label" }}
                    value={orderingParam}
                    setValue={handleOrderingChange}
                  />
                </div>
              </div>
            </>
          )}
          noDataRender={() => (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold text-slate-700">
                No Orders Found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Try adjusting your search or filters, or create a new order
              </p>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default OrdersList;
