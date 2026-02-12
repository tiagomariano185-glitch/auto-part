
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { About } from './pages/About';
import { ProductDetail } from './pages/ProductDetail';
import { MyReservations } from './pages/MyReservations';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { ProductManagement } from './pages/Admin/ProductManagement';
import { SiteSettings } from './pages/Admin/SiteSettings';
import { Login } from './pages/Login';
import { Cart } from './pages/Cart';
import { mockDb } from './services/mockDb';

const App: React.FC = () => {
  useEffect(() => {
    mockDb.init();
  }, []);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Catalog />} />
          <Route path="/quem-somos" element={<About />} />
          <Route path="/produto/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/minhas-reservas" element={<MyReservations />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/produtos" element={<ProductManagement />} />
          <Route path="/admin/configuracoes" element={<SiteSettings />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
