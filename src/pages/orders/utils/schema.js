import * as yup from "yup";

const orderSchema = {
  validation: yup.object({
    customer_name: yup
      .string()
      .trim()
      .required("Customer name is required")
      .max(200, "Customer name must not exceed 200 characters"),
    items: yup
      .array()
      .of(
        yup.object({
          product_id: yup
            .string()
            .required("Product is required")
            .uuid("Invalid product selected"),
          quantity: yup
            .number()
            .typeError("Quantity must be a number")
            .required("Quantity is required")
            .integer("Quantity must be a whole number")
            .min(1, "Quantity must be at least 1"),
        }),
      )
      .min(1, "At least one item is required")
      .test(
        "unique-products",
        "Duplicate products are not allowed",
        function (items) {
          if (!items) return true;
          const productIds = items.map((item) => item.product_id);
          const uniqueIds = new Set(productIds);
          return productIds.length === uniqueIds.size;
        },
      ),
  }),
  values: (data) => ({
    customer_name: data?.customer_name || "",
    items: data?.items || [{ product_id: "", quantity: 1 }],
  }),
};

const statusUpdateSchema = {
  validation: yup.object({
    status: yup
      .string()
      .required("Status is required")
      .oneOf(
        ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        "Invalid status",
      ),
  }),
  values: (data) => ({
    status: data?.status || "pending",
  }),
};

export { orderSchema, statusUpdateSchema };
