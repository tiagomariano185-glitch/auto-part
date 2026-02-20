
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Truck, Star, ChevronRight, Phone, ArrowRight } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { Product, SiteSettings } from '../types';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [products, siteSettings] = await Promise.all([
        mockDb.getProducts(),
        mockDb.getSettings()
      ]);
      // Pegamos 10 produtos para preencher perfeitamente 2 linhas de 5 no desktop
      setFeaturedProducts(products.slice(0, 10));
      setSettings(siteSettings);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('productsUpdated', loadData);
    window.addEventListener('settingsUpdated', loadData);
    return () => {
      window.removeEventListener('productsUpdated', loadData);
      window.removeEventListener('settingsUpdated', loadData);
    };
  }, []);

  if (!settings && loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold uppercase tracking-widest animate-pulse">Carregando...</div>;
  
  const currentSettings = settings || { whatsapp: '5500000000000' } as SiteSettings;

  const getWhatsAppCTA = () => {
    const message = `Olá! Gostaria de fazer uma consulta sobre peças e sucatas em estoque.`;
    return `https://wa.me/${currentSettings.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1920" 
            alt="Desmanche Gigante de Carros e Caminhões" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/70 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block bg-orange-600/20 text-orange-500 border border-orange-600/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
              Desmanche Especializado em Veículos e Caminhões
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tighter">
              Rede Nacional de <br/>
              <span className="text-orange-600">Sucatas e Peças Automotivas.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
              Especialistas em desmonte de veículos leves e pesados. Milhares de peças originais com procedência garantida e nota fiscal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/produtos" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-xl">
                <Search size={20} /> Ver Catálogo de Sucatas
              </Link>
              <a href={getWhatsAppCTA()} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1">
                <Phone size={20} /> Falar com Vendedor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Product Showcase (Grid de 2 Linhas) */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Sucatas em Destaque</h2>
            </div>
            <Link to="/produtos" className="text-orange-600 font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm uppercase tracking-wider">
              Ver Catálogo Completo <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {featuredProducts.length > 0 ? featuredProducts.map((p) => (
              <Link 
                key={p.id} 
                to={`/produto/${p.slug}`} 
                className="group bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={p.images[0]} 
                    alt={p.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                      {p.brand}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest block mb-1">{p.category}</span>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-2 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-4 font-medium uppercase tracking-tight">{p.model} • {p.yearFrom}/{p.yearTo}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 mt-auto">
                    <span className="text-base font-black text-slate-900">{p.priceLabel}</span>
                    <div className="bg-white p-2 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors shadow-sm">
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            )) : loading ? (
              Array.from({length: 10}).map((_, i) => (
                <div key={i} className="w-full h-[320px] bg-slate-100 rounded-3xl animate-pulse"></div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold">Nenhum item em destaque no momento.</div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Compromisso com a Procedência</h2>
            <p className="text-slate-600 font-medium">Somos credenciados pelos órgãos competentes, garantindo que cada peça tenha origem legal e rastreável.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Peças Originais</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Trabalhamos apenas com peças genuínas retiradas de veículos de seguradoras e leilões.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Garantia Total</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Todas as nossas peças são testadas e revisadas, oferecendo 90 dias de garantia real para sua tranquilidade.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Logística Especializada</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Enviamos peças de pequeno e grande porte para todo o Brasil com segurança e agilidade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1594491768686-34727d979685?auto=format&fit=crop&q=80&w=1200" 
              className="absolute inset-0 w-full h-full object-cover opacity-20"
              alt="Estoque Carros e Caminhões"
            />
            <div className="relative z-10 px-8 py-20 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Estoque Gigante de Carros e Caminhões</h2>
              <p className="text-slate-300 text-lg mb-10 leading-relaxed font-medium">
                Precisa de peças para seu carro ou caminhão? Temos um pátio completo com veículos leves e pesados e disponibilidade imediata para milhares de itens.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a href={getWhatsAppCTA()} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all shadow-2xl hover:scale-105 active:scale-95">
                  <Phone size={24} /> Consultar Peças e Sucatas
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
