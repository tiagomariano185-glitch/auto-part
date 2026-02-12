
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Plus, 
  TrendingUp, 
  Settings,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Check,
  X
} from 'lucide-react';
import { mockDb } from '../../services/mockDb';
import { Product, Reservation } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const loadData = () => {
    setProducts(mockDb.getProducts());
    setReservations(mockDb.getReservations().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  useEffect(() => {
    const auth = mockDb.getAuth();
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const handleUpdateStatus = (id: string, status: Reservation['status']) => {
    mockDb.updateReservationStatus(id, status);
    loadData();
  };

  const stats = [
    { label: 'Total Produtos', value: products.length, icon: Package, color: 'bg-blue-100 text-blue-600', trend: 'Em estoque' },
    { label: 'Pendentes', value: reservations.filter(r => r.status === 'new').length, icon: AlertCircle, color: 'bg-orange-100 text-orange-600', trend: 'Aguardando' },
    { label: 'Vendas Fechadas', value: reservations.filter(r => r.status === 'completed').length, icon: CheckCircle2, color: 'bg-green-100 text-green-600', trend: 'Total histórico' },
    { label: 'Canceladas', value: reservations.filter(r => r.status === 'cancelled').length, icon: X, color: 'bg-red-100 text-red-600', trend: 'Recusadas' },
  ];

  const getStatusLabel = (status: Reservation['status']) => {
    switch(status) {
      case 'new': return 'Pendente';
      case 'completed': return 'Finalizada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar Admin */}
      <aside className="w-72 bg-slate-900 text-white min-h-screen p-8 hidden lg:block border-r border-slate-800">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
            <LayoutGrid className="text-white" size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          <Link to="/admin" className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold ${location.pathname === '/admin' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <BarChart3 size={20} /> Visão Geral
          </Link>
          <Link to="/admin/produtos" className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold ${location.pathname === '/admin/produtos' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Package size={20} /> Produtos (CRUD)
          </Link>
          <Link to="/admin/configuracoes" className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold ${location.pathname === '/admin/configuracoes' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Settings size={20} /> Configurações Site
          </Link>
          <div className="pt-8 border-t border-slate-800 mt-8">
            <Link to="/" className="flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-400 font-bold hover:bg-slate-800 hover:text-white transition-all">
              <ArrowUpRight size={20} /> Ver Site Público
            </Link>
          </div>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-grow p-4 md:p-12 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Painel de Pedidos</h1>
            <p className="text-slate-500 font-medium">Gerencie as solicitações dos clientes.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => navigate('/admin/produtos')} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg">
              <Plus size={20} /> Novo Produto
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center`}>
                  <s.icon size={28} />
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</span>
                <span className="text-3xl font-black text-slate-900">{s.value}</span>
                <p className="text-xs font-medium text-slate-500 mt-2 italic">{s.trend}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Latest Reservations */}
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <AlertCircle className="text-orange-500" size={20} /> Todas as Reservas
              </h3>
            </div>
            <div className="p-4">
              {reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map(res => (
                    <div key={res.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-orange-200 transition-all">
                      <div className="flex items-center gap-6 mb-4 md:mb-0">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                          <ShoppingCart size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-2">{res.productTitle}</p>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                            {res.userName} • {new Date(res.createdAt).toLocaleDateString('pt-BR')} às {new Date(res.createdAt).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
                          </p>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${
                            res.status === 'new' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                            res.status === 'completed' ? 'bg-green-50 text-green-600 border-green-200' : 
                            'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            {getStatusLabel(res.status)}
                          </span>
                        </div>
                      </div>
                      
                      {res.status === 'new' && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUpdateStatus(res.id, 'completed')}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                            title="Finalizar Pedido"
                          >
                            <Check size={16} /> Finalizar
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                            className="bg-white hover:bg-red-50 text-red-500 border border-red-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                            title="Cancelar Pedido"
                          >
                            <X size={16} /> Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400">
                  <Package size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">Nenhum pedido realizado ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
