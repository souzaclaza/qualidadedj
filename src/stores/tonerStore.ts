import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TonerRetornado, Toner } from '../types';

// Mock initial toners
const mockToners: Toner[] = [
  {
    id: '1',
    modelo: 'HP 26A',
    pesoCheio: 1200,
    pesoVazio: 800,
    impressorasCompativeis: ['HP LaserJet Pro M402', 'HP LaserJet Pro MFP M426'],
    cor: 'black',
    areaImpressaISO: '5%',
    capacidadeFolhas: 3100,
    tipo: 'original',
    precoCompra: 349.90,
    precoFolha: 349.90 / 3100,
    gramatura: 400
  },
  {
    id: '2',
    modelo: 'Brother TN660',
    pesoCheio: 950,
    pesoVazio: 650,
    impressorasCompativeis: ['Brother HL-L2340DW', 'Brother HL-L2360DW'],
    cor: 'black',
    areaImpressaISO: '5%',
    capacidadeFolhas: 2600,
    tipo: 'compatível',
    precoCompra: 189.90,
    precoFolha: 189.90 / 2600,
    gramatura: 300
  }
];

interface TonerStore {
  toners: Toner[];
  retornados: TonerRetornado[];
  setToners: (toners: Toner[]) => void;
  setRetornados: (retornados: TonerRetornado[]) => void;
  addRetornados: (novosRetornados: TonerRetornado[]) => void;
  addToner: (toner: Toner) => void;
  updateToner: (id: string, toner: Toner) => void;
  deleteToner: (id: string) => void;
  getDestinationStats: () => { name: string; value: number }[];
  getTotalRetornados: () => number;
  getValorRecuperado: () => number;
  getTaxaReaproveitamento: () => number;
  getModelosDiferentes: () => number;
}

export const useTonerStore = create(
  persist<TonerStore>(
    (set, get) => ({
      toners: mockToners,
      retornados: [],
      
      setToners: (toners) => set({ toners }),
      
      setRetornados: (retornados) => set({ retornados }),
      
      addRetornados: (novosRetornados) => 
        set((state) => ({ retornados: [...state.retornados, ...novosRetornados] })),

      addToner: (toner) =>
        set((state) => ({ toners: [...state.toners, toner] })),

      updateToner: (id, toner) =>
        set((state) => ({
          toners: state.toners.map((t) => t.id === id ? toner : t)
        })),

      deleteToner: (id) =>
        set((state) => ({
          toners: state.toners.filter((t) => t.id !== id)
        })),
      
      getDestinationStats: () => {
        const retornados = get().retornados;
        const total = retornados.length;
        if (total === 0) return [];
        
        const counts = retornados.reduce((acc, curr) => {
          acc[curr.destinoFinal] = (acc[curr.destinoFinal] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        return [
          { name: 'Estoque', value: (counts['estoque'] || 0) / total * 100 },
          { name: 'Uso Interno', value: (counts['uso-interno'] || 0) / total * 100 },
          { name: 'Descarte', value: (counts['descarte'] || 0) / total * 100 },
          { name: 'Garantia', value: (counts['garantia'] || 0) / total * 100 }
        ];
      },
      
      getTotalRetornados: () => {
        const retornados = get().retornados;
        return retornados.length;
      },
      
      getValorRecuperado: () => {
        const retornados = get().retornados;
        return retornados.reduce((total, curr) => total + curr.valorResgatado, 0);
      },
      
      getTaxaReaproveitamento: () => {
        const retornados = get().retornados;
        if (retornados.length === 0) return 0;
        
        const reaproveitados = retornados.filter(r => 
          r.destinoFinal === 'estoque' || r.destinoFinal === 'uso-interno'
        ).length;
        
        return (reaproveitados / retornados.length) * 100;
      },
      
      getModelosDiferentes: () => {
        const retornados = get().retornados;
        const modelos = new Set(retornados.map(r => r.modeloToner));
        return modelos.size;
      }
    }),
    {
      name: 'toner-storage'
    }
  )
);