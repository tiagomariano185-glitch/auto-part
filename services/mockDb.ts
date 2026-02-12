
import { Product, Reservation, User, AuthState, CartItem, SiteSettings } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const KEYS = {
  PRODUCTS: 'autopart_products',
  RESERVATIONS: 'autopart_reservations',
  AUTH: 'autopart_auth',
  CART: 'autopart_cart',
  SETTINGS: 'autopart_settings'
};

const DEFAULT_SETTINGS: SiteSettings = {
  name: 'AutoPart',
  subtext: 'Desmanche Especializado',
  whatsapp: '5511999999999',
  cnpj: '00.000.000/0001-00',
  workingHours: {
    weekdays: '08:00 às 18:00',
    saturday: '08:00 às 12:00'
  }
};

export const mockDb = {
  init: () => {
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(KEYS.RESERVATIONS)) {
      localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.CART)) {
      localStorage.setItem(KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  },

  // Settings
  getSettings: (): SiteSettings => {
    return JSON.parse(localStorage.getItem(KEYS.SETTINGS) || JSON.stringify(DEFAULT_SETTINGS));
  },
  saveSettings: (settings: SiteSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event('settingsUpdated'));
  },

  // Products
  getProducts: (): Product[] => {
    return JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || '[]');
  },
  getProductBySlug: (slug: string): Product | undefined => {
    return mockDb.getProducts().find(p => p.slug === slug);
  },
  saveProduct: (product: Product) => {
    const products = mockDb.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('productsUpdated'));
  },
  deleteProduct: (id: string) => {
    const products = mockDb.getProducts().filter(p => p.id !== id);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('productsUpdated'));
  },

  // Cart
  getCart: (): CartItem[] => {
    return JSON.parse(localStorage.getItem(KEYS.CART) || '[]');
  },
  addToCart: (product: Product) => {
    const cart = mockDb.getCart();
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }
    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  },
  removeFromCart: (productId: string) => {
    const cart = mockDb.getCart().filter(item => item.product.id !== productId);
    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  },
  updateCartQuantity: (productId: string, quantity: number) => {
    const cart = mockDb.getCart();
    const index = cart.findIndex(item => item.product.id === productId);
    if (index > -1) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
      }
      localStorage.setItem(KEYS.CART, JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  },
  clearCart: () => {
    localStorage.setItem(KEYS.CART, JSON.stringify([]));
    window.dispatchEvent(new Event('cartUpdated'));
  },

  // Reservations
  getReservations: (): Reservation[] => {
    return JSON.parse(localStorage.getItem(KEYS.RESERVATIONS) || '[]');
  },
  getUserReservations: (userId: string): Reservation[] => {
    return mockDb.getReservations().filter(r => r.userId === userId);
  },
  addReservation: (reservation: Reservation) => {
    const reservations = mockDb.getReservations();
    reservations.push(reservation);
    localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(reservations));
  },
  updateReservationStatus: (id: string, status: Reservation['status']) => {
    const reservations = mockDb.getReservations();
    const index = reservations.findIndex(r => r.id === id);
    if (index > -1) {
      reservations[index].status = status;
      localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(reservations));
    }
  },

  // Auth
  getAuth: (): AuthState => {
    return JSON.parse(localStorage.getItem(KEYS.AUTH) || '{"user": null, "isAuthenticated": false}');
  },
  setAuth: (user: User | null) => {
    const auth: AuthState = { user, isAuthenticated: !!user };
    localStorage.setItem(KEYS.AUTH, JSON.stringify(auth));
  },
  logout: () => {
    localStorage.removeItem(KEYS.AUTH);
  }
};