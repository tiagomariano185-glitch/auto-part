
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabase';
import { Logo } from '../components/Logo';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Credenciais inválidas ou erro de conexão. Verifique se o usuário foi criado no painel Supabase.");
      setLoading(false);
      return;
    }

    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        <div className="md:w-5/12 p-12 text-white flex flex-col justify-center bg-slate-900">
          <div className="mb-8 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-10">
              <Logo className="h-24" showText={false} />
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight">
              Acesso Restrito
            </h2>
            <p className="font-medium text-slate-400 text-sm">
              Sistema de gestão de estoque e leads via WhatsApp.
            </p>
          </div>
          <div className="mt-auto pt-8 border-t border-white/10 text-xs opacity-60 font-bold uppercase tracking-widest">
            Painel Administrativo v2.0
          </div>
        </div>

        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
          <h3 className="text-2xl font-black text-slate-900 mb-2">Entrar no Sistema</h3>
          <p className="text-slate-500 text-sm mb-10 font-medium">Faça login com sua conta Supabase para gerenciar a plataforma.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 border border-red-100 animate-in fade-in">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-xs font-bold leading-relaxed">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">E-mail Administrativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all disabled:opacity-50"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all disabled:opacity-50"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500"
            >
              {loading ? 'Verificando...' : 'Acessar Painel'} <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
