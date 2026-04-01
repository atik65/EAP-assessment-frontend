import * as yup from "yup";

const signupSchema = {
  validation: yup.object({
    email: yup
      .string()
      .trim()
      .email("Must be a valid email")
      .required("Email is required"),
    username: yup
      .string()
      .trim()
      // .min(3, "Username must be at least 3 characters")
      .notRequired(),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    password2: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    role: yup.string().oneOf(["admin", "manager"]).optional(),
  }),
  values: () => ({
    email: "",
    username: "",
    password: "",
    password2: "",
    role: "manager",
  }),
};

export default signupSchema;
