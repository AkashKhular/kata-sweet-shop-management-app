import { Sweet, User, UserRole, AuthResponse } from '../types';
import { INITIAL_SWEETS, MOCK_ADMIN_USER, MOCK_CUSTOMER_USER } from '../constants';

const STORAGE_KEYS = {
  SWEETS: 'sugar_rush_sweets_v2', // Updated key to force refresh for new baked goods
  USER: 'sugar_rush_user',
  TOKEN: 'sugar_rush_token'
};

// Initialize simulated database
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SWEETS)) {
    localStorage.setItem(STORAGE_KEYS.SWEETS, JSON.stringify(INITIAL_SWEETS));
  }
};

initStorage();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (username: string, password: string): Promise<AuthResponse> => {
      await delay(500); // Simulate network latency
      
      if (username === MOCK_ADMIN_USER.username && password === MOCK_ADMIN_USER.password) {
        const user: User = { id: MOCK_ADMIN_USER.id, username, role: MOCK_ADMIN_USER.role };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-admin-token');
        return { user, token: 'mock-jwt-admin-token' };
      }

      if (username === MOCK_CUSTOMER_USER.username && password === MOCK_CUSTOMER_USER.password) {
        const user: User = { id: MOCK_CUSTOMER_USER.id, username, role: MOCK_CUSTOMER_USER.role };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-customer-token');
        return { user, token: 'mock-jwt-customer-token' };
      }
      
      // Allow registration on the fly for demo if not matching mock users
      const user: User = { id: `user-${Date.now()}`, username, role: UserRole.CUSTOMER };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, `mock-jwt-${Date.now()}`);
      return { user, token: `mock-jwt-${Date.now()}` };
    },
    
    logout: async () => {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    },

    getCurrentUser: (): User | null => {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    }
  },

  sweets: {
    getAll: async (): Promise<Sweet[]> => {
      await delay(300);
      const sweets = localStorage.getItem(STORAGE_KEYS.SWEETS);
      return sweets ? JSON.parse(sweets) : [];
    },

    getById: async (id: string): Promise<Sweet | undefined> => {
      await delay(200);
      const sweets: Sweet[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SWEETS) || '[]');
      return sweets.find(s => s.id === id);
    },

    create: async (sweet: Omit<Sweet, 'id'>): Promise<Sweet> => {
      await delay(500);
      const sweets: Sweet[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SWEETS) || '[]');
      const newSweet: Sweet = { ...sweet, id: Date.now().toString() };
      sweets.push(newSweet);
      localStorage.setItem(STORAGE_KEYS.SWEETS, JSON.stringify(sweets));
      return newSweet;
    },

    update: async (id: string, updates: Partial<Sweet>): Promise<Sweet> => {
      await delay(400);
      const sweets: Sweet[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SWEETS) || '[]');
      const index = sweets.findIndex(s => s.id === id);
      if (index === -1) throw new Error('Sweet not found');
      
      const updatedSweet = { ...sweets[index], ...updates };
      sweets[index] = updatedSweet;
      localStorage.setItem(STORAGE_KEYS.SWEETS, JSON.stringify(sweets));
      return updatedSweet;
    },

    delete: async (id: string): Promise<void> => {
      await delay(400);
      const sweets: Sweet[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SWEETS) || '[]');
      const filtered = sweets.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SWEETS, JSON.stringify(filtered));
    },

    purchase: async (id: string, quantity: number = 1): Promise<Sweet> => {
      await delay(300);
      const sweets: Sweet[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SWEETS) || '[]');
      const index = sweets.findIndex(s => s.id === id);
      if (index === -1) throw new Error('Sweet not found');
      
      if (sweets[index].quantity < quantity) {
        throw new Error('Insufficient stock');
      }

      sweets[index].quantity -= quantity;
      localStorage.setItem(STORAGE_KEYS.SWEETS, JSON.stringify(sweets));
      return sweets[index];
    }
  }
};