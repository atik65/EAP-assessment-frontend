import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import { Button } from "@/components/ui/button";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../AuthLayout";
import authApi from "../api";
import loginSchema from "./schema";
import { setCookie } from "@/lib/cookies";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { mutateAsync } = useRequest();

  const form = useFormik({
    schema: loginSchema.validation,
    defaultValues: loginSchema.values(),
    onSubmit,
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(data) {
    try {
      const { ...loginData } = data;

      await mutateAsync({
        data: loginData,
        api: authApi.login,
        toast: false,
        handleDone: async (res) => {
          // if (res?.data?.otp_type) {
          //   navigate("/verify-otp", {
          //     state: { email: data.email, type: res.data.otp_type },
          //   });
          // } else {
          //   setCookie("signedIn", "true");
          //   navigate("/");
          // }

          // console.log(res);
          // return;

          setCookie("signedIn", "true");
          navigate("/");
        },
        handleError: async (res) => {
          console.log(res);
          const errorMessage =
            res?.data?.detail ||
            res?.data?.message ||
            "Login failed. Please try again.";

          // toast.error(errorMessage, {
          //   description: "Please check your credentials and try again.",
          //   duration: 5000,
          // });
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthLayout
      // title="Sign in to Smart Inventory & Order Management System"
      title="Sign in to your account"
      subtitle="Enter your email and password to access your account."
    >
      <FormikWrapper form={form} className="space-y-6">
        <div className="space-y-4">
          <FieldInput
            required
            name="email"
            placeholder="Enter your email"
            label={"Email"}
            form={form}
            autoComplete="email"
          />

          <FieldInput
            required
            autoComplete="current-password"
            type="password"
            name="password"
            placeholder="Enter your password"
            label={"Password"}
            form={form}
          />

          {/* <Editor
            name="otp"
            form={form}
            label="One-time code (OTP)"
            placeholder="Enter your OTP"
            description="Provide the 6-digit code from your authenticator app."
          /> */}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          {/* <div className="flex flex-col items-center justify-between text-sm text-muted-foreground">
            <Link
              to="/forgot-password"
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-200"
            >
              Forgot password?
            </Link>
            <div className="flex items-center gap-1">
              <span>New to the console?</span>
              <Link
                to="/register"
                className="font-medium text-emerald-700 hover:underline dark:text-emerald-200"
              >
                Request access
              </Link>
            </div>
          </div> */}
        </div>
      </FormikWrapper>
    </AuthLayout>
  );
}
