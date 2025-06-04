import { create } from 'zustand';
import { KaizenIdea, KaizenAvaliacao, KaizenImplementacao } from '../types';

interface KaizenStore {
  ideias: KaizenIdea[];
  avaliacoes: KaizenAvaliacao[];
  implementacoes: KaizenImplementacao[];
  
  // Ideias
  addIdeia: (ideia: KaizenIdea) => void;
  updateIdeia: (id: string, ideia: Partial<KaizenIdea>) => void;
  deleteIdeia: (id: string) => void;
  
  // Avaliação
  addAvaliacao: (avaliacao: KaizenAvaliacao) => void;
  updateAvaliacao: (id: string, avaliacao: Partial<KaizenAvaliacao>) => void;
  
  // Implementação
  addImplementacao: (implementacao: KaizenImplementacao) => void;
  updateImplementacao: (id: string, implementacao: Partial<KaizenImplementacao>) => void;
  
  // Getters
  getIdeia: (id: string) => KaizenIdea | undefined;
  getAvaliacao: (kaizenId: string) => KaizenAvaliacao | undefined;
  getImplementacao: (kaizenId: string) => KaizenImplementacao | undefined;
  
  // Stats
  getIdeiasByStatus: () => Record<KaizenIdea['status'], number>;
  getIdeiasByImpacto: () => Record<KaizenIdea['impacto'], number>;
  getIdeiasBySetor: () => Record<string, number>;
}

export const useKaizenStore = create<KaizenStore>((set, get) => ({
  ideias: [],
  avaliacoes: [],
  implementacoes: [],
  
  addIdeia: (ideia) => {
    set((state) => ({ 
      ideias: [...state.ideias, ideia]
    }));
  },
  
  updateIdeia: (id, updates) => {
    set((state) => ({
      ideias: state.ideias.map((ideia) => 
        ideia.id === id ? { ...ideia, ...updates } : ideia
      )
    }));
  },
  
  deleteIdeia: (id) => {
    set((state) => ({
      ideias: state.ideias.filter((ideia) => ideia.id !== id),
      avaliacoes: state.avaliacoes.filter((a) => a.kaizenId !== id),
      implementacoes: state.implementacoes.filter((i) => i.kaizenId !== id)
    }));
  },
  
  addAvaliacao: (avaliacao) => {
    set((state) => ({ 
      avaliacoes: [...state.avaliacoes, avaliacao],
      ideias: state.ideias.map(ideia => 
        ideia.id === avaliacao.kaizenId 
          ? { ...ideia, status: 'aprovada' as const }
          : ideia
      )
    }));
  },
  
  updateAvaliacao: (id, updates) => {
    set((state) => ({
      avaliacoes: state.avaliacoes.map((avaliacao) => 
        avaliacao.id === id ? { ...avaliacao, ...updates } : avaliacao
      )
    }));
  },
  
  addImplementacao: (implementacao) => {
    set((state) => ({ 
      implementacoes: [...state.implementacoes, implementacao],
      ideias: state.ideias.map(ideia => 
        ideia.id === implementacao.kaizenId 
          ? { ...ideia, status: 'implementada' as const }
          : ideia
      )
    }));
  },
  
  updateImplementacao: (id, updates) => {
    set((state) => ({
      implementacoes: state.implementacoes.map((implementacao) => 
        implementacao.id === id ? { ...implementacao, ...updates } : implementacao
      )
    }));
  },
  
  getIdeia: (id) => {
    const { ideias } = get();
    return ideias.find((ideia) => ideia.id === id);
  },
  
  getAvaliacao: (kaizenId) => {
    const { avaliacoes } = get();
    return avaliacoes.find((avaliacao) => avaliacao.kaizenId === kaizenId);
  },
  
  getImplementacao: (kaizenId) => {
    const { implementacoes } = get();
    return implementacoes.find((implementacao) => implementacao.kaizenId === kaizenId);
  },
  
  getIdeiasByStatus: () => {
    const { ideias } = get();
    return ideias.reduce((acc, ideia) => {
      acc[ideia.status] = (acc[ideia.status] || 0) + 1;
      return acc;
    }, {} as Record<KaizenIdea['status'], number>);
  },
  
  getIdeiasByImpacto: () => {
    const { ideias } = get();
    return ideias.reduce((acc, ideia) => {
      acc[ideia.impacto] = (acc[ideia.impacto] || 0) + 1;
      return acc;
    }, {} as Record<KaizenIdea['impacto'], number>);
  },
  
  getIdeiasBySetor: () => {
    const { ideias } = get();
    return ideias.reduce((acc, ideia) => {
      acc[ideia.setor] = (acc[ideia.setor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}));