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
import { Loader2, Plus, Trash2 } from "lucide-react";
import orderApi from "../api";
import { orderSchema } from "../utils/schema";
import { revalidateCache } from "@/lib/queryInstance";
import productApi from "@/pages/products/api";
import { useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";

const AddEdit = ({ open, onClose }) => {
  const { mutateAsync, isPending } = useRequest();

  const form = useFormik({
    schema: orderSchema.validation,
    defaultValues: orderSchema.values(),
    onSubmit,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Show toast for duplicate products error
  useEffect(() => {
    const itemsError = form.formState.errors.items;
    if (itemsError?.root?.message) {
      toast.error("Validation Error", {
        description: itemsError.root.message,
        duration: 4000,
      });
    }
  }, [form.formState.errors.items]);

  async function onSubmit(data) {
    try {
      await mutateAsync({
        data,
        api: orderApi.create,
        cacheKey: orderApi.cacheKey,
        handleDone: async () => {
          form.reset();
          revalidateCache(orderApi.cacheKey);
          revalidateCache(productApi.cacheKey); // Refresh products list (stock changed)
          onClose();
        },
      });
    } catch (error) {
      console.error("Order save error:", error);
    }
  }

  const handleClose = () => {
    if (!isPending) {
      form.reset();
      onClose();
    }
  };

  const addItem = () => {
    append({ product_id: "", quantity: 1 });
  };

  const removeItem = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  console.log("Form errors:", form.formState.errors);

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-150 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Order</SheetTitle>
          <SheetDescription>
            Create a new order with customer details and items
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-5">
          <FormikWrapper form={form}>
            <div className="space-y-5">
              {/* Customer Name */}
              <FieldInput
                form={form}
                name="customer_name"
                label="Customer Name"
                placeholder="Enter customer name"
                required
              />

              {/* Order Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Order Items <span className="text-red-500">*</span>
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addItem}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                {/* Display form-level items error */}
                {form.formState.errors.items?.message && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.items.message}
                  </p>
                )}

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-start gap-2 p-4 border rounded-lg bg-slate-50"
                    >
                      <div className="flex-1 space-y-3">
                        <Select
                          form={form}
                          name={`items.${index}.product_id`}
                          label="Product"
                          placeholder="Select product"
                          api={productApi.list}
                          cacheKey={productApi.cacheKey}
                          filter={{ status: "active" }}
                          optionSchema={{
                            id: "id",
                            label: "name",
                          }}
                          required
                        />

                        <FieldInput
                          form={form}
                          name={`items.${index}.quantity`}
                          label="Quantity"
                          type="number"
                          placeholder="Enter quantity"
                          min={1}
                          required
                        />
                      </div>

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-6"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-(--color-erp-primary) hover:bg-erp-primary/90"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>Create Order</>
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
