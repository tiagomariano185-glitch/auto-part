
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'sucata-toyota-corolla-2015-inteira',
    sku: 'SUC-COR-15',
    title: 'Sucata Toyota Corolla 2015 para Peças',
    category: 'Sucata Veículo',
    brand: 'Toyota',
    model: 'Corolla',
    yearFrom: 2014,
    yearTo: 2016,
    condition: 'Usado',
    description: 'Sucata inteira para retirada de peças. Motor, câmbio e suspensão em ótimo estado.',
    compatibility: ['Toyota Corolla 2014-2017'],
    priceLabel: 'Sob consulta',
    images: ['https://picsum.photos/seed/corolla-scrap/800/600'],
    status: 'available',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    slug: 'sucata-mercedes-benz-atego-1719-2022',
    sku: 'SUC-CAM-001',
    title: 'Sucata Caminhão Mercedes-Benz Atego 1719',
    category: 'Sucata Caminhões',
    brand: 'Mercedes-Benz',
    model: 'Atego 1719',
    yearFrom: 2021,
    yearTo: 2023,
    condition: 'Usado',
    description: 'Sucata de caminhão Mercedes-Benz Atego 1719 ano 2022. Diversas peças mecânicas e cabine disponíveis.',
    compatibility: ['Mercedes Atego 1719', 'Atego 1419'],
    priceLabel: 'Sob consulta',
    images: ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800'],
    status: 'available',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    slug: 'sucata-volkswagen-gol-g6-batido',
    sku: 'SUC-GOL-G6',
    title: 'Sucata VW Gol G6 Batido para Peças',
    category: 'Sucata Veículo',
    brand: 'Volkswagen',
    model: 'Gol',
    yearFrom: 2013,
    yearTo: 2016,
    condition: 'Usado',
    description: 'Veículo com colisão traseira. Frente completa e motorização OK.',
    compatibility: ['Volkswagen Gol G6'],
    priceLabel: 'Sob consulta',
    images: ['https://picsum.photos/seed/gol-scrap/800/600'],
    status: 'available',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    slug: 'sucata-scania-r440-2014',
    sku: 'SUC-SCA-R440',
    title: 'Sucata Cavalo Mecânico Scania R440 2014',
    category: 'Sucata Caminhões',
    brand: 'Scania',
    model: 'R440',
    yearFrom: 2013,
    yearTo: 2015,
    condition: 'Usado',
    description: 'Sucata de cavalo mecânico Scania R440. Motor e diferencial disponíveis para venda de peças.',
    compatibility: ['Scania R440', 'Scania G440'],
    priceLabel: 'Sob consulta',
    images: ['https://picsum.photos/seed/scania-scrap/800/600'],
    status: 'available',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    slug: 'sucata-chevrolet-onix-2019',
    sku: 'SUC-ONIX-19',
    title: 'Sucata Chevrolet Onix 2019 para Desmonte',
    category: 'Sucata Veículo',
    brand: 'Chevrolet',
    model: 'Onix',
    yearFrom: 2017,
    yearTo: 2019,
    condition: 'Usado',
    description: 'Onix 2019 com procedência de seguradora. Peças de lataria e interior impecáveis.',
    compatibility: ['Chevrolet Onix 2013-2019'],
    priceLabel: 'Sob consulta',
    images: ['https://picsum.photos/seed/onix-scrap/800/600'],
    status: 'available',
    createdAt: new Date().toISOString()
  }
];

export const CATEGORIES = ['Sucata Veículo', 'Sucata Caminhões'];
export const BRANDS = [
  'Toyota', 'Volkswagen', 'Fiat', 'Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Jeep', 
  'Mercedes-Benz', 'Volvo', 'Scania', 'Iveco', 'MAN', 'DAF'
];
