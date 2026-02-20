
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Plus, 
  Settings,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Check,
  X,
  Download
} from 'lucide-react';
import { mockDb } from '../../services/mockDb';
import { Product, Reservation } from '../../types';
import { INITIAL_PRODUCTS } from '../../constants';

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loadData = async () => {
    const auth = await mockDb.getAuth();
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }

    const [pData, rData] = await Promise.all([
      mockDb.getProducts(),
      mockDb.getReservations()
    ]);
    setProducts(pData);
    setReservations(rData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [navigate]);

  const handleUpdateStatus = async (id: string, status: Reservation['status']) => {
    await mockDb.updateReservationStatus(id, status);
    loadData();
  };

  const handleImportDefaults = async () => {
    if (!window.confirm('Deseja importar os 10 produtos iniciais para o seu banco de dados agora?')) return;
    
    setIsImporting(true);
    try {
      for (const product of INITIAL_PRODUCTS) {
        await mockDb.saveProduct(product);
      }
      alert('Importação concluída com sucesso!');
      await loadData();
    } catch (err) {
      alert('Erro ao importar. Verifique sua conexão.');
    } finally {
      setIsImporting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-black uppercase tracking-widest">
      Carregando...
    </div>
  );

  const stats = [
    { label: 'Total Produtos', value: products.length, icon: Package, color: 'bg-blue-100 text-blue-600', trend: 'Itens em catálogo' },
    { label: 'Leads Pendentes', value: reservations.filter(r => r.status === 'new').length, icon: AlertCircle, color: 'bg-orange-100 text-orange-600', trend: 'Aguardando Contato' },
    { label: 'Leads Atendidos', value: reservations.filter(r => r.status === 'completed').length, icon: CheckCircle2, color: 'bg-green-100 text-green-600', trend: 'Conversão realizada' },
    { label: 'Total Histórico', value: reservations.length, icon: ShoppingCart, color: 'bg-slate-100 text-slate-600', trend: 'Consultas WhatsApp' },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <aside className="w-72 bg-slate-900 text-white min-h-screen p-8 hidden lg:block border-r border-slate-800">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
            <LayoutGrid className="text-white" size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">Admin Panel</span>
        </div>
        <nav className="space-y-2">
          <Link to="/admin" className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold ${location.pathname === '/admin' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <BarChart3 size={20} /> Leads e Visão Geral
          </Link>
          <Link to="/admin/produtos" className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold ${location.pathname === '/admin/produtos' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Package size={20} /> Gerenciar Estoque
          </Link>
          <Link to="/admin/configuracoes" className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold ${location.pathname === '/admin/configuracoes' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Settings size={20} /> Configurações
          </Link>
          <div className="pt-8 border-t border-slate-800 mt-8">
            <Link to="/" className="flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-400 font-bold hover:bg-slate-800 hover:text-white transition-all">
              <ArrowUpRight size={20} /> Ver Site Público
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-grow p-4 md:p-12 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Leads e Consultas</h1>
            <p className="text-slate-500 font-medium">Controle de interessados que clicaram no WhatsApp.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={handleImportDefaults}
              disabled={isImporting}
              className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
            >
              <Download size={20} className={isImporting ? "animate-bounce" : ""} /> {isImporting ? 'Importando...' : 'Importar Catálogo'}
            </button>
            <button onClick={() => navigate('/admin/produtos')} className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg">
              <Plus size={20} /> Novo Produto
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all">
              <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mb-6`}>
                <s.icon size={28} />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</span>
                <span className="text-3xl font-black text-slate-900">{s.value}</span>
                <p className="text-xs font-medium text-slate-500 mt-2 italic">{s.trend}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tighter">
              <AlertCircle className="text-orange-500" size={20} /> Histórico de Consultas
            </h3>
          </div>
          <div className="p-4">
            {reservations.length > 0 ? (
              <div className="space-y-4">
                {reservations.map(res => (
                  <div key={res.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-orange-200 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                        <ShoppingCart size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 mb-1 leading-none">{res.productTitle}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                          {new Date(res.createdAt).toLocaleDateString('pt-BR')} às {new Date(res.createdAt).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})} • SKU: {res.productSku}
                        </p>
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${
                          res.status === 'new' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                          res.status === 'completed' ? 'bg-green-50 text-green-600 border-green-200' : 
                          'bg-red-50 text-red-600 border-red-200'
                        }`}>
                          {res.status === 'new' ? 'Pendente' : res.status === 'completed' ? 'Atendido' : 'Cancelado'}
                        </span>
                      </div>
                    </div>
                    
                    {res.status === 'new' && (
                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <button 
                          onClick={() => handleUpdateStatus(res.id, 'completed')}
                          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                        >
                          <Check size={14} /> Marcar Atendido
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                          className="bg-white hover:bg-red-50 text-red-500 border border-red-100 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <X size={14} /> Arquivar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-300">
                <Package size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold uppercase text-xs tracking-widest">Nenhuma consulta registrada.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
