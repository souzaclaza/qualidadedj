import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useTonerStore } from './tonerStore';
import { useGarantiaStore } from './garantiaStore';
import { usePopItStore } from './popItStore';
import { useBPMNStore } from './bpmnStore';
import { useIshikawaStore } from './ishikawaStore';
import { useParetoStore } from './paretoStore';
import { useNCStore } from './ncStore';

interface DemoStore {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  loadDemoData: () => void;
  clearDemoData: () => void;
}

export const useDemoStore = create(
  persist<DemoStore>(
    (set, get) => ({
      isDemoMode: false,
      toggleDemoMode: () => {
        const newMode = !get().isDemoMode;
        set({ isDemoMode: newMode });
        if (newMode) {
          get().loadDemoData();
        } else {
          get().clearDemoData();
        }
      },
      loadDemoData: () => {
        // Load demo data for each store
        const tonerStore = useTonerStore.getState();
        const garantiaStore = useGarantiaStore.getState();
        const popItStore = usePopItStore.getState();
        const bpmnStore = useBPMNStore.getState();
        const ishikawaStore = useIshikawaStore.getState();
        const paretoStore = useParetoStore.getState();
        const ncStore = useNCStore.getState();

        // Add demo data for each store...
        // This is just an example, you would add your actual demo data here
        tonerStore.addToner({
          id: 'demo-1',
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
        });

        // Add more demo data...
      },
      clearDemoData: () => {
        // Clear all stores
        const tonerStore = useTonerStore.getState();
        const garantiaStore = useGarantiaStore.getState();
        const popItStore = usePopItStore.getState();
        const bpmnStore = useBPMNStore.getState();
        const ishikawaStore = useIshikawaStore.getState();
        const paretoStore = useParetoStore.getState();
        const ncStore = useNCStore.getState();

        // Reset each store to empty state
        tonerStore.setToners([]);
        // Reset other stores...
      }
    }),
    {
      name: 'demo-storage'
    }
  )
);