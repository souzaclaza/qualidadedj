import { create } from 'zustand';
import { FormularioAuditoria, Auditoria } from '../types';

interface AuditoriaStore {
  formularios: FormularioAuditoria[];
  auditorias: Auditoria[];
  addFormulario: (formulario: FormularioAuditoria) => void;
  updateFormulario: (id: string, formulario: FormularioAuditoria) => void;
  deleteFormulario: (id: string) => void;
  addAuditoria: (auditoria: Auditoria) => void;
  updateAuditoria: (id: string, auditoria: Auditoria) => void;
  deleteAuditoria: (id: string) => void;
  getFormulario: (id: string) => FormularioAuditoria | undefined;
  getAuditoria: (id: string) => Auditoria | undefined;
}

export const useAuditoriaStore = create<AuditoriaStore>((set, get) => ({
  formularios: [],
  auditorias: [],

  addFormulario: (formulario) => 
    set((state) => ({ formularios: [...state.formularios, formulario] })),

  updateFormulario: (id, formulario) =>
    set((state) => ({
      formularios: state.formularios.map((f) => 
        f.id === id ? formulario : f
      )
    })),

  deleteFormulario: (id) =>
    set((state) => ({
      formularios: state.formularios.filter((f) => f.id !== id)
    })),

  addAuditoria: (auditoria) =>
    set((state) => ({ auditorias: [...state.auditorias, auditoria] })),

  updateAuditoria: (id, auditoria) =>
    set((state) => ({
      auditorias: state.auditorias.map((a) => 
        a.id === id ? auditoria : a
      )
    })),

  deleteAuditoria: (id) =>
    set((state) => ({
      auditorias: state.auditorias.filter((a) => a.id !== id)
    })),

  getFormulario: (id) => {
    const { formularios } = get();
    return formularios.find((f) => f.id === id);
  },

  getAuditoria: (id) => {
    const { auditorias } = get();
    return auditorias.find((a) => a.id === id);
  }
}));