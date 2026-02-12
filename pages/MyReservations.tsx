
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Calendar, Clock, ArrowRight, Search, LayoutGrid } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { Reservation } from '../types';

export const MyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = mockDb.getAuth();
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }
    setReservations(mockDb.getUserReservations(auth.user!.id));
  }, [navigate]);

  const getStatusColor = (status: Reservation['status']) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: Reservation['status']) => {
    switch(status) {
      case 'new': return 'Aguardando Contato';
      case 'contacted': return 'Em Negociação';
      case 'completed': return 'Venda Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Minhas Reservas</h1>
            <p className="text-slate-500 font-medium">Acompanhe o status das suas solicitações recentes.</p>
          </div>
          <Link to="/produtos" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all">
            <Search size={20} /> Ver Catálogo
          </Link>
        </div>

        {reservations.length > 0 ? (
          <div className="space-y-6">
            {reservations.map(res => (
              <div key={res.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <Package size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: #{res.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest ${getStatusColor(res.status)}`}>
                          {getStatusLabel(res.status)}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight">
                        {res.productTitle}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(res.createdAt).toLocaleDateString('pt-BR')}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(res.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                        <span className="font-bold text-slate-400 uppercase tracking-widest">SKU: {res.productSku}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <a 
                      href={`https://wa.me/5511999999999?text=Olá, sobre minha reserva ${res.id} do produto ${res.productTitle}`}
                      className="flex-grow md:flex-grow-0 px-6 py-3 bg-green-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-600 shadow-lg"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-300">
            <LayoutGrid size={64} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Nenhuma reserva encontrada</h3>
            <p className="text-slate-500 mb-10 max-w-xs mx-auto">Você ainda não solicitou a reserva de nenhuma peça. Explore nosso catálogo agora mesmo!</p>
            <Link to="/produtos" className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-2 hover:bg-orange-700 transition-all shadow-xl">
              Explorar Peças <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
