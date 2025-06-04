import { create } from 'zustand';
import { AuthState, User } from '../types';

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@empresa.com.br',
    password: 'Admin@123',
    role: 'admin',
    permissions: ['all'] // Admin has full access by default
  },
  {
    id: '2',
    name: 'Editor',
    email: 'editor@empresa.com.br',
    password: 'Editor@123',
    role: 'editor',
    permissions: [
      'cadastro-toners',
      'registro-retornados', 
      'consulta-retornados',
      'graficos-volumetria',
      'graficos-destino',
      'graficos-valor-recuperado'
    ]
  },
  {
    id: '3',
    name: 'Visualizador',
    email: 'viewer@empresa.com.br',
    password: 'Viewer@123',
    role: 'viewer',
    permissions: [
      'consulta-retornados',
      'graficos-volumetria',
      'graficos-destino',
      'graficos-valor-recuperado'
    ]
  }
];

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserPassword: (userId: string, newPassword: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  hasPermission: (permission: string) => boolean;
  updateUserPermissions: (userId: string, permissions: string[]) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  users: mockUsers,

  login: async (email: string, password: string) => {
    const users = get().users;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      set({ user: userWithoutPassword, isAuthenticated: true });
      return true;
    }
    
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateUserPassword: (userId: string, newPassword: string) => {
    set(state => ({
      users: state.users.map(user => 
        user.id === userId 
          ? { ...user, password: newPassword }
          : user
      )
    }));
  },

  addUser: (newUser) => {
    const id = Date.now().toString();
    set(state => ({
      users: [...state.users, { ...newUser, id }]
    }));
  },

  updateUser: (userId: string, updates) => {
    set(state => ({
      users: state.users.map(user =>
        user.id === userId
          ? { ...user, ...updates }
          : user
      )
    }));
  },

  deleteUser: (userId: string) => {
    set(state => ({
      users: state.users.filter(user => user.id !== userId)
    }));
  },

  hasPermission: (permission: string) => {
    const { user } = get();
    if (!user) return false;
    if (user.role === 'admin' || user.permissions?.includes('all')) return true;
    return user.permissions?.includes(permission) || false;
  },

  updateUserPermissions: (userId: string, permissions: string[]) => {
    set(state => ({
      users: state.users.map(user =>
        user.id === userId
          ? { ...user, permissions }
          : user
      ),
      // Update current user if it's the one being modified
      user: state.user?.id === userId 
        ? { ...state.user, permissions }
        : state.user
    }));
  }
}));