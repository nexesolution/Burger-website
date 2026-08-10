import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Global Toast & Preloader
import { ToastNotification } from './components/ui/ToastNotification';
import { WebsitePreloader } from './components/ui/WebsitePreloader';
import { initBackendSync } from './services/backendSync';
import { initSupabaseSync } from './services/supabaseSync';

// Customer layout & pages
import { Navbar } from './customer/components/Navbar';
import { Footer } from './customer/components/Footer';
import { HomePage } from './customer/pages/HomePage';
import { MenuPage } from './customer/pages/MenuPage';
import { DealsPage } from './customer/pages/DealsPage';
import { LoyaltyPage } from './customer/pages/LoyaltyPage';
import { AboutPage } from './customer/pages/AboutPage';
import { ContactPage } from './customer/pages/ContactPage';
import { FAQPage } from './customer/pages/FAQPage';
import { CartPage } from './customer/pages/CartPage';
import { CheckoutPage } from './customer/pages/CheckoutPage';
import { OrderTrackingPage } from './customer/pages/OrderTrackingPage';

// Admin layout & pages
import { AdminLayout } from './admin/layouts/AdminLayout';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { DashboardHome } from './admin/pages/DashboardHome';
import { PosSystemPage } from './admin/pages/PosSystemPage';
import { KitchenDisplayPage } from './admin/pages/KitchenDisplayPage';
import { CategoriesPage } from './admin/pages/CategoriesPage';
import { ProductsPage } from './admin/pages/ProductsPage';
import { InventoryPage } from './admin/pages/InventoryPage';
import { ExpensesPage } from './admin/pages/ExpensesPage';
import { DealsAdminPage } from './admin/pages/DealsAdminPage';
import { DiscountedItemsPage } from './admin/pages/DiscountedItemsPage';
import { OrdersAdminPage } from './admin/pages/OrdersAdminPage';
import { RidersPage } from './admin/pages/RidersPage';
import { WaitersPage } from './admin/pages/WaitersPage';
import { SalesReportsPage } from './admin/pages/SalesReportsPage';
import { LoyaltyAdminPage } from './admin/pages/LoyaltyAdminPage';
import { CouponsAdminPage } from './admin/pages/CouponsAdminPage';
import { StaffPage } from './admin/pages/StaffPage';
import { CustomersAdminPage } from './admin/pages/CustomersAdminPage';
import { SettingsAdminPage } from './admin/pages/SettingsAdminPage';
import { PrinterSettingsPage } from './admin/pages/PrinterSettingsPage';
import { FbrIntegrationPage } from './admin/pages/FbrIntegrationPage';
import { PayfastPage } from './admin/pages/PayfastPage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Customer Layout Container
const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-buzz-black text-white selection:bg-buzz-yellow selection:text-buzz-black">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="deals" element={<DealsPage />} />
          <Route path="loyalty" element={<LoyaltyPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="tracking" element={<OrderTrackingPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export function App() {
  useEffect(() => {
    initBackendSync();
    initSupabaseSync();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <WebsitePreloader />
      <ToastNotification />

      <Routes>
        {/* Customer Website Routes */}
        <Route path="/*" element={<CustomerLayout />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin POS System Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="pos" element={<PosSystemPage />} />
          <Route path="kds" element={<KitchenDisplayPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="deals" element={<DealsAdminPage />} />
          <Route path="discounts" element={<DiscountedItemsPage />} />
          <Route path="orders" element={<OrdersAdminPage />} />
          <Route path="riders" element={<RidersPage />} />
          <Route path="waiters" element={<WaitersPage />} />
          <Route path="reports" element={<SalesReportsPage />} />
          <Route path="loyalty" element={<LoyaltyAdminPage />} />
          <Route path="coupons" element={<CouponsAdminPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="customers" element={<CustomersAdminPage />} />
          <Route path="settings" element={<SettingsAdminPage />} />
          <Route path="printer" element={<PrinterSettingsPage />} />
          <Route path="fbr" element={<FbrIntegrationPage />} />
          <Route path="payfast" element={<PayfastPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
