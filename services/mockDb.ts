
import { supabase } from './supabase';
import { Product, Reservation, User, AuthState, SiteSettings, CartItem } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const DEFAULT_SETTINGS: SiteSettings = {
  name: 'AutocarExpress',
  subtext: 'Desmanche Especializado',
  whatsapp: '5511990072808',
  cnpj: '00.000.000/0001-00',
  workingHours: {
    weekdays: '08:00 às 18:00',
    saturday: '08:00 às 12:00'
  }
};

export const mockDb = {
  // Inicializa o banco e verifica se o usuário está logado no Supabase
  init: async () => {
    try {
      const { data: settingsData } = await supabase.from('site_settings').select('id').single();
      if (!settingsData) {
        await mockDb.saveSettings(DEFAULT_SETTINGS);
      }

      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
      if (count === 0) {
        const payloads = INITIAL_PRODUCTS.map(product => ({
          id: product.id,
          slug: product.slug,
          sku: product.sku,
          title: product.title,
          category: product.category,
          brand: product.brand,
          model: product.model,
          year_from: product.yearFrom,
          year_to: product.yearTo,
          condition: product.condition,
          description: product.description,
          compatibility: product.compatibility,
          price_label: product.priceLabel,
          images: product.images,
          status: product.status,
          created_at: product.createdAt
        }));
        await supabase.from('products').upsert(payloads);
      }
    } catch (e) {
      console.warn("Erro na inicialização:", e);
    }
  },

  getSettings: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase.from('site_settings').select('*').single();
    if (error || !data) return DEFAULT_SETTINGS;
    return {
      name: data.name,
      subtext: data.subtext,
      whatsapp: data.whatsapp,
      cnpj: data.cnpj,
      workingHours: data.working_hours
    };
  },

  saveSettings: async (settings: SiteSettings) => {
    const { error } = await supabase.from('site_settings').upsert({
      id: 1, 
      name: settings.name,
      subtext: settings.subtext,
      whatsapp: settings.whatsapp,
      cnpj: settings.cnpj,
      working_hours: settings.workingHours
    });
    if (!error) window.dispatchEvent(new Event('settingsUpdated'));
  },

  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data.map(p => ({
      id: p.id,
      slug: p.slug,
      sku: p.sku,
      title: p.title,
      category: p.category,
      brand: p.brand,
      model: p.model,
      yearFrom: p.year_from,
      yearTo: p.year_to,
      condition: p.condition,
      description: p.description,
      compatibility: p.compatibility,
      priceLabel: p.price_label,
      images: p.images,
      status: p.status,
      createdAt: p.created_at
    }));
  },

  getProductBySlug: async (slug: string): Promise<Product | undefined> => {
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
    if (error || !data) return undefined;
    return {
      id: data.id,
      slug: data.slug,
      sku: data.sku,
      title: data.title,
      category: data.category,
      brand: data.brand,
      model: data.model,
      yearFrom: data.year_from,
      yearTo: data.year_to,
      condition: data.condition,
      description: data.description,
      compatibility: data.compatibility,
      priceLabel: data.price_label,
      images: data.images,
      status: data.status,
      createdAt: data.created_at
    };
  },

  saveProduct: async (product: Product) => {
    const payload = {
      id: product.id,
      slug: product.slug,
      sku: product.sku,
      title: product.title,
      category: product.category,
      brand: product.brand,
      model: product.model,
      year_from: product.yearFrom,
      year_to: product.yearTo,
      condition: product.condition,
      description: product.description,
      compatibility: product.compatibility,
      price_label: product.priceLabel,
      images: product.images,
      status: product.status,
      created_at: product.createdAt
    };
    const { error } = await supabase.from('products').upsert(payload);
    if (!error) window.dispatchEvent(new Event('productsUpdated'));
  },

  deleteProduct: async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) window.dispatchEvent(new Event('productsUpdated'));
  },

  getReservations: async (): Promise<Reservation[]> => {
    const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data.map(r => ({
      id: r.id,
      productId: r.product_id,
      productTitle: r.product_title,
      productSku: r.product_sku,
      userId: r.user_id,
      userName: r.user_name,
      userPhone: r.user_phone,
      status: r.status,
      createdAt: r.created_at
    }));
  },

  addReservation: async (reservation: Reservation) => {
    await supabase.from('reservations').insert({
      id: reservation.id,
      product_id: reservation.productId,
      product_title: reservation.productTitle,
      product_sku: reservation.productSku,
      user_id: reservation.userId,
      user_name: reservation.userName,
      user_phone: reservation.userPhone,
      status: reservation.status,
      created_at: reservation.createdAt
    });
  },

  updateReservationStatus: async (id: string, status: Reservation['status']) => {
    await supabase.from('reservations').update({ status }).eq('id', id);
  },

  // Auth real utilizando Supabase session
  getAuth: async (): Promise<AuthState> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { user: null, isAuthenticated: false };
    
    return {
      user: {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata.full_name || 'Admin',
        role: 'admin'
      },
      isAuthenticated: true
    };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  // Cart management (local storage based)
  getCart: (): CartItem[] => {
    const cart = localStorage.getItem('autocar_cart');
    return cart ? JSON.parse(cart) : [];
  },

  updateCartQuantity: (productId: string, quantity: number) => {
    let cart = mockDb.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.product.id !== productId);
    } else {
      cart = cart.map(item => item.product.id === productId ? { ...item, quantity } : item);
    }
    localStorage.setItem('autocar_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  },

  removeFromCart: (productId: string) => {
    const cart = mockDb.getCart().filter(item => item.product.id !== productId);
    localStorage.setItem('autocar_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  },

  clearCart: () => {
    localStorage.removeItem('autocar_cart');
    window.dispatchEvent(new Event('cartUpdated'));
  },

  getUserReservations: async (userId: string): Promise<Reservation[]> => {
    const all = await mockDb.getReservations();
    return all.filter(r => r.userId === userId);
  }
};
