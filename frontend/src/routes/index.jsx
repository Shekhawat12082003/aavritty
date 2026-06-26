import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

import HomePage from '@/pages/Home/HomePage';
import ShopPage from '@/pages/Shop/ShopPage';
import WholesalePage from '@/pages/Wholesale/WholesalePage';
import ProductDetailsPage from '@/pages/ProductDetails/ProductDetailsPage';
import CategoriesPage from '@/pages/Categories/CategoriesPage';
import AboutPage from '@/pages/About/AboutPage';
import ContactPage from '@/pages/Contact/ContactPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import CartPage from '@/pages/Cart/CartPage';
import CheckoutPage from '@/pages/Checkout/CheckoutPage';
import OrdersPage from '@/pages/Orders/OrdersPage';
import WishlistPage from '@/pages/Wishlist/WishlistPage';
import ProfilePage from '@/pages/Profile/ProfilePage';
import VendorDashboardPage from '@/pages/vendor/VendorDashboardPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import DeliveryDashboardPage from '@/pages/delivery/DeliveryDashboardPage';
import SettingsPage from '@/pages/Settings/SettingsPage';
import NotificationsPage from '@/pages/Notifications/NotificationsPage';
import SupportPage from '@/pages/Support/SupportPage';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="wholesale" element={<WholesalePage />} />
        <Route path="product/:slug" element={<ProductDetailsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route path="vendor" element={<DashboardLayout type="vendor" />}>
        <Route path="dashboard" element={<VendorDashboardPage />} />
        <Route path="products" element={<VendorDashboardPage />} />
        <Route path="orders" element={<VendorDashboardPage />} />
        <Route path="analytics" element={<VendorDashboardPage />} />
      </Route>

      <Route path="admin" element={<DashboardLayout type="admin" />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminDashboardPage />} />
        <Route path="orders" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminDashboardPage />} />
        <Route path="analytics" element={<AdminDashboardPage />} />
      </Route>

      <Route path="delivery" element={<DashboardLayout type="delivery" />}>
        <Route path="dashboard" element={<DeliveryDashboardPage />} />
        <Route path="orders" element={<DeliveryDashboardPage />} />
        <Route path="earnings" element={<DeliveryDashboardPage />} />
      </Route>

      <Route path="settings" element={<DashboardLayout type="vendor" />}>
        <Route index element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
