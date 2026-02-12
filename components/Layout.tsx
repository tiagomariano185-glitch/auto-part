
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, User, LogOut, Package, ShoppingCart, MapPin } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { User as UserType, SiteSettings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [settings, setSettings] = useState<SiteSettings>(mockDb.getSettings());
  const navigate = useNavigate();
  const location = useLocation();

  const updateCartCount = () => {
    const cart = mockDb.getCart();
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const loadSettings = () => {
    setSettings(mockDb.getSettings());
  };

  useEffect(() => {
    const auth = mockDb.getAuth();
    setCurrentUser(auth.user);
    updateCartCount();
    loadSettings();

    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('settingsUpdated', loadSettings);
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('settingsUpdated', loadSettings);
    };
  }, [location]);

  const handleLogout = () => {
    mockDb.logout();
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 shadow-lg">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <Package className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tighter uppercase leading-none">{settings.name}</span>
              <span className="text-xs font-medium text-orange-500 tracking-widest uppercase">{settings.subtext}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <Link to="/produtos" className="hover:text-orange-500 transition-colors">Catálogo</Link>
            <Link to="/quem-somos" className="hover:text-orange-500 transition-colors">Quem Somos</Link>
            
            <Link to="/carrinho" className="relative p-2 hover:text-orange-500 transition-colors group">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full hover:bg-slate-700 transition-colors">
                  <User size={18} />
                  <span>Olá, {currentUser.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
                  <div className="bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-100 py-2 w-48 overflow-hidden">
                    <Link to="/minhas-reservas" className="block px-4 py-2 hover:bg-slate-50">Minhas Reservas</Link>
                    {currentUser.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 hover:bg-slate-50 font-semibold text-orange-600">Painel Admin</Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2">
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md active:scale-95">
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/carrinho" className="relative p-2 text-white">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 py-6 px-4 space-y-4 animate-in slide-in-from-top duration-300">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Home</Link>
            <Link to="/produtos" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Catálogo</Link>
            <Link to="/quem-somos" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Quem Somos</Link>
            <Link to="/carrinho" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Carrinho</Link>
            {currentUser ? (
              <>
                <Link to="/minhas-reservas" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Minhas Reservas</Link>
                {currentUser.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-orange-500">Painel Admin</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left text-lg font-medium text-red-400">Sair</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-center bg-orange-600 text-white py-3 rounded-xl font-bold">Login / Cadastro</Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="text-orange-500" size={24} />
                <span className="text-xl font-extrabold text-white tracking-tighter uppercase">{settings.name}</span>
              </div>
              <p className="text-sm leading-relaxed">
                Referência em peças automotivas com procedência garantida. O desmanche mais confiável da região.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Navegação</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-orange-500 transition-colors">Início</Link></li>
                <li><Link to="/produtos" className="hover:text-orange-500 transition-colors">Catálogo Completo</Link></li>
                <li><Link to="/quem-somos" className="hover:text-orange-500 transition-colors">Quem Somos</Link></li>
                <li><Link to="/carrinho" className="hover:text-orange-500 transition-colors">Meu Carrinho</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Atendimento</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-orange-500" />
                  <span>{settings.whatsapp}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Horário</h4>
              <ul className="space-y-3 text-sm">
                <li>Seg - Sex: {settings.workingHours.weekdays}</li>
                <li>Sábados: {settings.workingHours.saturday}</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {settings.name}. CNPJ: {settings.cnpj}
          </div>
        </div>
      </footer>

      {/* Fixed WhatsApp FAB */}
      <a 
        href={`https://wa.me/${settings.whatsapp}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transform hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
      >
        <Phone size={32} />
      </a>
    </div>
  );
};