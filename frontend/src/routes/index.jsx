import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';

import HomePage from '@/pages/Home/HomePage';
import ShopPage from '@/pages/Shop/ShopPage';
import WholesalePage from '@/pages/Wholesale/WholesalePage';
import ProductDetailsPage from '@/pages/ProductDetails/ProductDetailsPage';
import CategoriesPage from '@/pages/Categories/CategoriesPage';
import AboutPage from '@/pages/About/AboutPage';
import ContactPage from '@/pages/Contact/ContactPage';
import CartPage from '@/pages/Cart/CartPage';
import CheckoutPage from '@/pages/Checkout/CheckoutPage';
import OrdersPage from '@/pages/Orders/OrdersPage';
import OrderDetailPage from '@/pages/Orders/OrderDetailPage';
import WishlistPage from '@/pages/Wishlist/WishlistPage';
import ProfilePage from '@/pages/Profile/ProfilePage';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage';
import DeliveryDashboardPage from '@/pages/delivery/DeliveryDashboardPage';
import SettingsPage from '@/pages/Settings/SettingsPage';
import NotificationsPage from '@/pages/Notifications/NotificationsPage';
import SupportPage from '@/pages/Support/SupportPage';
import PaymentPage from '@/pages/Payment/PaymentPage';
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
        <Route path="payment" element={<PaymentPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="admin/login" element={<AdminLogin />} />

      <Route path="admin" element={<DashboardLayout type="admin" />}>
        <Route element={<AdminProtectedRoute />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="delivery" element={<DashboardLayout type="delivery" />}>
        <Route path="dashboard" element={<DeliveryDashboardPage />} />
        <Route path="orders" element={<DeliveryDashboardPage />} />
        <Route path="earnings" element={<DeliveryDashboardPage />} />
      </Route>

    </Routes>
  );
}
