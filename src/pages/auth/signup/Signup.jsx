import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import { Button } from "@/components/ui/button";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import { Link, useNavigate } from "react-router-dom";
import signupSchema from "./schema";
import AuthLayout from "../AuthLayout";
import authApi from "../api";
import Notice from "../notice/Notice";
import { setCookie } from "@/lib/cookies";
import { setStoredValue } from "@/lib/storage";
import { toast } from "sonner";
import { revalidateCache } from "@/lib/queryInstance";
import profileApi from "@/pages/profile/api";

export default function Signup() {
  const navigate = useNavigate();
  const { mutateAsync } = useRequest();

  const form = useFormik({
    schema: signupSchema.validation,
    defaultValues: signupSchema.values(),
    onSubmit,
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(data) {
    const payload = {
      email: data.email,
      username: data.username,
      password: data.password,
      password2: data.password2,
    };

    if (!data?.username) {
      delete payload.username; // Remove username if it's empty
    }

    try {
      await mutateAsync({
        data: payload,
        api: authApi.register,
        isToast: false,
        handleDone: async (res) => {
          revalidateCache(profileApi.cacheKey);

          // Store user profile in encrypted localStorage
          if (res?.data?.user) {
            setStoredValue("userProfile", res.data.user);
          }

          // Set authentication cookie
          // setCookie("signedIn", "true");

          // Show success message
          toast.success("Account created successfully!", {
            description: "Welcome to the Smart Inventory System.",
            duration: 3000,
          });

          // Navigate to login
          navigate("/login");
        },
        handleError: async (res) => {
          console.log(res);
          const errorMessage =
            res?.data?.email?.[0] ||
            res?.data?.password?.[0] ||
            res?.data?.detail ||
            res?.data?.message ||
            res?.data?.username ||
            "Registration failed. Please try again.";

          toast.error("Registration Failed", {
            description: errorMessage,
            duration: 5000,
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up to get started with the Smart Inventory & Order Management System."
    >
      {/* <Notice /> */}
      <FormikWrapper form={form} className="space-y-6">
        <div className="space-y-4">
          <FieldInput
            required
            name="email"
            placeholder="Enter your email"
            label="Email"
            form={form}
            autoComplete="email"
          />
          <FieldInput
            name="username"
            placeholder="Enter username (optional)"
            label="Username"
            form={form}
            autoComplete="username"
          />
          <FieldInput
            required
            name="password"
            type="password"
            placeholder="Create a strong password"
            label="Password"
            form={form}
            autoComplete="new-password"
          />
          <FieldInput
            required
            name="password2"
            type="password"
            placeholder="Confirm your password"
            label="Confirm Password"
            form={form}
            autoComplete="new-password"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          <div className="flex flex-col items-center justify-between text-sm text-muted-foreground">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="font-medium text-purple-800 hover:underline dark:text-emerald-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      </FormikWrapper>
    </AuthLayout>
  );
}
