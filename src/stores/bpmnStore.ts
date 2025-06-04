import { create } from 'zustand';
import { BPMN, BPMNArquivo } from '../types';

interface BPMNStore {
  bpmns: BPMN[];
  arquivos: BPMNArquivo[];
  setores: string[];
  
  // BPMN
  addBPMN: (bpmn: BPMN) => void;
  updateBPMN: (id: string, bpmn: BPMN) => void;
  deleteBPMN: (id: string) => void;
  
  // Arquivos
  addArquivo: (arquivo: BPMNArquivo) => void;
  getUltimaVersao: (bpmnId: string) => BPMNArquivo | undefined;
  getArquivosByBPMN: (bpmnId: string) => BPMNArquivo[];
  
  // Setores
  addSetor: (setor: string) => void;
}

export const useBPMNStore = create<BPMNStore>((set, get) => ({
  bpmns: [],
  arquivos: [],
  setores: ['Qualidade', 'Produção', 'Manutenção', 'Logística', 'RH'],
  
  addBPMN: (bpmn) => 
    set((state) => ({ bpmns: [...state.bpmns, bpmn] })),
    
  updateBPMN: (id, bpmn) =>
    set((state) => ({
      bpmns: state.bpmns.map((p) => p.id === id ? bpmn : p)
    })),
    
  deleteBPMN: (id) =>
    set((state) => ({
      bpmns: state.bpmns.filter((p) => p.id !== id)
    })),
    
  addArquivo: (arquivo) =>
    set((state) => ({ arquivos: [...state.arquivos, arquivo] })),
    
  getUltimaVersao: (bpmnId) => {
    const { arquivos } = get();
    return arquivos
      .filter(a => a.bpmnId === bpmnId)
      .sort((a, b) => b.versao - a.versao)[0];
  },
  
  getArquivosByBPMN: (bpmnId) => {
    const { arquivos } = get();
    return arquivos
      .filter(a => a.bpmnId === bpmnId)
      .sort((a, b) => b.versao - a.versao);
  },
  
  addSetor: (setor) =>
    set((state) => ({
      setores: [...new Set([...state.setores, setor])]
    })),
}));