import * as yup from "yup";

const productSchema = {
  validation: yup.object({
    name: yup
      .string()
      .trim()
      .required("Product name is required")
      .max(200, "Product name must not exceed 200 characters"),
    category: yup
      .string()
      .required("Category is required")
      .uuid("Invalid category selected"),
    price: yup
      .number()
      .typeError("Price must be a number")
      .required("Price is required")
      .min(0, "Price must be non-negative"),
    stock_quantity: yup
      .number()
      .typeError("Stock quantity must be a number")
      .required("Stock quantity is required")
      .integer("Stock quantity must be a whole number")
      .min(0, "Stock quantity must be non-negative"),
    min_stock_threshold: yup
      .number()
      .typeError("Minimum stock threshold must be a number")
      .required("Minimum stock threshold is required")
      .integer("Minimum stock threshold must be a whole number")
      .min(0, "Minimum stock threshold must be non-negative"),
  }),
  values: (data) => ({
    name: data?.name || "",
    category: data?.category?.id || data?.category || "",
    price: data?.price || "",
    stock_quantity: data?.stock_quantity ?? "",
    min_stock_threshold: data?.min_stock_threshold ?? "",
  }),
};

export default productSchema;
