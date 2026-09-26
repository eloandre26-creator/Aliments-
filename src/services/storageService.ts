import { ProductOffer, UserProfile } from '../types';
import { INITIAL_PRODUCTS, DEMO_USERS } from '../data/mockProducts';

const PRODUCTS_KEY = 'agrolink_cameroon_products_v2';
const USER_KEY = 'agrolink_cameroon_current_user_v2';

export const storageService = {
  getProducts(): ProductOffer[] {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      if (!data) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data) as ProductOffer[];
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  getProductById(id: string): ProductOffer | undefined {
    const list = this.getProducts();
    return list.find((p) => p.id === id);
  },

  addProduct(newOffer: Omit<ProductOffer, 'id' | 'viewsCount' | 'createdAt'>): ProductOffer {
    const list = this.getProducts();
    const created: ProductOffer = {
      ...newOffer,
      id: 'prod-' + Date.now(),
      viewsCount: 0,
      createdAt: new Date().toISOString(),
    };
    const updatedList = [created, ...list];
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    return created;
  },

  updateProduct(id: string, updates: Partial<ProductOffer>): ProductOffer | null {
    const list = this.getProducts();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated = { ...list[index], ...updates };
    list[index] = updated;

    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    return updated;
  },

  deleteProduct(id: string): boolean {
    const list = this.getProducts();
    const filtered = list.filter((p) => p.id !== id);
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Failed to save to localStorage', e);
      return false;
    }
  },

  incrementViews(id: string): void {
    const list = this.getProducts();
    const item = list.find((p) => p.id === id);
    if (item) {
      item.viewsCount = (item.viewsCount || 0) + 1;
      try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    }
  },

  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      if (!data) {
        // Default to Demo Producer for easy testing out of the box
        this.setCurrentUser(DEMO_USERS.producer);
        return DEMO_USERS.producer;
      }
      return JSON.parse(data) as UserProfile;
    } catch {
      return DEMO_USERS.producer;
    }
  },

  setCurrentUser(user: UserProfile | null): void {
    try {
      if (!user) {
        localStorage.removeItem(USER_KEY);
      } else {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.error('Failed to set user in localStorage', e);
    }
  },

  resetToDefault(): void {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(USER_KEY, JSON.stringify(DEMO_USERS.producer));
    } catch (e) {
      console.error('Failed to reset localStorage', e);
    }
  }
};
