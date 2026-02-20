
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, User, LogOut, Settings } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { User as UserType, SiteSettings } from '../types';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadData = async () => {
    const [s, auth] = await Promise.all([
      mockDb.getSettings(),
      mockDb.getAuth()
    ]);
    setSettings(s);
    setCurrentUser(auth.user);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('settingsUpdated', loadData);
    return () => {
      window.removeEventListener('settingsUpdated', loadData);
    };
  }, [location]);

  const handleLogout = async () => {
    await mockDb.logout();
    setCurrentUser(null);
    navigate('/');
  };

  const currentSettings = settings || { whatsapp: '5500000000000', workingHours: { weekdays: '...', saturday: '...' } } as SiteSettings;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 shadow-lg">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/">
            <Logo className="h-12" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <Link to="/produtos" className="hover:text-orange-500 transition-colors">Catálogo</Link>
            <Link to="/quem-somos" className="hover:text-orange-500 transition-colors">Quem Somos</Link>
            
            <div className="h-6 w-px bg-slate-800 mx-2"></div>

            {currentUser ? (
              <div className="relative group">
                <button className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border shadow-lg bg-orange-600 border-orange-500 hover:bg-orange-700`}>
                  <Settings size={18} />
                  <span className="font-bold">Painel Admin</span>
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-100 py-2 w-56 overflow-hidden">
                    <Link to="/admin" className="block px-4 py-2 hover:bg-slate-50 font-semibold">Dashboard</Link>
                    <Link to="/admin/produtos" className="block px-4 py-2 hover:bg-slate-50">Gerenciar Produtos</Link>
                    <Link to="/admin/configuracoes" className="block px-4 py-2 hover:bg-slate-50">Configurações</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-slate-100 mt-2">
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
               <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                  <User size={18} /> Acesso ADM
               </Link>
            )}
          </nav>

          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 py-6 px-4 space-y-4 shadow-2xl">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Home</Link>
            <Link to="/produtos" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Catálogo</Link>
            <Link to="/quem-somos" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Quem Somos</Link>
            <div className="pt-4 border-t border-slate-800">
               {currentUser ? (
                 <>
                   <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-orange-500">Dashboard</Link>
                   <button onClick={handleLogout} className="block w-full text-left text-lg font-medium text-red-400 mt-2">Sair</button>
                 </>
               ) : (
                 <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-sm font-bold text-slate-500 uppercase tracking-widest">Login Administrativo</Link>
               )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-center md:text-left">
            <div className="space-y-4 flex flex-col items-center md:items-start">
              <Logo className="h-10" />
              <p className="text-sm leading-relaxed max-w-xs mt-4">
                Referência nacional em peças automotivas com procedência garantida. A rede mais confiável do Brasil.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Navegação</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-orange-500 transition-colors">Início</Link></li>
                <li><Link to="/produtos" className="hover:text-orange-500 transition-colors">Catálogo Completo</Link></li>
                <li><Link to="/quem-somos" className="hover:text-orange-500 transition-colors">Quem Somos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Atendimento</h4>
              <ul className="space-y-3 text-sm flex flex-col items-center md:items-start">
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-orange-500" />
                  <span>{currentSettings.whatsapp}</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Horário</h4>
              <ul className="space-y-3 text-sm">
                <li>Seg - Sex: {currentSettings.workingHours?.weekdays}</li>
                <li>Sábados: {currentSettings.workingHours?.saturday}</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-end gap-4">
            <Link to="/login" className="text-slate-700 hover:text-slate-500 text-[10px] font-black uppercase tracking-widest transition-colors">
              Painel Administrativo
            </Link>
          </div>
        </div>
      </footer>

      <a 
        href={`https://wa.me/${currentSettings.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de fazer uma consulta sobre peças e sucatas.")}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-4 border-white"
      >
        <Phone size={32} />
      </a>
    </div>
  );
};
