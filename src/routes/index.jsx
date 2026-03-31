import Login from "@/pages/auth/login/Login";
import Overview from "@/pages/overview/Overview";
import ChangePassword from "@/pages/profile/ChangePassword";
import Profile from "@/pages/profile/Profile";
import UpdateProfile from "@/pages/profile/UpdateProfile";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute, { PublicRoute } from "./ProtectedRoute";
import DemoList from "@/pages/demo/DemoList";
import Signup from "@/pages/auth/signup/Signup";
import ForgotPassword from "@/pages/auth/forgot-password/ForgotPassword";
import VerifyOtp from "@/pages/auth/verify-otp/VerifyOtp";
import ResetPassword from "@/pages/auth/reset-password/ResetPassword";
import CategoriesList from "@/pages/categories/CategoriesList";
import ProductsList from "@/pages/products/ProductsList";
import RestockQueueList from "@/pages/restock-queue/RestockQueueList";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      // { path: "/", element: <Overview /> },
      { path: "/", element: <DemoList /> },
      { path: "/profile", element: <Profile /> },
      { path: "/profile/update", element: <UpdateProfile /> },
      { path: "/profile/change-password", element: <ChangePassword /> },

      // categoreis list
      { path: "/categories", element: <CategoriesList /> },
      { path: "/products", element: <ProductsList /> },
      { path: "/restock-queue", element: <RestockQueueList /> },

      // {
      //   path: "/settings",
      //   children: [],
      // },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Signup /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/verify-otp", element: <VerifyOtp /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
]);
