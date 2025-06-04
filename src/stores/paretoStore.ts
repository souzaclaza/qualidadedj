import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CategoriaPareto {
  nome: string;
  quantidade: number;
  percentual: number;
}

interface AcaoPareto {
  categoria: string;
  acao: string;
  responsavel: string;
  prazo: Date;
  status: 'pendente' | 'em-andamento' | 'concluida';
}

interface ParetoAnalise {
  id: string;
  titulo: string;
  responsavel: string;
  setor: string;
  dataAnalise: Date;
  categorias: CategoriaPareto[];
  acoes: AcaoPareto[];
  observacoes?: string;
}

// Mock initial data
const mockAnalises: ParetoAnalise[] = [
  {
    id: '1',
    titulo: 'Análise de Defeitos em Produtos',
    responsavel: 'João Silva',
    setor: 'Qualidade',
    dataAnalise: new Date('2025-05-20'),
    categorias: [
      { nome: 'Falha no processo', quantidade: 45, percentual: 45 },
      { nome: 'Material inadequado', quantidade: 25, percentual: 25 },
      { nome: 'Erro operacional', quantidade: 20, percentual: 20 },
      { nome: 'Calibração incorreta', quantidade: 10, percentual: 10 }
    ],
    acoes: [
      {
        categoria: 'Falha no processo',
        acao: 'Revisar e atualizar procedimentos operacionais',
        responsavel: 'Maria Santos',
        prazo: new Date('2025-06-20'),
        status: 'em-andamento'
      },
      {
        categoria: 'Material inadequado',
        acao: 'Avaliar novos fornecedores',
        responsavel: 'Pedro Costa',
        prazo: new Date('2025-06-15'),
        status: 'pendente'
      }
    ],
    observacoes: 'Necessário priorizar ações nos processos críticos'
  },
  {
    id: '2',
    titulo: 'Análise de Reclamações de Clientes',
    responsavel: 'Maria Santos',
    setor: 'Comercial',
    dataAnalise: new Date('2025-05-15'),
    categorias: [
      { nome: 'Atraso na entrega', quantidade: 35, percentual: 35 },
      { nome: 'Produto danificado', quantidade: 30, percentual: 30 },
      { nome: 'Pedido incorreto', quantidade: 20, percentual: 20 },
      { nome: 'Atendimento', quantidade: 15, percentual: 15 }
    ],
    acoes: [
      {
        categoria: 'Atraso na entrega',
        acao: 'Otimizar rotas de entrega',
        responsavel: 'Carlos Oliveira',
        prazo: new Date('2025-06-10'),
        status: 'concluida'
      },
      {
        categoria: 'Produto danificado',
        acao: 'Melhorar embalagem',
        responsavel: 'Ana Silva',
        prazo: new Date('2025-06-05'),
        status: 'em-andamento'
      }
    ],
    observacoes: 'Foco na melhoria da experiência do cliente'
  }
];

interface ParetoStore {
  analises: ParetoAnalise[];
  setores: string[];
  addAnalise: (analise: ParetoAnalise) => void;
  updateAnalise: (id: string, analise: ParetoAnalise) => void;
  deleteAnalise: (id: string) => void;
  addSetor: (setor: string) => void;
}

export const useParetoStore = create(
  persist<ParetoStore>(
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
      name: 'pareto-storage'
    }
  )
);

export type { ParetoAnalise, CategoriaPareto, AcaoPareto };