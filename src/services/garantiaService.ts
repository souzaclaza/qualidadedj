import { Garantia, Fornecedor } from '../types';

export const garantiaService = {
  async getAllGarantias(): Promise<Garantia[]> {
    // TODO: Replace with database query
    return [];
  },

  async createGarantia(garantia: Omit<Garantia, 'id'>): Promise<Garantia> {
    // TODO: Replace with database insert
    return {
      id: Date.now().toString(),
      ...garantia
    };
  },

  async updateGarantia(id: string, garantia: Partial<Garantia>): Promise<Garantia> {
    // TODO: Replace with database update
    return {
      id,
      ...garantia as Garantia
    };
  }
};

export const fornecedorService = {
  async getAllFornecedores(): Promise<Fornecedor[]> {
    // TODO: Replace with database query
    return [];
  },

  async createFornecedor(fornecedor: Omit<Fornecedor, 'id'>): Promise<Fornecedor> {
    // TODO: Replace with database insert
    return {
      id: Date.now().toString(),
      ...fornecedor
    };
  },

  async updateFornecedor(id: string, fornecedor: Partial<Fornecedor>): Promise<Fornecedor> {
    // TODO: Replace with database update
    return {
      id,
      ...fornecedor as Fornecedor
    };
  }
};