import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProductForm from './pages/ProductForm';
import Store from './pages/Store';
import MyOrders from './pages/MyOrders';
import CategoryList from './pages/CategoryList';
import CategoryForm from './pages/CategoryForm';
import Promotions from './pages/Promotions';
import PromotionList from './pages/PromotionList';
import PromotionForm from './pages/PromotionForm';
import OrderManagement from './pages/OrderManagement';
import Points from './pages/Points';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryZonesAdmin from './pages/DeliveryZonesAdmin';
import RewardsAdmin from './pages/RewardsAdmin';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-gold-500"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-gold-500"></div>
      </div>
    );
  }
  if (!isAuthenticated || !isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Store />} />
    <Route path="/producto/:id" element={<ProductDetail />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/dashboard" element={<AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>} />
    <Route path="/products" element={<AdminRoute><Layout><Dashboard /></Layout></AdminRoute>} />
    <Route path="/products/new" element={<AdminRoute><Layout><ProductForm /></Layout></AdminRoute>} />
    <Route path="/products/edit/:id" element={<AdminRoute><Layout><ProductForm /></Layout></AdminRoute>} />
    <Route path="/categories" element={<AdminRoute><Layout><CategoryList /></Layout></AdminRoute>} />
    <Route path="/category/new" element={<AdminRoute><Layout><CategoryForm /></Layout></AdminRoute>} />
    <Route path="/category/edit/:id" element={<AdminRoute><Layout><CategoryForm /></Layout></AdminRoute>} />
    <Route path="/my-orders" element={<ProtectedRoute><Layout><MyOrders /></Layout></ProtectedRoute>} />
    <Route path="/points" element={<ProtectedRoute><Points /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
    <Route path="/orders" element={<AdminRoute><Layout><OrderManagement /></Layout></AdminRoute>} />
    <Route path="/admin/delivery-zones" element={<AdminRoute><Layout><DeliveryZonesAdmin /></Layout></AdminRoute>} />
    <Route path="/admin/rewards" element={<AdminRoute><Layout><RewardsAdmin /></Layout></AdminRoute>} />
    <Route path="/promociones" element={<Promotions />} />
    <Route path="/promotions" element={<AdminRoute><Layout><PromotionList /></Layout></AdminRoute>} />
    <Route path="/promotions/new" element={<AdminRoute><Layout><PromotionForm /></Layout></AdminRoute>} />
    <Route path="/promotions/edit/:id" element={<AdminRoute><Layout><PromotionForm /></Layout></AdminRoute>} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <a href="#main-content" className="skip-nav">Saltar al contenido</a>
          <Router>
            <AppRoutes />
          </Router>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
