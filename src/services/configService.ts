import { DadosEmpresa } from '../types';

export const configService = {
  async getDadosEmpresa(): Promise<DadosEmpresa | null> {
    // TODO: Replace with database query
    return null;
  },

  async updateDadosEmpresa(dados: DadosEmpresa): Promise<DadosEmpresa> {
    // TODO: Replace with database update
    return dados;
  },

  async getFiliais(): Promise<string[]> {
    // TODO: Replace with database query
    return [
      'São Paulo',
      'Rio de Janeiro',
      'Belo Horizonte'
    ];
  },

  async addFilial(nome: string): Promise<void> {
    // TODO: Replace with database insert
  }
};