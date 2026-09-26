export type ProductCategory =
  | 'Fruits'
  | 'Légumes'
  | 'Céréales'
  | 'Tubercules'
  | 'Plantain'
  | 'Produits vivriers'
  | 'Autres';

export type ProductStatus = 'Disponible' | 'Vendu';

export type ProductUnit =
  | 'kg'
  | 'tonne'
  | 'sac de 50kg'
  | 'sac de 100kg'
  | 'régime'
  | 'cageot / casier'
  | 'filet'
  | 'seau';

export interface ProductOffer {
  id: string;
  title: string;
  category: ProductCategory;
  description: string;
  quantity: number;
  unit: ProductUnit;
  pricePerUnit: number; // in FCFA
  location: string;
  region: string;
  harvestDate: string; // e.g. 'Disponible immédiatement' or ISO date
  status: ProductStatus;
  imageUrl: string;
  producerId: string;
  producerName: string;
  producerPhone: string;
  producerWhatsApp: string;
  viewsCount: number;
  createdAt: string;
  isUrgent?: boolean; // Pour les récoltes périssables nécessitant un acheteur express
}

export type UserRole = 'producer' | 'buyer';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  whatsapp: string;
  cityOrLocation: string;
  organizationType?: string; // e.g. 'Coopérative', 'Indépendant', 'Grossiste', 'Restaurant'
  avatarUrl?: string;
}

export interface ProductFilters {
  searchTerm: string;
  category: string;
  location: string;
  status: string;
  sortBy: 'recent' | 'priceAsc' | 'priceDesc';
}
