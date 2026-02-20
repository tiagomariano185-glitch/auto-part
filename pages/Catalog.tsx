
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronDown, Package } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { Product, SiteSettings } from '../types';
import { CATEGORIES, BRANDS } from '../constants';

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Filters state
  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat') || 'Todos');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'Todas');

  // Fix: Handle asynchronous data loading in useEffect
  useEffect(() => {
    const loadData = async () => {
      const [prodData, settingsData] = await Promise.all([
        mockDb.getProducts(),
        mockDb.getSettings()
      ]);
      setProducts(prodData);
      setSettings(settingsData);
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCat === 'Todos' || p.category === selectedCat;
      const matchBrand = selectedBrand === 'Todas' || p.brand === selectedBrand;
      
      return matchSearch && matchCat && matchBrand;
    });
  }, [products, searchTerm, selectedCat, selectedBrand]);

  const RARE_PARTS_MESSAGE = encodeURIComponent(
    "Olá! Não encontrei a peça que procuro no catálogo. Vocês poderiam me ajudar a encontrar?"
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 py-8 shadow-sm sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Busque por peça, modelo, marca ou SKU..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold"
            >
              <Filter size={20} /> Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`lg:w-72 space-y-8 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal size={20} className="text-orange-600" />
                <h3 className="font-extrabold uppercase tracking-wider text-sm">Filtros Avançados</h3>
              </div>

              <div className="space-y-6">
                {/* Categorias */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Categoria</label>
                  <select 
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-orange-500"
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                  >
                    <option value="Todos">Todas as categorias</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Marcas */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Montadora</label>
                  <select 
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-orange-500"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="Todas">Todas as marcas</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <button 
                  onClick={() => {
                    setSelectedCat('Todos');
                    setSelectedBrand('Todas');
                    setSearchTerm('');
                  }}
                  className="w-full py-3 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors uppercase tracking-widest"
                >
                  Limpar todos os filtros
                </button>
              </div>
            </div>

            <div className="bg-orange-600 rounded-3xl p-6 text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h4 className="font-bold mb-2">Peças raras?</h4>
                <p className="text-sm text-orange-100 mb-4 leading-relaxed">Nós buscamos para você se não estiver no catálogo.</p>
                {/* Fix: Safely access settings property */}
                <a 
                  href={settings ? `https://wa.me/${settings.whatsapp}?text=${RARE_PARTS_MESSAGE}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-orange-600 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg transform group-hover:scale-105 transition-transform"
                >
                  Consultar Agora
                </a>
              </div>
              <Package className="absolute -bottom-6 -right-6 text-orange-500/30 opacity-50 rotate-12" size={120} />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {filteredProducts.length} <span className="text-slate-500 font-medium text-lg">Produtos encontrados</span>
              </h2>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <Link 
                    key={p.id} 
                    to={`/produto/${p.slug}`}
                    className="group bg-white rounded-[2rem] overflow-hidden border border-slate-200 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={p.images[0]} 
                        alt={p.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{p.category}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKU: {p.sku}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-1">{p.brand} {p.model} ({p.yearFrom}-{p.yearTo})</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-xl font-black text-slate-900">{p.priceLabel}</span>
                        <div className="w-10 h-10 bg-slate-100 group-hover:bg-orange-600 group-hover:text-white rounded-xl flex items-center justify-center transition-all">
                          <ChevronDown size={20} className="-rotate-90" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-300">
                <Package size={64} className="mx-auto text-slate-200 mb-6" />
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Nenhum resultado encontrado</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">Tente ajustar seus filtros ou mude o termo de pesquisa para encontrar o que precisa.</p>
                <button 
                  onClick={() => {
                    setSelectedCat('Todos');
                    setSelectedBrand('Todas');
                    setSearchTerm('');
                  }}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
