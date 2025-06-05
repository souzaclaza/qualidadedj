import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Toner, TonerRetornado } from '../types';

interface TonerStore {
  toners: Toner[];
  retornados: TonerRetornado[];
  setToners: (toners: Toner[]) => void;
  setRetornados: (retornados: TonerRetornado[]) => void;
  addRetornados: (novosRetornados: TonerRetornado[]) => void;
  addToner: (toner: Omit<Toner, 'id'>) => Promise<void>;
  updateToner: (id: string, toner: Omit<Toner, 'id'>) => Promise<void>;
  deleteToner: (id: string) => Promise<void>;
  getDestinationStats: () => { name: string; value: number }[];
  getTotalRetornados: () => number;
  getValorRecuperado: () => number;
  getTaxaReaproveitamento: () => number;
  getModelosDiferentes: () => number;
  fetchToners: () => Promise<void>;
  fetchRetornados: () => Promise<void>;
}

export const useTonerStore = create<TonerStore>((set, get) => ({
  toners: [],
  retornados: [],
  
  setToners: (toners) => set({ toners }),
  setRetornados: (retornados) => set({ retornados }),
  
  addRetornados: async (novosRetornados) => {
    try {
      const { error } = await supabase
        .from('retornados')
        .insert(novosRetornados.map(r => ({
          id_cliente: r.idCliente,
          unidade: r.unidade,
          modelo_toner: r.modeloToner,
          peso_retornado: r.pesoRetornado,
          gramatura_restante: r.gramaturaRestante,
          porcentagem_restante: r.porcentagemRestante,
          destino_final: r.destinoFinal,
          data_registro: r.dataRegistro,
          valor_resgatado: r.valorResgatado
        })));

      if (error) throw error;

      set((state) => ({ 
        retornados: [...state.retornados, ...novosRetornados]
      }));
    } catch (error) {
      console.error('Error adding retornados:', error);
      throw error;
    }
  },

  addToner: async (toner) => {
    try {
      const { data, error } = await supabase
        .from('toners')
        .insert({
          modelo: toner.modelo,
          peso_cheio: toner.pesoCheio,
          peso_vazio: toner.pesoVazio,
          impressoras_compativeis: toner.impressorasCompativeis,
          cor: toner.cor,
          area_impressa_iso: toner.areaImpressaISO,
          capacidade_folhas: toner.capacidadeFolhas,
          tipo: toner.tipo,
          preco_compra: toner.precoCompra,
          preco_folha: toner.precoFolha,
          gramatura: toner.gramatura
        })
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ 
        toners: [...state.toners, data as Toner]
      }));
    } catch (error) {
      console.error('Error adding toner:', error);
      throw error;
    }
  },

  updateToner: async (id, toner) => {
    try {
      const { error } = await supabase
        .from('toners')
        .update({
          modelo: toner.modelo,
          peso_cheio: toner.pesoCheio,
          peso_vazio: toner.pesoVazio,
          impressoras_compativeis: toner.impressorasCompativeis,
          cor: toner.cor,
          area_impressa_iso: toner.areaImpressaISO,
          capacidade_folhas: toner.capacidadeFolhas,
          tipo: toner.tipo,
          preco_compra: toner.precoCompra,
          preco_folha: toner.precoFolha,
          gramatura: toner.gramatura,
          updated_at: new Date()
        })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        toners: state.toners.map((t) => t.id === id ? { ...t, ...toner } : t)
      }));
    } catch (error) {
      console.error('Error updating toner:', error);
      throw error;
    }
  },

  deleteToner: async (id) => {
    try {
      const { error } = await supabase
        .from('toners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        toners: state.toners.filter((t) => t.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting toner:', error);
      throw error;
    }
  },
  
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
  },

  fetchToners: async () => {
    try {
      const { data, error } = await supabase
        .from('toners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ toners: data as Toner[] });
    } catch (error) {
      console.error('Error fetching toners:', error);
      throw error;
    }
  },

  fetchRetornados: async () => {
    try {
      const { data, error } = await supabase
        .from('retornados')
        .select('*')
        .order('data_registro', { ascending: false });

      if (error) throw error;

      const retornados = data.map(r => ({
        id: r.id,
        idCliente: r.id_cliente,
        unidade: r.unidade,
        modeloToner: r.modelo_toner,
        pesoRetornado: r.peso_retornado,
        gramaturaRestante: r.gramatura_restante,
        porcentagemRestante: r.porcentagem_restante,
        destinoFinal: r.destino_final,
        dataRegistro: new Date(r.data_registro),
        valorResgatado: r.valor_resgatado
      }));

      set({ retornados });
    } catch (error) {
      console.error('Error fetching retornados:', error);
      throw error;
    }
  }
}));