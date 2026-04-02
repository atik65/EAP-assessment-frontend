import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, User, Calendar, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import useApi from "@/hooks/useApi";
import orderApi from "../api";
import Loader from "@/components/common/Loader";
import Select from "@/components/common/select/Select";
import { useState, useEffect } from "react";
import useRequest from "@/hooks/useRequest";
import { revalidateCache } from "@/lib/queryInstance";
import { toast } from "sonner";
import productApi from "@/pages/products/api";

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

// Valid status transitions based on lifecycle
const statusTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [], // Terminal state
  cancelled: [], // Terminal state
};

const statusOptions = [
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const OrderDetail = ({ orderId, onBack }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const { mutateAsync, isPending } = useRequest();

  const { data, isLoading, refetch, isFetching } = useApi({
    api: orderApi.show(orderId),
    cacheKey: [orderApi.cacheKey, orderId],
    trigger: !!orderId,
  });

  const order = data;

  useEffect(() => {
    if (order?.status) {
      setSelectedStatus(order.status);
    }
  }, [order?.status]);

  const handleStatusUpdate = async () => {
    if (selectedStatus === order?.status) {
      toast.info("Status is already set to " + statusLabels[selectedStatus]);
      return;
    }

    try {
      await mutateAsync({
        data: { status: selectedStatus },
        api: orderApi.updateStatus(orderId),
        cacheKey: orderApi.cacheKey,
        handleDone: () => {
          toast.success("Order status updated successfully");
          revalidateCache([orderApi.cacheKey, orderId]);
          revalidateCache(orderApi.cacheKey);
          refetch();
        },
      });
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg font-semibold text-slate-700">Order not found</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    );
  }

  // Get available status options based on current status
  const availableStatuses = statusOptions.filter((option) => {
    if (option.id === order.status) return true; // Current status always available
    return statusTransitions[order.status]?.includes(option.id);
  });

  const canUpdateStatus =
    order.status !== "delivered" && order.status !== "cancelled";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {order.order_number}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Order Details</p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium border",
            statusStyles[order.status] || statusStyles.pending,
          )}
        >
          {statusLabels[order.status] || order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Customer Name</p>
                  <p className="font-medium text-slate-900">
                    {order.customer_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Order Date</p>
                  <p className="font-medium text-slate-900">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Total Amount</p>
                  <p className="font-medium text-slate-900 text-xl">
                    ${parseFloat(order.total_price || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center justify-between p-4 border rounded-lg bg-slate-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {item.product?.name || "Unknown Product"}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Quantity: {item.quantity} × $
                        {parseFloat(item.unit_price || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">
                        ${parseFloat(item.subtotal || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="font-semibold text-slate-900">Total</p>
                <p className="font-bold text-slate-900 text-xl">
                  ${parseFloat(order.total_price || 0).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Update Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {canUpdateStatus ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Order Status
                    </label>
                    <Select
                      placeholder="Select status"
                      manualOption={availableStatuses}
                      optionSchema={{ id: "id", label: "label" }}
                      value={selectedStatus}
                      setValue={setSelectedStatus}
                      inputClassName="w-full"
                    />
                  </div>

                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isPending || selectedStatus === order.status}
                    className="w-full bg-(--color-erp-primary) hover:bg-erp-primary/90"
                  >
                    {isPending ? "Updating..." : "Update Status"}
                  </Button>

                  <div className="text-xs text-slate-500 space-y-1 pt-2 border-t">
                    <p className="font-medium">Status Flow:</p>
                    <p>Pending → Confirmed → Shipped → Delivered</p>
                    <p className="text-amber-600">
                      Orders can be cancelled anytime before delivery
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500">
                    {order.status === "delivered"
                      ? "Order has been delivered. Status cannot be changed."
                      : "Order has been cancelled. Status cannot be changed."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
