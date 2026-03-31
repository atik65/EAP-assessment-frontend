import * as yup from "yup";

const categorySchema = {
  validation: yup.object({
    name: yup
      .string()
      .trim()
      .required("Category name is required")
      .max(100, "Category name must not exceed 100 characters"),
  }),
  values: (data) => ({
    name: data?.name || "",
  }),
};

export default categorySchema;
