
export type Condition = 'Novo' | 'Usado' | 'Recondicionado';

export interface Product {
  id: string;
  slug: string;
  sku: string;
  title: string;
  category: string;
  brand: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  condition: Condition;
  description: string;
  compatibility: string[];
  priceLabel: string;
  images: string[];
  status: 'available' | 'sold';
  createdAt: string;
}

export interface SiteSettings {
  name: string;
  subtext: string;
  whatsapp: string;
  cnpj: string;
  workingHours: {
    weekdays: string;
    saturday: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ReservationStatus = 'new' | 'contacted' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  productId: string;
  productTitle: string;
  productSku: string;
  userId: string;
  userName: string;
  userPhone: string;
  city?: string;
  observation?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}