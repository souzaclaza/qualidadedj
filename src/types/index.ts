// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions?: string[];
}

export interface AuthState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  users: User[];
}

// Toner Types
export interface Toner {
  id: string;
  modelo: string;
  pesoCheio: number;
  pesoVazio: number;
  impressorasCompativeis: string[];
  cor: 'black' | 'cyan' | 'magenta' | 'yellow';
  areaImpressaISO: string;
  capacidadeFolhas: number;
  tipo: 'original' | 'compatível' | 'remanufaturado';
  precoCompra: number;
  precoFolha: number;
  gramatura: number;
}

export interface TonerRetornado {
  id: string;
  idCliente: string;
  unidade: string;
  modeloToner: string;
  pesoRetornado: number;
  gramaturaRestante: number;
  porcentagemRestante: number;
  destinoFinal: 'estoque' | 'uso-interno' | 'descarte' | 'garantia';
  dataRegistro: Date;
  valorResgatado: number;
}

export interface FiltrosConsulta {
  dataInicio?: Date;
  dataFim?: Date;
  filial?: string;
  idCliente?: string;
  modelo?: string;
  destinoFinal?: string;
}

// Garantia Types
export interface Fornecedor {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  linkGarantia: string;
}

export interface ItemGarantia {
  modeloToner: string;
  quantidade: number;
  valorUnitario: number;
}

export interface Garantia {
  id: string;
  solicitante: string;
  itens: ItemGarantia[];
  dataSolicitacao: Date;
  numeroSerie: string;
  nfCompra: {
    numero: string;
    arquivo: string;
  };
  nfRemessaSim
  ples: {
    numero: string;
    arquivo: string;
  };
  nfDevolucao: {
    numero: string;
    arquivo: string;
  };
  dataDespacho: string;
  numeroTicket: string;
  observacao: string;
  status: 'em-aberto' | 'em-tratativa' | 'credito' | 'conserto' | 'troca' | 'devolucao';
  observacaoFinal: string;
  valorTotal: number;
}

// Document Types
export interface PopIt {
  id: string;
  titulo: string;
  descricao?: string;
  setor: string;
  versaoAtual: number;
  dataEnvio: Date;
}

export interface PopItArquivo {
  id: string;
  popItId: string;
  versao: number;
  nomeArquivo: string;
  dataUpload: Date;
  url: string;
}

export interface BPMN {
  id: string;
  titulo: string;
  descricao?: string;
  setor: string;
  versaoAtual: number;
  dataEnvio: Date;
}

export interface BPMNArquivo {
  id: string;
  bpmnId: string;
  versao: number;
  nomeArquivo: string;
  dataUpload: Date;
  url: string;
}

// Config Types
export interface DadosEmpresa {
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  logo: string;
}

// NC Types
export interface NC {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  dataOcorrencia: Date;
  identificadoPor: string;
  areaSetor: string;
  classificacao: 'produto' | 'processo' | 'servico' | 'sistema' | 'cliente' | 'fornecedor';
  tipo: 'conforme' | 'nao-conforme' | 'observacao';
  gravidade: 'leve' | 'media' | 'critica';
  status: 'registro' | 'analise' | 'plano-acao' | 'verificacao' | 'encerrado';
  dataAtualizacao: Date;
}

export interface NCAnalise {
  id: string;
  ncId: string;
  porques: string[];
  responsavel: string;
  dataAnalise: Date;
}

export interface NCAcao {
  id: string;
  ncId: string;
  descricao: string;
  responsavel: string;
  dataLimite: Date;
  recursos: string;
  status: 'pendente' | 'em-andamento' | 'concluida';
  evidencia: string;
}

export interface NCVerificacao {
  id: string;
  ncId: string;
  dataVerificacao: Date;
  responsavel: string;
  resolvido: boolean;
  observacoes: string;
  statusFinal: 'encerrado' | 'reaberto';
}

// Auditoria Types
export interface ItemAuditavel {
  id: string;
  descricao: string;
  tipo: 'conforme' | 'percentual';
  observacao?: string;
}

export interface FormularioAuditoria {
  id: string;
  titulo: string;
  processoArea: string;
  itens: ItemAuditavel[];
  linkEvidencias?: string;
  observacoesGap?: string;
  observacoesMelhoria?: string;
  responsavelSetor?: string;
}

export interface RespostaAuditoria {
  itemId: string;
  conforme?: boolean;
  percentual?: number;
  observacao?: string;
}

export interface Auditoria {
  id: string;
  formularioId: string;
  auditor: string;
  unidade: string;
  dataInicio: Date;
  dataFim: Date;
  respostas: RespostaAuditoria[];
}

// Pareto Types
export interface CategoriaPareto {
  nome: string;
  quantidade: number;
  percentual: number;
}

export interface AcaoPareto {
  categoria: string;
  acao: string;
  responsavel: string;
  prazo: Date;
  status: 'pendente' | 'em-andamento' | 'concluida';
}

export interface ParetoAnalise {
  id: string;
  titulo: string;
  responsavel: string;
  setor: string;
  dataAnalise: Date;
  categorias: CategoriaPareto[];
  acoes: AcaoPareto[];
  observacoes?: string;
}

// Ishikawa Types
export interface CausaIshikawa {
  id: string;
  categoria: string;
  descricao: string;
}

export interface AcaoIshikawa {
  causa: string;
  acao: string;
  responsavel: string;
  prazo: Date;
  status: 'pendente' | 'em-andamento' | 'concluida';
}

export interface IshikawaAnalise {
  id: string;
  titulo: string;
  problema: string;
  responsavel: string;
  setor: string;
  dataAnalise: Date;
  causas: CausaIshikawa[];
  acoes: AcaoIshikawa[];
  observacoes?: string;
}