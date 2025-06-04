import { create } from 'zustand';
import { NC, NCAnalise, NCAcao, NCVerificacao } from '../types';

interface NCStore {
  ncs: NC[];
  analises: NCAnalise[];
  acoes: NCAcao[];
  verificacoes: NCVerificacao[];
  
  // NC
  addNC: (nc: NC) => void;
  updateNC: (id: string, nc: Partial<NC>) => void;
  deleteNC: (id: string) => void;
  
  // Análise
  addAnalise: (analise: NCAnalise) => void;
  updateAnalise: (id: string, analise: Partial<NCAnalise>) => void;
  
  // Ações
  addAcao: (acao: NCAcao) => void;
  updateAcao: (id: string, acao: Partial<NCAcao>) => void;
  
  // Verificação
  addVerificacao: (verificacao: NCVerificacao) => void;
  updateVerificacao: (id: string, verificacao: Partial<NCVerificacao>) => void;
  
  // Getters
  getNC: (id: string) => NC | undefined;
  getAnalise: (ncId: string) => NCAnalise | undefined;
  getAcoes: (ncId: string) => NCAcao[];
  getVerificacao: (ncId: string) => NCVerificacao | undefined;
  
  // Stats
  getNCsByStatus: () => Record<NC['status'], number>;
  getNCsByGravidade: () => Record<NC['gravidade'], number>;
  getNCsByClassificacao: () => Record<NC['classificacao'], number>;
}

export const useNCStore = create<NCStore>((set, get) => ({
  ncs: [],
  analises: [],
  acoes: [],
  verificacoes: [],
  
  addNC: (nc) => {
    set((state) => ({ 
      ncs: [...state.ncs, nc]
    }));
  },
  
  updateNC: (id, updates) => {
    set((state) => ({
      ncs: state.ncs.map((nc) => 
        nc.id === id ? { ...nc, ...updates } : nc
      )
    }));
  },
  
  deleteNC: (id) => {
    set((state) => ({
      ncs: state.ncs.filter((nc) => nc.id !== id),
      analises: state.analises.filter((a) => a.ncId !== id),
      acoes: state.acoes.filter((a) => a.ncId !== id),
      verificacoes: state.verificacoes.filter((v) => v.ncId !== id)
    }));
  },
  
  addAnalise: (analise) => {
    set((state) => ({ 
      analises: [...state.analises, analise],
      ncs: state.ncs.map(nc => 
        nc.id === analise.ncId 
          ? { ...nc, status: 'plano-acao' as const }
          : nc
      )
    }));
  },
  
  updateAnalise: (id, updates) => {
    set((state) => ({
      analises: state.analises.map((analise) => 
        analise.id === id ? { ...analise, ...updates } : analise
      )
    }));
  },
  
  addAcao: (acao) => {
    set((state) => ({ 
      acoes: [...state.acoes, acao]
    }));
  },
  
  updateAcao: (id, updates) => {
    set((state) => {
      const newAcoes = state.acoes.map((acao) => 
        acao.id === id ? { ...acao, ...updates } : acao
      );
      
      // Check if all actions are completed
      const ncId = newAcoes.find(a => a.id === id)?.ncId;
      if (ncId) {
        const ncAcoes = newAcoes.filter(a => a.ncId === ncId);
        const allCompleted = ncAcoes.every(a => a.status === 'concluida');
        
        if (allCompleted) {
          return {
            acoes: newAcoes,
            ncs: state.ncs.map(nc => 
              nc.id === ncId 
                ? { ...nc, status: 'verificacao' as const }
                : nc
            )
          };
        }
      }
      
      return { acoes: newAcoes };
    });
  },
  
  addVerificacao: (verificacao) => {
    set((state) => ({ 
      verificacoes: [...state.verificacoes, verificacao],
      ncs: state.ncs.map(nc => 
        nc.id === verificacao.ncId 
          ? { ...nc, status: 'encerrado' as const }
          : nc
      )
    }));
  },
  
  updateVerificacao: (id, updates) => {
    set((state) => ({
      verificacoes: state.verificacoes.map((verificacao) => 
        verificacao.id === id ? { ...verificacao, ...updates } : verificacao
      )
    }));
  },
  
  getNC: (id) => {
    const { ncs } = get();
    return ncs.find((nc) => nc.id === id);
  },
  
  getAnalise: (ncId) => {
    const { analises } = get();
    return analises.find((analise) => analise.ncId === ncId);
  },
  
  getAcoes: (ncId) => {
    const { acoes } = get();
    return acoes.filter((acao) => acao.ncId === ncId);
  },
  
  getVerificacao: (ncId) => {
    const { verificacoes } = get();
    return verificacoes.find((verificacao) => verificacao.ncId === ncId);
  },
  
  getNCsByStatus: () => {
    const { ncs } = get();
    return ncs.reduce((acc, nc) => {
      acc[nc.status] = (acc[nc.status] || 0) + 1;
      return acc;
    }, {} as Record<NC['status'], number>);
  },
  
  getNCsByGravidade: () => {
    const { ncs } = get();
    return ncs.reduce((acc, nc) => {
      acc[nc.gravidade] = (acc[nc.gravidade] || 0) + 1;
      return acc;
    }, {} as Record<NC['gravidade'], number>);
  },
  
  getNCsByClassificacao: () => {
    const { ncs } = get();
    return ncs.reduce((acc, nc) => {
      acc[nc.classificacao] = (acc[nc.classificacao] || 0) + 1;
      return acc;
    }, {} as Record<NC['classificacao'], number>);
  }
}));