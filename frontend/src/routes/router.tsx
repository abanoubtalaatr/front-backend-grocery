import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { paths } from "@/constants/paths";
import { OnboardingPage } from "@/pages/onboarding/OnboardingPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignUpPage } from "@/pages/auth/SignUpPage";
import { SplashPage } from "@/pages/splash/SplashPage";
import { HomePage } from "@/pages/home/HomePage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { VerifyOtpPage } from "@/pages/auth/VerifyOtpPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { CategoriesPage } from "@/pages/category/CategoriesPage";
import { CartPage } from "@/pages/cart/CartPage";
import { CheckoutPage } from "@/pages/checkout/CheckoutPage";
import { OrderCompletePage } from "@/pages/checkout/OrderCompletePage";
import { ProfileLayout } from "@/pages/profile/ProfileLayout";
import { OrderHistoryPage } from "@/pages/profile/OrderHistoryPage";
import { ProfilePlaceholder } from "@/pages/profile/ProfilePlaceholder";
import { OrderPage } from "@/pages/order/OrderPage";
import { HomeLayout } from "@/pages/home/HomeLayout";
import { AuthLayoutPage } from "@/layouts/AuthLayout";
import { RequireGuest } from "@/components/auth/RequireGuest";
import { DashboardPage } from "@/pages/profile/Dashboard";
import { AdressPage } from "@/pages/addresses/AdressPage";
import SmartListPage from "@/pages/smartList/smartListPage";
import { ChatAdLayout } from "@/features/ai";
import { ChatPage } from "@/pages/chat/ChatPage";
import { Loyalty } from "@/pages/loyalty/Loyalty";
import { SupportPage } from "@/pages/support/SupportPage";
import SettingPage from "@/pages/setting/SettingPage";
import { RequireAdmin } from "@/components/auth/RequireAdmin";

/**
 * The admin area is lazy-loaded: shoppers never download the dashboard bundle.
 */
const DashboardLayout = lazy(() =>
  import("@/layouts/DashboardLayout").then((m) => ({ default: m.DashboardLayout })),
);
const AdminOverviewPage = lazy(() =>
  import("@/pages/dashboard/OverviewPage").then((m) => ({ default: m.OverviewPage })),
);
const AdminProductsPage = lazy(() =>
  import("@/pages/dashboard/ProductsPage").then((m) => ({ default: m.ProductsPage })),
);
const AdminCategoriesPage = lazy(() =>
  import("@/pages/dashboard/CategoriesPage").then((m) => ({ default: m.CategoriesPage })),
);
const AdminOrdersPage = lazy(() =>
  import("@/pages/dashboard/OrdersPage").then((m) => ({ default: m.OrdersPage })),
);
const AdminOrderDetailPage = lazy(() =>
  import("@/pages/dashboard/OrderDetailPage").then((m) => ({ default: m.OrderDetailPage })),
);
const AdminOffersPage = lazy(() =>
  import("@/pages/dashboard/OffersPage").then((m) => ({ default: m.OffersPage })),
);
const AdminCustomersPage = lazy(() =>
  import("@/pages/dashboard/CustomersPage").then((m) => ({ default: m.CustomersPage })),
);
const AdminReviewsPage = lazy(() =>
  import("@/pages/dashboard/ReviewsPage").then((m) => ({ default: m.ReviewsPage })),
);
const AdminInboxPage = lazy(() =>
  import("@/pages/dashboard/InboxPage").then((m) => ({ default: m.InboxPage })),
);
const AdminContentPage = lazy(() =>
  import("@/pages/dashboard/ContentPage").then((m) => ({ default: m.ContentPage })),
);
const AdminSettingsPage = lazy(() =>
  import("@/pages/dashboard/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);

export const appRouter = createBrowserRouter(
  [
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        { index: true, element: <Navigate to={paths.home} replace /> },
        { path: paths.home, element: <HomePage /> },
        { path: paths.categories, element: <CategoriesPage /> },
        { path: paths.cart, element: <CartPage /> },
        { path: paths.checkout, element: <CheckoutPage /> },
        { path: paths.orderComplete, element: <OrderCompletePage /> },
        { path: paths.order, element: <OrderPage /> },
      ],
    },
    {
      path: paths.chat,
      element: <ChatAdLayout />,
      children: [{ index: true, element: <ChatPage /> }],
    },
    // Pathless layout: wraps auth screens without adding `/auth` to URLs (absolute child paths stay `/login`, …).
    {
      element: <AuthLayoutPage />,
      children: [
        {
          path: paths.login,
          element: (
            <RequireGuest>
              <LoginPage />
            </RequireGuest>
          ),
        },
        {
          path: paths.signUp,
          element: (
            <RequireGuest>
              <SignUpPage />
            </RequireGuest>
          ),
        },
        {
          path: paths.forgotPassword,
          element: (
            <RequireGuest>
              <ForgotPasswordPage />
            </RequireGuest>
          ),
        },
        {
          path: paths.verifyOtp,
          element: (
            <RequireGuest>
              <VerifyOtpPage />
            </RequireGuest>
          ),
        },
        {
          path: paths.resetPassword,
          element: (
            <RequireGuest>
              <ResetPasswordPage />
            </RequireGuest>
          ),
        },
      ],
    },
    { path: paths.splash, element: <SplashPage /> },
    { path: paths.onboarding, element: <OnboardingPage /> },
    {
      path: paths.profile,
      element: <ProfileLayout />,
      children: [
        { index: true, element: <Navigate to="orders" replace /> },
        {
          path: "dashboard",
          element: (
            <>
            <ProfilePlaceholder
              title="Dashboard"
              description="See recent activity, recommendations, and quick actions for your Grocery+ account."
            />
            <DashboardPage />
            </>
          ),
        },
        {
          path: "personal",
          element: (
            <ProfilePlaceholder
              title="Personal info"
              description="Update your name, email, and phone number."
            />
          ),
        },
        {
          path: "payment",
          element: (
            <ProfilePlaceholder
              title="Payment & Wallet"
              description="Manage saved cards, wallet balance, and billing preferences."
            />
          ),
        },
        { path: "orders", element: <OrderHistoryPage /> },
        {
          path: "lists",
          element: (
            <>
            <ProfilePlaceholder
              title="Smart lists"
                description="Create and manage shopping lists for faster checkout."
              />
              <SmartListPage />
            </>
          ),
        },
        {
          path: "addresses",
          element: (
            <>
            <ProfilePlaceholder
              title="Addresses"
              description="Save home, work, and other delivery addresses."
            />
            <Suspense fallback={<div>Loading...</div>}>
              <AdressPage />
            </Suspense>
            </>
          ),
        },
        {
          path: "security",
          element: (
            <ProfilePlaceholder
              title="Security & login"
              description="Password, two-factor authentication, and active sessions."
            />
          ),
        },
        {
          path: "loyalty",
          element: (
            <>
            <ProfilePlaceholder
              title="Loyalty & rewards"
              description="Track points, tiers, and member-only offers."
            />
            <Suspense fallback={<div>Loading...</div>}>
              <Loyalty />
            </Suspense>
            </>
          ),
        },
        {
          path: "help",
          element: (
            <>
            <ProfilePlaceholder
              title="Help & support"
                description="FAQs, contact options, and order help."
              />
              <Suspense fallback={<div>Loading...</div>}>
                <SupportPage />
              </Suspense>
            </>
          ),
        },
        {
          path: "settings",
          element: (
            <>
            <ProfilePlaceholder
              title="Settings"
              description="Notifications, language, and app preferences."
            />
            <Suspense fallback={<div>Loading...</div>}> 
              <SettingPage />
            </Suspense>
            </>
          ),
        },
      ],
    },
    {
      path: paths.dashboard,
      element: (
        <RequireAdmin>
          <Suspense
            fallback={
              <div className="grid min-h-svh w-full place-items-center">
                <span
                  className="h-8 w-8 animate-spin rounded-full border-2 border-grocery-200 border-t-grocery-900"
                  aria-label="Loading"
                />
              </div>
            }
          >
            <DashboardLayout />
          </Suspense>
        </RequireAdmin>
      ),
      children: [
        { index: true, element: <AdminOverviewPage /> },
        { path: "products", element: <AdminProductsPage /> },
        { path: "categories", element: <AdminCategoriesPage /> },
        { path: "orders", element: <AdminOrdersPage /> },
        { path: "orders/:orderId", element: <AdminOrderDetailPage /> },
        { path: "offers", element: <AdminOffersPage /> },
        { path: "customers", element: <AdminCustomersPage /> },
        { path: "reviews", element: <AdminReviewsPage /> },
        { path: "inbox", element: <AdminInboxPage /> },
        { path: "content", element: <AdminContentPage /> },
        { path: "settings", element: <AdminSettingsPage /> },
      ],
    },
    { path: "*", element: <Navigate to={paths.splash} replace /> },
  ],
  { basename: import.meta.env.BASE_URL },
);
