import { Button } from "@/components/ui/button";
import { Eye, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import useRequest from "@/hooks/useRequest";
import orderApi from "../api";
import { revalidateCache } from "@/lib/queryInstance";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-slate-50 text-slate-700 border-slate-200",
};

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const CancelButton = ({ row }) => {
  const { mutateAsync, isPending } = useRequest();

  const handleCancel = async () => {
    try {
      await mutateAsync({
        api: orderApi.cancel(row.id),
        cacheKey: orderApi.cacheKey,
        handleDone: (res) => {
          toast.success(res?.message || "Order cancelled successfully");
          revalidateCache(orderApi.cacheKey);
        },
      });
    } catch (error) {
      console.error("Order cancel error:", error);
    }
  };

  // Don't show cancel button for terminal states
  if (row.status === "delivered" || row.status === "cancelled") {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isPending}>
          <XCircle className="h-4 w-4 text-red-600" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel order {row.order_number}? Stock will
            be restored for all items. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, keep order</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700"
          >
            Yes, cancel order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const orderColumns = [
  {
    header: "ORDER NUMBER",
    accessorKey: "order_number",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{row.order_number}</span>
        </div>
      );
    },
  },
  {
    header: "CUSTOMER NAME",
    accessorKey: "customer_name",
    cell: ({ row }) => {
      return <span className="text-slate-700">{row.customer_name}</span>;
    },
  },
  {
    header: "ITEMS",
    accessorKey: "item_count",
    cell: ({ row }) => {
      return (
        <span className="text-slate-700">
          {row.item_count || 0} {row.item_count === 1 ? "item" : "items"}
        </span>
      );
    },
  },
  {
    header: "TOTAL PRICE",
    accessorKey: "total_price",
    cell: ({ row }) => {
      return (
        <span className="font-medium text-slate-900">
          ${parseFloat(row.total_price || 0).toFixed(2)}
        </span>
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
            statusStyles[row.status] || statusStyles.pending,
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
    cell: ({ row, navigate }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/orders?id=${row.id}`)}
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <CancelButton row={row} />
        </div>
      );
    },
  },
];
