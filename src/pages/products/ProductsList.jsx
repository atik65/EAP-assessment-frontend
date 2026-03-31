import useSyncParams from "@/hooks/useSyncParams";
import { productColumns } from "./utils/columns";
import productApi from "./api";
import { useState } from "react";
import useTable from "@/components/common/table/hooks/useTable";
import AddEdit from "./components/AddEdit";
import TableMaker from "@/components/common/table/TableMaker";
import { Button } from "@/components/ui/button";
import TableSearch from "@/components/common/table/TableSearch";
import { Plus, Filter } from "lucide-react";
import Select from "@/components/common/select/Select";
import categoryApi from "@/pages/categories/api";

const statusOptions = [
  { id: "active", label: "Active" },
  { id: "out_of_stock", label: "Out of Stock" },
  { id: "archived", label: "Archived" },
];

const orderingOptions = [
  { id: "name", label: "Name (A-Z)" },
  { id: "-name", label: "Name (Z-A)" },
  { id: "price", label: "Price (Low to High)" },
  { id: "-price", label: "Price (High to Low)" },
  { id: "stock_quantity", label: "Stock (Low to High)" },
  { id: "-stock_quantity", label: "Stock (High to Low)" },
  { id: "created_at", label: "Oldest First" },
  { id: "-created_at", label: "Newest First" },
];

const ProductsList = () => {
  const { routerSyncParams, searchParamsSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;

  const search = searchParams?.get("search") || "";
  const statusParam = searchParams?.get("status") || "";
  const categoryParam = searchParams?.get("category") || "";
  const orderingParam = searchParams?.get("ordering") || "-created_at";

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleAdd = () => {
    setEditData(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditData(null);
  };

  const handleStatusChange = (value) => {
    routerSyncParams({ status: value, page: 1 });
  };

  const handleCategoryChange = (value) => {
    routerSyncParams({ category: value, page: 1 });
  };

  const handleOrderingChange = (value) => {
    routerSyncParams({ ordering: value, page: 1 });
  };

  // Table configuration with real API
  const { tableInfo } = useTable({
    filter: {
      search,
      status: statusParam,
      category: categoryParam,
      ordering: orderingParam,
    },
    api: productApi.list,
    apiCacheKey: productApi.cacheKey,
  });

  return (
    <div className="space-y-6">
      <AddEdit
        open={isSheetOpen}
        onClose={handleCloseSheet}
        editData={editData}
      />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={productColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{ handleEdit }}
          render={(tableInfo) => (
            <>
              {/* table search and Add Action */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center flex-col md:flex-row gap-3 justify-between mb-5">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      Products
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Manage your inventory and product details
                    </p>
                  </div>
                  <Button
                    className="bg-(--color-erp-primary) hover:bg-erp-primary/90 w-full md:w-auto"
                    onClick={handleAdd}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 flex-col md:flex-row mb-0">
                    <TableSearch
                      placeholder="Search by product name..."
                      searchTableParams={search}
                      tableInfo={tableInfo}
                      className="w-full md:flex-1"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 ">
                    <Select
                      inputClassName="min-w-[140px]"
                      placeholder="All Status"
                      optionSchema={{ id: "id", label: "label" }}
                      manualOption={statusOptions}
                      value={statusParam}
                      setValue={handleStatusChange}
                    />

                    <Select
                      inputClassName="min-w-[140px]"
                      placeholder="All Categories"
                      api={categoryApi.list}
                      optionSchema={{ id: "id", label: "name" }}
                      value={categoryParam}
                      setValue={handleCategoryChange}
                    />

                    <Select
                      inputClassName="min-w-[140px]"
                      placeholder="Sort by..."
                      optionSchema={{ id: "id", label: "label" }}
                      manualOption={orderingOptions}
                      value={orderingParam}
                      setValue={handleOrderingChange}
                    />

                    {(statusParam || categoryParam || search) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          routerSyncParams({
                            status: "",
                            category: "",
                            search: "",
                            page: 1,
                          })
                        }
                        className="text-slate-600 hover:text-slate-900"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          noDataRender={() => (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold text-slate-700">
                No Products Found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Try adjusting your filters or create a new product
              </p>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default ProductsList;
