import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import { Loader2, PackagePlus } from "lucide-react";
import restockQueueApi from "../api";
import restockActionSchema from "../utils/schema";
import { revalidateCache } from "@/lib/queryInstance";
import { toast } from "sonner";

const RestockAction = ({ open, onClose, queueItem = null }) => {
  const { mutateAsync, isPending } = useRequest();

  const form = useFormik({
    schema: restockActionSchema.validation,
    defaultValues: restockActionSchema.values(),
    onSubmit,
    mode: "onChange",
  });

  async function onSubmit(data) {
    if (!queueItem?.id) {
      toast.error("No queue item selected");
      return;
    }

    try {
      await mutateAsync({
        data,
        api: restockQueueApi.restock(queueItem.id),
        handleDone: async (response) => {
          form.reset();
          revalidateCache(restockQueueApi.cacheKey);
          toast.success(response?.message || "Stock updated successfully", {
            description: `${queueItem.product?.name} stock updated`,
          });
          onClose();
        },
        isToast: false, // We're handling toast manually for custom message
      });
    } catch (error) {
      console.error("Restock error:", error);
    }
  }

  const handleClose = () => {
    if (!isPending) {
      form.reset();
      onClose();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-135 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5 text-(--color-erp-primary)" />
            Restock Product
          </SheetTitle>
          <SheetDescription>
            Add stock quantity for {queueItem?.product?.name}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-5">
          {/* Product Info Card */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Product Name:</span>
              <span className="text-sm font-medium text-slate-900">
                {queueItem?.product?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Current Stock:</span>
              <span className="text-sm font-semibold text-rose-600">
                {queueItem?.stock_quantity || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Min Threshold:</span>
              <span className="text-sm font-medium text-slate-900">
                {queueItem?.product?.min_stock_threshold || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Priority:</span>
              <span
                className={`text-sm font-medium ${
                  queueItem?.priority === "High"
                    ? "text-rose-600"
                    : queueItem?.priority === "Medium"
                      ? "text-amber-600"
                      : "text-blue-600"
                }`}
              >
                {queueItem?.priority}
              </span>
            </div>
          </div>

          <FormikWrapper form={form}>
            <div className="space-y-5">
              <FieldInput
                form={form}
                name="quantity_to_add"
                label="Quantity to Add"
                type="number"
                placeholder="Enter quantity to add"
                required
                helperText="Enter the amount of stock you want to add"
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isValid}
                  className="flex-1 bg-(--color-erp-primary) hover:bg-erp-primary/90 text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Stock...
                    </>
                  ) : (
                    <>
                      <PackagePlus className="mr-2 h-4 w-4" />
                      Add Stock
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </FormikWrapper>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RestockAction;
