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
import { Loader2 } from "lucide-react";
import categoryApi from "../api";
import categorySchema from "../utils/schema";

const AddEdit = ({ open, onClose, editData = null }) => {
  const { mutateAsync, isPending } = useRequest();
  const isEditMode = !!editData;

  const form = useFormik({
    schema: categorySchema.validation,
    defaultValues: categorySchema.values(editData),
    onSubmit,
    mode: "onChange",
  });

  async function onSubmit(data) {
    try {
      await mutateAsync({
        id: editData?.id,
        data,
        api: isEditMode ? categoryApi.update(editData.id) : categoryApi.create,
        cacheKey: categoryApi.cacheKey,
        handleDone: async () => {
          onClose();
          form.reset();
        },
      });
    } catch (error) {
      console.error("Category save error:", error);
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
          <SheetTitle>
            {isEditMode ? "Edit Category" : "Add Category"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update the category name below."
              : "Fill in the information to create a new category."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-5">
          <FormikWrapper form={form}>
            <div className="space-y-5">
              <FieldInput
                form={form}
                name="name"
                label="Category Name"
                placeholder="e.g., Electronics, Furniture, etc."
                required
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isValid}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
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
