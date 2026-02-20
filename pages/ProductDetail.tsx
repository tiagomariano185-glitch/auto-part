
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  Settings, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  ArrowLeft,
  Phone,
  PackageCheck,
} from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { Product, Reservation, SiteSettings } from '../types';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Fix: Use async/await to load product and settings
  useEffect(() => {
    const loadData = async () => {
      if (slug) {
        const [p, s] = await Promise.all([
          mockDb.getProductBySlug(slug),
          mockDb.getSettings()
        ]);
        if (p) {
          setProduct(p);
        } else {
          navigate('/produtos');
        }
        setSettings(s);
      }
    };
    loadData();
  }, [slug, navigate]);

  if (!product) return null;

  const handleWhatsAppInquiry = () => {
    // Registrar um lead/reserva mockada para o administrador ver no painel
    const lead: Reservation = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      productId: product.id,
      productTitle: product.title,
      productSku: product.sku,
      userId: 'visitante',
      userName: 'Interessado (WhatsApp)',
      userPhone: 'Pendente',
      status: 'new',
      createdAt: new Date().toISOString()
    };
    mockDb.addReservation(lead);

    const message = `Olá, quero saber mais sobre ${product.title} (SKU: ${product.sku})`;
    // Fix: Safely access whatsapp from settings
    const whatsapp = settings?.whatsapp || '5500000000000';
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <Link to="/produtos" className="inline-flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-orange-600 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar para o Catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl relative group bg-slate-100">
              <img 
                src={product.images[activeImageIndex]} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white transition-all active:scale-90"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white transition-all active:scale-90"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-orange-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                <ShieldCheck className="mx-auto text-orange-600 mb-2" size={24} />
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Garantia</span>
                <span className="text-sm font-bold">90 Dias</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                <Truck className="mx-auto text-blue-600 mb-2" size={24} />
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Envio</span>
                <span className="text-sm font-bold">Imediato</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                <PackageCheck className="mx-auto text-green-600 mb-2" size={24} />
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Qualidade</span>
                <span className="text-sm font-bold">Original</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200">
                {product.brand} • {product.category}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">SKU: {product.sku}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              {product.title}
            </h1>

            <div className="bg-orange-50 rounded-3xl p-6 mb-8 flex items-center justify-between border border-orange-100">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Valor Unitário</span>
                <span className="text-3xl font-black text-slate-900">{product.priceLabel}</span>
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <Info size={16} /> Descrição Técnica
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <Settings size={16} /> Compatibilidade
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map(item => (
                    <span key={item} className="bg-slate-100 px-3 py-1.5 rounded-xl text-sm font-semibold text-slate-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main CTA */}
            <div className="mt-auto pt-6 border-t border-slate-100">
              <button 
                onClick={handleWhatsAppInquiry}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-6 rounded-[2rem] font-bold text-2xl transition-all shadow-xl hover:shadow-green-200 active:scale-95 flex items-center justify-center gap-4 group"
              >
                <Phone size={32} className="group-hover:rotate-12 transition-transform" /> Consultar no WhatsApp
              </button>
              <p className="text-center text-slate-400 text-xs mt-4 font-bold uppercase tracking-widest">Atendimento especializado em minutos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
