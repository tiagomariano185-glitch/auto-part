
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Image as ImageIcon,
  Check,
  AlertTriangle,
  ChevronLeft,
  LayoutGrid,
  Settings
} from 'lucide-react';
import { mockDb } from '../../services/mockDb';
import { Product, Condition } from '../../types';
import { CATEGORIES, BRANDS } from '../../constants';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = mockDb.getAuth();
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadProducts();
  }, [navigate]);

  const loadProducts = () => {
    setProducts(mockDb.getProducts());
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      mockDb.deleteProduct(id);
      loadProducts();
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct({ ...product });
    } else {
      setEditingProduct({
        id: Math.random().toString(36).substr(2, 9),
        title: '',
        sku: '',
        category: CATEGORIES[0],
        brand: BRANDS[0],
        model: '',
        yearFrom: new Date().getFullYear(),
        yearTo: new Date().getFullYear(),
        condition: 'Usado',
        description: '',
        compatibility: [],
        priceLabel: 'Sob consulta',
        images: [],
        status: 'available',
        createdAt: new Date().toISOString()
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Slug simple generation
      const slug = editingProduct.title?.toLowerCase().replace(/ /g, '-') + '-' + editingProduct.sku;
      const finalProduct = { ...editingProduct, slug } as Product;
      mockDb.saveProduct(finalProduct);
      setIsModalOpen(false);
      loadProducts();
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Estoque</h1>
              <p className="text-sm text-slate-500 font-medium">Cadastre e edite produtos em tempo real.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Filtrar por nome ou SKU..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 w-full md:w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg active:scale-95"
            >
              <Plus size={20} /> Novo Produto
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU / Marca</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={p.images[0]} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{p.title}</p>
                        <p className="text-xs text-slate-500">{p.model} ({p.yearFrom}-{p.yearTo})</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-900 block">{p.sku}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.brand}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-600">{p.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest ${p.status === 'available' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {p.status === 'available' ? 'Disponível' : 'Vendido'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(p)}
                        className="p-2 hover:bg-orange-50 text-slate-400 hover:text-orange-600 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-2xl font-black text-slate-900">{editingProduct.id ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Título do Anúncio</label>
                    <input 
                      type="text" 
                      required
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                      value={editingProduct.title || ''}
                      onChange={e => setEditingProduct({...editingProduct, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">SKU / Código</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                        value={editingProduct.sku || ''}
                        onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Preço Visível</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                        value={editingProduct.priceLabel || ''}
                        onChange={e => setEditingProduct({...editingProduct, priceLabel: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
                      <select 
                        className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                        value={editingProduct.category}
                        onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Condição</label>
                      <select 
                        className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                        value={editingProduct.condition}
                        onChange={e => setEditingProduct({...editingProduct, condition: e.target.value as Condition})}
                      >
                        <option value="Novo">Novo</option>
                        <option value="Usado">Usado</option>
                        <option value="Recondicionado">Recondicionado</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Compatibility and Specs */}
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Montadora</label>
                      <select 
                        className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                        value={editingProduct.brand}
                        onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})}
                      >
                        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Modelo</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                        value={editingProduct.model || ''}
                        onChange={e => setEditingProduct({...editingProduct, model: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ano De</label>
                      <input 
                        type="number" 
                        required
                        className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                        value={editingProduct.yearFrom || ''}
                        onChange={e => setEditingProduct({...editingProduct, yearFrom: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ano Até</label>
                      <input 
                        type="number" 
                        required
                        className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                        value={editingProduct.yearTo || ''}
                        onChange={e => setEditingProduct({...editingProduct, yearTo: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descrição Longa</label>
                    <textarea 
                      rows={3}
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                      value={editingProduct.description || ''}
                      onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Photos Management (Simulation) */}
              <div className="pt-8 border-t border-slate-100">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Gerenciar Fotos (URLs)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {editingProduct.images?.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => {
                          const newImgs = [...(editingProduct.images || [])];
                          newImgs.splice(idx, 1);
                          setEditingProduct({...editingProduct, images: newImgs});
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => {
                      const url = window.prompt('Insira a URL da imagem:');
                      if (url) {
                        setEditingProduct({...editingProduct, images: [...(editingProduct.images || []), url]});
                      }
                    }}
                    className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all"
                  >
                    <Plus size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Add Foto</span>
                  </button>
                </div>
              </div>
            </form>

            <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="bg-slate-900 text-white px-10 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg"
              >
                <Check size={20} /> Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
