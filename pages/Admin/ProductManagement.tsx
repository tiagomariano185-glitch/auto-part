
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Check,
  Settings,
  Image as ImageIcon,
  Upload,
  AlertCircle
} from 'lucide-react';
import { mockDb } from '../../services/mockDb';
import { Product, Condition } from '../../types';
import { CATEGORIES, BRANDS } from '../../constants';
import { Logo } from '../../components/Logo';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await mockDb.getAuth();
      if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
        navigate('/login');
        return;
      }
      loadProducts();
    };
    checkAuth();
  }, [navigate]);

  const loadProducts = async () => {
    const data = await mockDb.getProducts();
    setProducts(data);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await mockDb.deleteProduct(id);
      loadProducts();
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct({ ...product });
    } else {
      setEditingProduct({
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limite simples de segurança (Ex: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem é muito grande! Tente uma foto com menos de 5MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setEditingProduct(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          images: [...(prev.images || []), base64String]
        };
      });
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      alert("Erro ao ler o arquivo. Tente novamente.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setIsSaving(true);
    try {
      const slug = (editingProduct.title?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'produto') + '-' + (editingProduct.sku?.toLowerCase() || Math.random().toString(36).substr(2, 5));
      const finalProduct = { ...editingProduct, slug } as Product;
      
      await mockDb.saveProduct(finalProduct);
      
      setIsModalOpen(false);
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar no banco de dados. Verifique sua conexão ou o tamanho das imagens.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />

      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo className="h-14" lightText={false} />
            <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Gestão de Estoque</h1>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>{products.length} itens</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <Link to="/admin/configuracoes" className="text-orange-600 hover:underline flex items-center gap-1">
                  <Settings size={12} /> Configurações
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Filtrar estoque..."
                className="pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 w-full md:w-64 font-bold text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg active:scale-95 uppercase text-xs tracking-widest"
            >
              <Plus size={20} /> Novo Cadastro
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Veículo / Peça</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">SKU</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Marca</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{p.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.category} • {p.yearFrom}/{p.yearTo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{p.sku}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-900">{p.brand}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => handleOpenModal(p)}
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-slate-400 font-bold italic uppercase tracking-widest text-xs">
                    Nenhum produto em estoque
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  {editingProduct.title ? 'Editar Sucata' : 'Novo Cadastro'}
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Dados técnicos do estoque</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                disabled={isSaving}
                className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 disabled:opacity-30"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Título do Anúncio</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Motor Parcial Toyota Corolla 2.0 2015"
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                      value={editingProduct.title || ''}
                      onChange={e => setEditingProduct({...editingProduct, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Código SKU</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                        value={editingProduct.sku || ''}
                        onChange={e => setEditingProduct({...editingProduct, sku: e.target.value.toUpperCase()})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Preço Exibido</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                        value={editingProduct.priceLabel || 'Sob consulta'}
                        onChange={e => setEditingProduct({...editingProduct, priceLabel: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
                      <select 
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold appearance-none"
                        value={editingProduct.category}
                        onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Condição</label>
                      <select 
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold appearance-none"
                        value={editingProduct.condition}
                        onChange={e => setEditingProduct({...editingProduct, condition: e.target.value as Condition})}
                      >
                        <option value="Usado">Usado (Sucata)</option>
                        <option value="Novo">Novo</option>
                        <option value="Recondicionado">Recondicionado</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Montadora</label>
                      <select 
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold appearance-none"
                        value={editingProduct.brand}
                        onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})}
                      >
                        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Modelo Veículo</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                        value={editingProduct.model || ''}
                        onChange={e => setEditingProduct({...editingProduct, model: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ano Inicial</label>
                      <input 
                        type="number" 
                        required
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                        value={editingProduct.yearFrom || ''}
                        onChange={e => setEditingProduct({...editingProduct, yearFrom: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ano Final</label>
                      <input 
                        type="number" 
                        required
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                        value={editingProduct.yearTo || ''}
                        onChange={e => setEditingProduct({...editingProduct, yearTo: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descrição da Peça</label>
                    <textarea 
                      rows={3}
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold transition-all resize-none"
                      value={editingProduct.description || ''}
                      onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Galeria de Imagens</label>
                  <button 
                    type="button"
                    onClick={() => {
                      const url = window.prompt('Insira a URL da imagem:');
                      if (url) {
                        setEditingProduct(prev => prev ? {...prev, images: [...(prev.images || []), url]} : prev);
                      }
                    }}
                    className="text-orange-600 font-bold text-xs uppercase tracking-widest hover:underline"
                  >
                    + Adicionar via URL
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {editingProduct.images?.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingProduct(prev => {
                            if (!prev) return prev;
                            const newImgs = [...(prev.images || [])];
                            newImgs.splice(idx, 1);
                            return { ...prev, images: newImgs };
                          });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    disabled={isUploading || isSaving}
                    onClick={() => fileInputRef.current?.click()}
                    className={`aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all bg-slate-50 ${isUploading ? 'animate-pulse' : ''} disabled:opacity-50`}
                  >
                    {isUploading ? <Upload size={24} className="animate-bounce" /> : <Plus size={24} />}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center px-2">
                      {isUploading ? 'Importando...' : 'Nova Foto'}
                    </span>
                  </button>
                </div>
              </div>
            </form>

            <div className="px-10 py-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="px-8 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-all uppercase text-xs tracking-widest disabled:opacity-30"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving || isUploading}
                className="bg-slate-900 text-white px-12 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-xl uppercase text-xs tracking-widest disabled:bg-slate-400"
              >
                {isSaving ? (
                  <>
                    <Upload size={18} className="animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Check size={18} /> Salvar Cadastro
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
