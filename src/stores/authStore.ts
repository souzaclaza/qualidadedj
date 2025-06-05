import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState, User } from '../types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserPassword: (userId: string, newPassword: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  updateUserPermissions: (userId: string, permissions: string[]) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  users: [],

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.status === 500 && error.message.includes('Database error querying schema')) {
          console.error('Internal Supabase database error. Please ensure:');
          console.error('1. The user is created in the Supabase dashboard');
          console.error('2. The database schema and RLS policies are set up correctly');
          console.error('3. Contact Supabase support if the issue persists');
          throw new Error('Database configuration error');
        }
        throw error;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({ 
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: profile?.name || '',
            role: profile?.role || 'viewer',
            permissions: profile?.permissions || []
          },
          isAuthenticated: true 
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  updateUserPassword: async (userId: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { password: newPassword }
      );
      if (error) throw error;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  addUser: async (newUser) => {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: newUser.name,
            role: newUser.role,
            permissions: newUser.permissions
          });

        if (profileError) throw profileError;
      }
    } catch (error) {
      console.error('Add user error:', error);
      throw error;
    }
  },

  updateUser: async (userId: string, updates) => {
    try {
      if (updates.email || updates.password) {
        const { error } = await supabase.auth.admin.updateUserById(
          userId,
          {
            email: updates.email,
            password: updates.password
          }
        );
        if (error) throw error;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          role: updates.role,
          permissions: updates.permissions
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update local state if current user
      const { user } = get();
      if (user?.id === userId) {
        set({
          user: {
            ...user,
            ...updates,
            password: undefined
          }
        });
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  hasPermission: (permission: string) => {
    const { user } = get();
    if (!user) return false;
    if (user.role === 'admin' || user.permissions?.includes('all')) return true;
    return user.permissions?.includes(permission) || false;
  },

  updateUserPermissions: async (userId: string, permissions: string[]) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ permissions })
        .eq('id', userId);

      if (error) throw error;

      // Update local state if current user
      const { user } = get();
      if (user?.id === userId) {
        set({
          user: {
            ...user,
            permissions
          }
        });
      }
    } catch (error) {
      console.error('Update permissions error:', error);
      throw error;
    }
  }
}));