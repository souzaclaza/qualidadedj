import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IshikawaAnalise {
  id: string;
  titulo: string;
  setor: string;
  responsavel: string;
  data: string;
  causas: Record<string, { categoria: string; descricao: string; }[]>;
}

// Mock initial data
const mockAnalises: IshikawaAnalise[] = [
  {
    id: '1',
    titulo: 'Análise de Defeitos na Linha de Produção',
    setor: 'Produção',
    responsavel: 'João Silva',
    data: '2025-05-20',
    causas: {
      'Método': [
        { categoria: 'Método', descricao: 'Procedimento de setup não padronizado' },
        { categoria: 'Método', descricao: 'Falta de checklist de verificação' }
      ],
      'Máquina': [
        { categoria: 'Máquina', descricao: 'Calibração irregular' },
        { categoria: 'Máquina', descricao: 'Desgaste de componentes' }
      ],
      'Mão de Obra': [
        { categoria: 'Mão de Obra', descricao: 'Treinamento insuficiente' },
        { categoria: 'Mão de Obra', descricao: 'Alta rotatividade' }
      ],
      'Material': [
        { categoria: 'Material', descricao: 'Variação na qualidade' },
        { categoria: 'Material', descricao: 'Armazenamento inadequado' }
      ],
      'Medição': [
        { categoria: 'Medição', descricao: 'Instrumentos descalibrados' },
        { categoria: 'Medição', descricao: 'Falta de controle estatístico' }
      ],
      'Meio Ambiente': [
        { categoria: 'Meio Ambiente', descricao: 'Temperatura irregular' },
        { categoria: 'Meio Ambiente', descricao: 'Umidade excessiva' }
      ]
    }
  },
  {
    id: '2',
    titulo: 'Análise de Atrasos nas Entregas',
    setor: 'Logística',
    responsavel: 'Maria Santos',
    data: '2025-05-15',
    causas: {
      'Método': [
        { categoria: 'Método', descricao: 'Rota não otimizada' },
        { categoria: 'Método', descricao: 'Processo de separação ineficiente' }
      ],
      'Máquina': [
        { categoria: 'Máquina', descricao: 'Veículos com manutenção atrasada' },
        { categoria: 'Máquina', descricao: 'Sistema de rastreamento falho' }
      ],
      'Mão de Obra': [
        { categoria: 'Mão de Obra', descricao: 'Falta de pessoal' },
        { categoria: 'Mão de Obra', descricao: 'Desmotivação da equipe' }
      ],
      'Material': [
        { categoria: 'Material', descricao: 'Embalagens inadequadas' },
        { categoria: 'Material', descricao: 'Falta de equipamentos de movimentação' }
      ],
      'Medição': [
        { categoria: 'Medição', descricao: 'KPIs mal definidos' },
        { categoria: 'Medição', descricao: 'Falta de acompanhamento em tempo real' }
      ],
      'Meio Ambiente': [
        { categoria: 'Meio Ambiente', descricao: 'Condições climáticas adversas' },
        { categoria: 'Meio Ambiente', descricao: 'Trânsito intenso' }
      ]
    }
  }
];

interface IshikawaStore {
  analises: IshikawaAnalise[];
  setores: string[];
  addAnalise: (analise: IshikawaAnalise) => void;
  updateAnalise: (id: string, analise: IshikawaAnalise) => void;
  deleteAnalise: (id: string) => void;
  addSetor: (setor: string) => void;
}

export const useIshikawaStore = create(
  persist<IshikawaStore>(
    (set) => ({
      analises: mockAnalises,
      setores: [
        'Produção',
        'Qualidade',
        'Manutenção',
        'Logística',
        'Administrativo',
        'Comercial',
        'TI',
        'RH',
        'Técnico'
      ],
      addAnalise: (analise) => set((state) => ({ 
        analises: [...state.analises, analise]
      })),
      updateAnalise: (id, analise) => set((state) => ({
        analises: state.analises.map((a) => a.id === id ? analise : a)
      })),
      deleteAnalise: (id) => set((state) => ({
        analises: state.analises.filter((a) => a.id !== id)
      })),
      addSetor: (setor) => set((state) => ({
        setores: [...new Set([...state.setores, setor])]
      }))
    }),
    {
      name: 'ishikawa-storage'
    }
  )
);

export type { IshikawaAnalise };