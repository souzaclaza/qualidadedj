import { create } from 'zustand';
import { Fornecedor, Garantia } from '../types';

interface GarantiaStore {
  fornecedores: Fornecedor[];
  garantias: Garantia[];
  
  // Fornecedores
  addFornecedor: (fornecedor: Fornecedor) => void;
  updateFornecedor: (id: string, fornecedor: Fornecedor) => void;
  deleteFornecedor: (id: string) => void;
  
  // Garantias
  addGarantia: (garantia: Garantia) => void;
  updateGarantia: (id: string, garantia: Garantia) => void;
  deleteGarantia: (id: string) => void;
  
  // Getters
  getFornecedor: (id: string) => Fornecedor | undefined;
  getGarantia: (id: string) => Garantia | undefined;
}

export const useGarantiaStore = create<GarantiaStore>((set, get) => ({
  fornecedores: [],
  garantias: [],

  addFornecedor: (fornecedor) => 
    set((state) => ({ fornecedores: [...state.fornecedores, fornecedor] })),

  updateFornecedor: (id, fornecedor) =>
    set((state) => ({
      fornecedores: state.fornecedores.map((f) => 
        f.id === id ? fornecedor : f
      )
    })),

  deleteFornecedor: (id) =>
    set((state) => ({
      fornecedores: state.fornecedores.filter((f) => f.id !== id)
    })),

  addGarantia: (garantia) =>
    set((state) => ({ garantias: [...state.garantias, garantia] })),

  updateGarantia: (id, garantia) =>
    set((state) => ({
      garantias: state.garantias.map((g) => 
        g.id === id ? garantia : g
      )
    })),

  deleteGarantia: (id) =>
    set((state) => ({
      garantias: state.garantias.filter((g) => g.id !== id)
    })),

  getFornecedor: (id) => {
    const { fornecedores } = get();
    return fornecedores.find((f) => f.id === id);
  },

  getGarantia: (id) => {
    const { garantias } = get();
    return garantias.find((g) => g.id === id);
  }
}));