import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import ActionDialogDelete from "@/components/common/ActionDialogDelete";
import productApi from "../api";
import { cn } from "@/lib/utils";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  out_of_stock: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-slate-50 text-slate-700 border-slate-200",
};

const statusLabels = {
  active: "Active",
  out_of_stock: "Out of Stock",
  archived: "Archived",
};

export const productColumns = [
  {
    header: "PRODUCT NAME",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{row.name}</span>
          {row.is_low_stock && row.status === "active" && (
            <span className="text-xs text-amber-600 flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3" />
              Low stock
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: "CATEGORY",
    accessorKey: "category",
    cell: ({ row }) => {
      return (
        <span className="text-slate-700">{row.category?.name || "-"}</span>
      );
    },
  },
  {
    header: "PRICE",
    accessorKey: "price",
    cell: ({ row }) => {
      return (
        <span className="font-medium text-slate-900">
          ${parseFloat(row.price).toFixed(2)}
        </span>
      );
    },
  },
  {
    header: "STOCK",
    accessorKey: "stock_quantity",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-slate-900">{row.stock_quantity}</span>
          <span className="text-xs text-slate-500">
            Min: {row.min_stock_threshold}
          </span>
        </div>
      );
    },
  },
  {
    header: "STATUS",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium border",
            statusStyles[row.status] || statusStyles.active,
          )}
        >
          {statusLabels[row.status] || row.status}
        </span>
      );
    },
  },
  {
    header: "CREATED DATE",
    accessorKey: "created_at",
    cell: ({ row }) => {
      return (
        <span className="text-slate-600">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      );
    },
  },
  {
    header: "ACTIONS",
    accessorKey: "actions",
    classCell: "justify-end flex",
    classHeader: "justify-end flex items-center",

    cell: ({ row, logics }) => {
      const isArchived = row.status === "archived";

      return (
        <div className="flex items-center gap-2">
          {isArchived ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 cursor-not-allowed gap-1"
              disabled
              title="Cannot edit archived products"
            >
              <Edit className="h-4 w-4" />
              <span className="text-xs">Edit</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 gap-1"
              onClick={() => logics.handleEdit(row)}
            >
              <Edit className="h-4 w-4" />
              <span className="text-xs">Edit</span>
            </Button>
          )}

          <ActionDialogDelete
            name={row.name}
            request={{
              id: row.id,
              api: productApi.delete(row.id),
              cacheKey: productApi.cacheKey,
            }}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:text-rose-700 gap-1"
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-xs">Archive</span>
              </Button>
            }
          />
        </div>
      );
    },
  },
];
