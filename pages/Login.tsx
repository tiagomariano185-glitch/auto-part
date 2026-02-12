
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Package, ShieldCheck, Users } from 'lucide-react';
import { mockDb } from '../services/mockDb';

type LoginType = 'client' | 'admin';

export const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<LoginType>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const role = loginType === 'admin' ? 'admin' : 'user';
    
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      name: loginType === 'admin' ? 'Administrador' : (name || 'Cliente'),
      role: role
    };

    mockDb.setAuth(mockUser as any);
    
    // Redirect based on role
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Dynamic Branding/Context */}
        <div className={`md:w-5/12 p-12 text-white flex flex-col justify-center transition-all duration-500 ${loginType === 'admin' ? 'bg-slate-900' : 'bg-orange-600'}`}>
          <div className="mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform -rotate-12 bg-white ${loginType === 'admin' ? 'text-slate-900' : 'text-orange-600'}`}>
              {loginType === 'admin' ? <ShieldCheck size={32} /> : <Users size={32} />}
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight">
              {loginType === 'admin' ? 'Portal do Administrador' : 'Área do Cliente'}
            </h2>
            <p className={`font-medium ${loginType === 'admin' ? 'text-slate-400' : 'text-orange-100'}`}>
              {loginType === 'admin' 
                ? 'Gerencie estoque, pedidos e usuários em um só lugar.' 
                : 'Acompanhe suas reservas e encontre peças originais.'}
            </p>
          </div>
          
          <div className="mt-auto pt-8 border-t border-white/10">
            <p className="text-xs opacity-60 font-bold uppercase tracking-widest">AutoPart © {new Date().getFullYear()}</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col">
          {/* Persona Switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10">
            <button 
              onClick={() => { setLoginType('client'); setIsRegister(false); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginType === 'client' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sou Cliente
            </button>
            <button 
              onClick={() => { setLoginType('admin'); setIsRegister(false); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginType === 'admin' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sou Admin
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-8">
            {isRegister ? 'Criar Conta' : 'Acesse sua conta'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && loginType === 'client' && (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                    placeholder="Seu nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                  placeholder={loginType === 'admin' ? 'admin@autopart.com' : 'seu@email.com'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-white ${loginType === 'admin' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-orange-600 hover:bg-orange-700'}`}>
              {isRegister ? 'Finalizar Cadastro' : 'Entrar no Sistema'} <ArrowRight size={20} />
            </button>

            {loginType === 'client' && (
              <div className="text-center pt-4">
                <button 
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors uppercase tracking-widest underline underline-offset-4"
                >
                  {isRegister ? 'Já tenho uma conta' : 'Não tem conta? Cadastre-se'}
                </button>
              </div>
            )}
            
            {loginType === 'admin' && (
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mt-4">
                <p className="text-[10px] text-blue-600 font-bold text-center uppercase tracking-widest leading-normal">
                  Acesso restrito a colaboradores autorizados. <br/>Use credenciais administrativas.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};