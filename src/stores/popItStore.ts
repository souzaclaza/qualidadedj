import { create } from 'zustand';
import { PopIt, PopItArquivo } from '../types';

interface PopItStore {
  popIts: PopIt[];
  arquivos: PopItArquivo[];
  setores: string[];
  
  // PopIt
  addPopIt: (popIt: PopIt) => void;
  updatePopIt: (id: string, popIt: PopIt) => void;
  deletePopIt: (id: string) => void;
  
  // Arquivos
  addArquivo: (arquivo: PopItArquivo) => void;
  getUltimaVersao: (popItId: string) => PopItArquivo | undefined;
  getArquivosByPopIt: (popItId: string) => PopItArquivo[];
  
  // Setores
  addSetor: (setor: string) => void;
}

export const usePopItStore = create<PopItStore>((set, get) => ({
  popIts: [],
  arquivos: [],
  setores: ['Qualidade', 'Produção', 'Manutenção', 'Logística', 'RH'],
  
  addPopIt: (popIt) => 
    set((state) => ({ popIts: [...state.popIts, popIt] })),
    
  updatePopIt: (id, popIt) =>
    set((state) => ({
      popIts: state.popIts.map((p) => p.id === id ? popIt : p)
    })),
    
  deletePopIt: (id) =>
    set((state) => ({
      popIts: state.popIts.filter((p) => p.id !== id)
    })),
    
  addArquivo: (arquivo) =>
    set((state) => ({ arquivos: [...state.arquivos, arquivo] })),
    
  getUltimaVersao: (popItId) => {
    const { arquivos } = get();
    return arquivos
      .filter(a => a.popItId === popItId)
      .sort((a, b) => b.versao - a.versao)[0];
  },
  
  getArquivosByPopIt: (popItId) => {
    const { arquivos } = get();
    return arquivos
      .filter(a => a.popItId === popItId)
      .sort((a, b) => b.versao - a.versao);
  },
  
  addSetor: (setor) =>
    set((state) => ({
      setores: [...new Set([...state.setores, setor])]
    })),
}));