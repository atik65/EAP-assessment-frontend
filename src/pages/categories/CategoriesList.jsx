import useSyncParams from "@/hooks/useSyncParams";
import { categoryColumns } from "./utils/columns";
import categoryApi from "./api";
import { useState } from "react";
import useTable from "@/components/common/table/hooks/useTable";
import AddEdit from "./components/AddEdit";
import TableMaker from "@/components/common/table/TableMaker";
import { Button } from "@/components/ui/button";
import TableSearch from "@/components/common/table/TableSearch";
import { Plus } from "lucide-react";

const CategoriesList = () => {
  const { searchParamsSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;

  const search = searchParams?.get("search") || "";

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

  // Table configuration with real API
  const { tableInfo } = useTable({
    filter: {
      search,
    },
    api: categoryApi.list,
    apiCacheKey: categoryApi.cacheKey,
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
          columns={categoryColumns}
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
                      Categories
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Manage product categories for your inventory
                    </p>
                  </div>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto"
                    onClick={handleAdd}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>

                <div className="flex items-center gap-2 flex-col md:flex-row">
                  <TableSearch
                    placeholder="Search by category name..."
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
              <p className="text-lg font-semibold text-slate-700">
                No Categories Found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Try adjusting your search query or create a new category
              </p>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default CategoriesList;
