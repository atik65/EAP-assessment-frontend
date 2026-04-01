import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Package,
} from "lucide-react";
import useApi from "@/hooks/useApi";
import dashboardApi from "./api";
import { cn } from "@/lib/utils";
import Loader from "@/components/common/Loader";

const Dashboard = () => {
  const { data, isLoading } = useApi({
    api: dashboardApi.stats,
    cacheKey: [dashboardApi.cacheKey],
    trigger: true,
  });

  const stats = data || {};

  const kpiCards = [
    {
      title: "Today's Orders",
      value: stats.orders_today || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Orders",
      value: stats.pending_orders || 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Completed Orders",
      value: stats.completed_orders || 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Today's Revenue",
      value: stats.revenue_today
        ? `$${parseFloat(stats.revenue_today).toFixed(2)}`
        : "$0.00",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Low Stock Alerts",
      value: stats.low_stock_count || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const statusConfig = {
    ok: {
      label: "In Stock",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    low_stock: {
      label: "Low Stock",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    out_of_stock: {
      label: "Out of Stock",
      className: "bg-red-50 text-red-700 border-red-200",
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your store's performance and inventory
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpiCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", card.bgColor)}>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Summary Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Inventory Summary
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Current stock status of all products
              </p>
            </div>
            {stats.product_summary && (
              <div className="text-sm text-muted-foreground">
                Total Products: {stats.product_summary.length}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {stats.product_summary && stats.product_summary.length > 0 ? (
            <div className="rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Product Name
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium">
                        Stock Quantity
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.product_summary.map((product, index) => (
                      <tr
                        key={product.id}
                        className={cn(
                          "border-b last:border-0 hover:bg-muted/30 transition-colors",
                          index % 2 === 0 ? "bg-white" : "bg-muted/10",
                        )}
                      >
                        <td className="px-4 py-3 text-sm font-medium">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          <span
                            className={cn(
                              "font-semibold",
                              product.stock_quantity === 0
                                ? "text-red-600"
                                : product.stock_quantity <= 10
                                  ? "text-amber-600"
                                  : "text-emerald-600",
                            )}
                          >
                            {product.stock_quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                              statusConfig[product.status]?.className ||
                                "bg-gray-50 text-gray-700 border-gray-200",
                            )}
                          >
                            {statusConfig[product.status]?.label ||
                              product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
