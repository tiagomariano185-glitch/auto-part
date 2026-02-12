
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Phone, Package } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { CartItem, Reservation } from '../types';

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const loadCart = () => {
    setCartItems(mockDb.getCart());
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    mockDb.updateCartQuantity(productId, quantity);
  };

  const handleRemove = (productId: string) => {
    mockDb.removeFromCart(productId);
  };

  const handleCheckout = () => {
    const auth = mockDb.getAuth();
    if (!auth.isAuthenticated) {
      alert('Por favor, faça login para realizar o pedido.');
      navigate('/login');
      return;
    }

    // Criar uma reserva para cada item no carrinho no banco mock
    cartItems.forEach(item => {
      const reservation: Reservation = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        productId: item.product.id,
        productTitle: item.product.title,
        productSku: item.product.sku,
        userId: auth.user!.id,
        userName: auth.user!.name,
        userPhone: 'Pendente no WhatsApp',
        status: 'new',
        createdAt: new Date().toISOString()
      };
      mockDb.addReservation(reservation);
    });

    const itemsList = cartItems.map(item => `- ${item.product.title} (${item.quantity}x) [SKU: ${item.product.sku}]`).join('\n');
    const message = encodeURIComponent(
      `Olá! Fiz um pedido pelo site e gostaria de finalizar o orçamento:\n\n${itemsList}\n\nFavor entrar em contato.`
    );
    
    // Limpar carrinho e redirecionar
    mockDb.clearCart();
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
    navigate('/minhas-reservas');
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-400">
            <ShoppingCart size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Seu carrinho está vazio</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Explore nosso catálogo e encontre as melhores peças para o seu veículo.</p>
          <Link to="/produtos" className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-xl">
            <ArrowLeft size={20} /> Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-black text-slate-900 mb-12 tracking-tight">Meu Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.product.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                  <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">
                      {item.product.title}
                    </h3>
                    <button 
                      onClick={() => handleRemove(item.product.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">SKU: {item.product.sku}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-1">
                      <button 
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors text-slate-500"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors text-slate-500"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-black text-slate-900">{item.product.priceLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg sticky top-32">
              <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Resumo</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Total de Peças</span>
                  <span className="font-black text-slate-900">{cartItems.reduce((s, i) => s + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Total Estimado</span>
                  <span className="font-black text-slate-900">Sob consulta</span>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-8">
                <p className="text-xs font-bold text-orange-600 leading-relaxed text-center uppercase tracking-wide">
                  Seu pedido ficará pendente no sistema até que o vendedor confirme os detalhes.
                </p>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mb-4"
              >
                <Phone size={24} /> Finalizar Pedido
              </button>
              
              <Link 
                to="/produtos"
                className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:bg-slate-200"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
