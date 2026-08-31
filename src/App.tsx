import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { ProductFormPage } from "@/pages/ProductFormPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { OrderBoardPage } from "@/pages/OrderBoardPage";
import { OrderDetailPage } from "@/pages/OrderDetailPage";
import { CustomersPage } from "@/pages/CustomersPage";
import { CustomerDetailPage } from "@/pages/CustomerDetailPage";
import { ShippingPage } from "@/pages/ShippingPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { MessagesPage } from "@/pages/MessagesPage";
import { ContentPage } from "@/pages/ContentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/new" element={<ProductFormPage />} />
            <Route path="/products/:id" element={<ProductFormPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/board" element={<OrderBoardPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
