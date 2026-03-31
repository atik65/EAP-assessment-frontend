import * as yup from "yup";

const restockActionSchema = {
  validation: yup.object({
    quantity_to_add: yup
      .number()
      .typeError("Quantity must be a number")
      .required("Quantity is required")
      .positive("Quantity must be greater than 0")
      .integer("Quantity must be a whole number"),
  }),
  values: (data) => ({
    quantity_to_add: data?.quantity_to_add || "",
  }),
};

export default restockActionSchema;
