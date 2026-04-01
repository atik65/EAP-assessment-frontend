import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import { Button } from "@/components/ui/button";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../AuthLayout";
import authApi from "../api";
import loginSchema from "./schema";
import Notice from "../notice/Notice";
import { setCookie } from "@/lib/cookies";
import { setStoredValue } from "@/lib/storage";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { mutateAsync } = useRequest();
  const [isDemo, setIsDemo] = useState(false);

  const form = useFormik({
    schema: loginSchema.validation,
    defaultValues: loginSchema.values(),
    onSubmit,
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  // Demo login handler
  function handleDemoLogin() {
    form.setValue("email", "admin@gmail.com");
    form.setValue("password", "password");
    setIsDemo(true);
    form.handleSubmit(onSubmit)();
  }

  async function onSubmit(data) {
    try {
      const { ...loginData } = data;

      await mutateAsync({
        data: loginData,
        api: authApi.login,
        toast: false,
        handleDone: async (res) => {
          // Store user profile in encrypted localStorage
          if (res?.data) {
            setStoredValue("userProfile", res.data);
          }

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
      title="Sign in to Smart Inventory & Order Management System"
      // title="Sign in to your account"
      subtitle="Enter your email and password to access your account."
    >
      {/* <Notice /> */}
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
          {/* main Login */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting && !isDemo ? "Signing in..." : "Sign in"}
          </Button>

          {/* Demo Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isSubmitting}
            onClick={handleDemoLogin}
          >
            {isSubmitting && isDemo
              ? "Signing in..."
              : "Use Demo Account (Admin Mode)"}
          </Button>
          {/* signup will create a normal role account -- so access admin try admin mode */}
          <small className="text-[11px] text-muted-foreground text-center">
            Use the demo account to explore admin features. For regular access,
            please sign up with your email.
          </small>

          {/* don't have an account? */}
          <div className="flex flex-col items-center justify-between text-sm text-muted-foreground">
            <span>Don't have an account?</span>
            <Link
              to="/signup"
              className="font-medium text-purple-800 hover:underline dark:text-emerald-200"
            >
              Sign up
            </Link>
          </div>
        </div>
      </FormikWrapper>
    </AuthLayout>
  );
}
