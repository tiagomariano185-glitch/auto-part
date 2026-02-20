
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { About } from './pages/About';
import { ProductDetail } from './pages/ProductDetail';
import { ProductManagement } from './pages/Admin/ProductManagement';
import { SiteSettings } from './pages/Admin/SiteSettings';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/Admin/Dashboard';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Catalog />} />
          <Route path="/quem-somos" element={<About />} />
          <Route path="/produto/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/produtos" element={<ProductManagement />} />
          <Route path="/admin/configuracoes" element={<SiteSettings />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
