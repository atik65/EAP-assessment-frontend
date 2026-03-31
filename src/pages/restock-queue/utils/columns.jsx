import { Button } from "@/components/ui/button";
import { PackagePlus, Trash2 } from "lucide-react";
import ActionDialogDelete from "@/components/common/ActionDialogDelete";
import restockQueueApi from "../api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const restockQueueColumns = [
  {
    header: "PRODUCT NAME",
    accessorKey: "product.name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">
            {row.product?.name}
          </span>
          {/* <span className="text-xs text-slate-500">
            {row.product?.category || "-"}
          </span> */}
        </div>
      );
    },
  },
  {
    header: "CURRENT STOCK",
    accessorKey: "stock_quantity",
    cell: ({ row }) => {
      const isOutOfStock = row.stock_quantity === 0;
      return (
        <span
          className={cn(
            "font-semibold",
            isOutOfStock ? "text-rose-600" : "text-slate-700",
          )}
        >
          {row.product?.stock_quantity}
        </span>
      );
    },
  },
  {
    header: "MIN THRESHOLD",
    accessorKey: "product.min_stock_threshold",
    cell: ({ row }) => {
      return (
        <span className="text-slate-600">
          {row.product?.min_stock_threshold || "-"}
        </span>
      );
    },
  },
  {
    header: "PRIORITY",
    accessorKey: "priority",
    cell: ({ row }) => {
      const priorityStyles = {
        High: "bg-rose-50 text-rose-700 border-rose-200",
        Medium: "bg-amber-50 text-amber-700 border-amber-200",
        Low: "bg-blue-50 text-blue-700 border-blue-200",
      };

      return (
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            priorityStyles[row.priority] || "bg-slate-50 text-slate-700",
          )}
        >
          {row.priority}
        </Badge>
      );
    },
  },
  {
    header: "ADDED DATE",
    accessorKey: "added_at",
    cell: ({ row }) => {
      return (
        <span className="text-slate-600">
          {new Date(row.added_at).toLocaleDateString()}
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
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-600 hover:text-emerald-700 gap-1"
            onClick={() => logics.handleRestock(row)}
          >
            <PackagePlus className="h-4 w-4" />
            <span className="text-xs">Restock</span>
          </Button>

          <ActionDialogDelete
            name={row.product?.name}
            request={{
              id: row.id,
              api: restockQueueApi.delete(row.id),
              cacheKey: restockQueueApi.cacheKey,
            }}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:text-rose-700 gap-1"
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-xs">Remove</span>
              </Button>
            }
          />
        </div>
      );
    },
  },
];
