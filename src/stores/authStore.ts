import { create } from 'zustand';

interface AuthStore {
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthStore>(() => ({
  hasPermission: () => true
}));