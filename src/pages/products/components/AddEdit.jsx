import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import Select from "@/components/common/select/Select";
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
import { Loader2 } from "lucide-react";
import productApi from "../api";
import productSchema from "../utils/schema";
import { revalidateCache } from "@/lib/queryInstance";
import categoryApi from "@/pages/categories/api";
import { openModal } from "@/lib/easyModal";

const AddEdit = ({ open, onClose, editData = null }) => {
  const { mutateAsync, isPending } = useRequest();
  const isEditMode = !!editData;

  const form = useFormik({
    schema: productSchema.validation,
    defaultValues: productSchema.values(editData),
    onSubmit,
    mode: "onChange",
  });

  async function onSubmit(data) {
    try {
      await mutateAsync({
        id: editData?.id,
        data,
        api: isEditMode ? productApi.update(editData.id) : productApi.create,
        cacheKey: productApi.cacheKey,
        handleDone: async () => {
          form.reset();
          revalidateCache(productApi.cacheKey);
          onClose();
        },
      });
    } catch (error) {
      console.error("Product save error:", error);
    }
  }

  const handleClose = () => {
    if (!isPending) {
      form.reset();
      onClose();
    }
  };

  const handleAddCategory = () => {
    openModal("category", {
      onClose: () => revalidateCache(categoryApi.cacheKey),
    });
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-135 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditMode ? "Edit Product" : "Add Product"}</SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update the product information below."
              : "Fill in the information to create a new product."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-5">
          <FormikWrapper form={form}>
            <div className="space-y-5">
              <FieldInput
                form={form}
                name="name"
                label="Product Name"
                placeholder="e.g., iPhone 13, Laptop, etc."
                required
              />

              <Select
                form={form}
                name="category"
                label="Category"
                placeholder="Select a category"
                api={categoryApi.list}
                optionSchema={{ id: "id", label: "name" }}
                cacheKey={categoryApi.cacheKey}
                onAddNew={handleAddCategory}
                required
              />

              <FieldInput
                form={form}
                name="price"
                label="Price"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FieldInput
                  form={form}
                  name="stock_quantity"
                  label="Stock Quantity"
                  type="number"
                  placeholder="0"
                  min="0"
                  required
                />

                <FieldInput
                  form={form}
                  name="min_stock_threshold"
                  label="Min Stock Threshold"
                  type="number"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-600">
                  <strong>Note:</strong> Product status is automatically managed
                  based on stock quantity. When stock reaches 0, status changes
                  to "Out of Stock". When stock is replenished, status changes
                  back to "Active".
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isValid}
                  className="flex-1 bg-(--color-erp-primary) hover:bg-erp-primary/90"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEditMode ? "Update" : "Create"}</>
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

export default AddEdit;
