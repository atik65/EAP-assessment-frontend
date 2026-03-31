import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import ActionDialogDelete from "@/components/common/ActionDialogDelete";

export const categoryColumns = [
  {
    header: "CATEGORY NAME",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{row.name}</span>
        </div>
      );
    },
  },
  {
    header: "PRODUCTS",
    accessorKey: "product_count",
    cell: ({ row }) => {
      return (
        <span className="text-slate-700">
          {row.product_count || 0}{" "}
          {row.product_count === 1 ? "product" : "products"}
        </span>
      );
    },
  },
  {
    header: "CREATED BY",
    accessorKey: "created_by_email",
    cell: ({ row }) => {
      return (
        <span className="text-slate-600">{row.created_by_email || "-"}</span>
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
    cell: ({ row, logics }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 gap-1"
            onClick={() => logics.handleEdit(row)}
          >
            <Edit className="h-4 w-4" />
            <span className="text-xs">Edit</span>
          </Button>
          <ActionDialogDelete
            id={row.id}
            cacheKey="categories"
            title="Delete Category"
            description={`Are you sure you want to delete "${row.name}"? ${
              row.product_count > 0
                ? "This category has products and cannot be deleted."
                : "This action cannot be undone."
            }`}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:text-rose-700 gap-1"
                disabled={row.product_count > 0}
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-xs">Delete</span>
              </Button>
            }
          />
        </div>
      );
    },
  },
];
