/*
  # Create tables for forms data

  1. New Tables
    - toners
    - retornados
    - garantias
    - garantia_itens
    - fornecedores
    - pop_its
    - pop_it_arquivos
    - bpmns
    - bpmn_arquivos
    - ncs
    - nc_analises
    - nc_acoes
    - nc_verificacoes
    - ishikawa_analises
    - ishikawa_causas
    - pareto_analises
    - pareto_causas
    - auditorias
    - formularios_auditoria
    - itens_auditaveis
    - respostas_auditoria

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Toners table
CREATE TABLE IF NOT EXISTS toners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modelo text NOT NULL,
  peso_cheio numeric NOT NULL,
  peso_vazio numeric NOT NULL,
  impressoras_compativeis text[] NOT NULL,
  cor text NOT NULL,
  area_impressa_iso text NOT NULL,
  capacidade_folhas integer NOT NULL,
  tipo text NOT NULL,
  preco_compra numeric NOT NULL,
  preco_folha numeric NOT NULL,
  gramatura numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE toners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON toners
  FOR SELECT
  TO authenticated
  USING (true);

-- Retornados table
CREATE TABLE IF NOT EXISTS retornados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_cliente text NOT NULL,
  unidade text NOT NULL,
  modelo_toner text NOT NULL,
  peso_retornado numeric NOT NULL,
  gramatura_restante numeric NOT NULL,
  porcentagem_restante numeric NOT NULL,
  destino_final text NOT NULL,
  data_registro timestamptz NOT NULL,
  valor_resgatado numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE retornados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON retornados
  FOR SELECT
  TO authenticated
  USING (true);

-- Garantias table
CREATE TABLE IF NOT EXISTS garantias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitante text NOT NULL,
  data_solicitacao timestamptz NOT NULL,
  numero_serie text NOT NULL,
  nf_compra_numero text,
  nf_compra_arquivo text,
  nf_remessa_numero text,
  nf_remessa_arquivo text,
  nf_devolucao_numero text,
  nf_devolucao_arquivo text,
  data_despacho date,
  numero_ticket text,
  observacao text,
  status text NOT NULL,
  observacao_final text,
  valor_total numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE garantias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON garantias
  FOR SELECT
  TO authenticated
  USING (true);

-- Garantia Itens table
CREATE TABLE IF NOT EXISTS garantia_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  garantia_id uuid REFERENCES garantias(id) ON DELETE CASCADE,
  modelo_toner text NOT NULL,
  quantidade integer NOT NULL,
  valor_unitario numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE garantia_itens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON garantia_itens
  FOR SELECT
  TO authenticated
  USING (true);

-- Fornecedores table
CREATE TABLE IF NOT EXISTS fornecedores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text,
  email text,
  link_garantia text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON fornecedores
  FOR SELECT
  TO authenticated
  USING (true);

-- POP/IT tables
CREATE TABLE IF NOT EXISTS pop_its (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  setor text NOT NULL,
  versao_atual integer DEFAULT 0 NOT NULL,
  data_envio timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pop_its ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON pop_its
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS pop_it_arquivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pop_it_id uuid REFERENCES pop_its(id) ON DELETE CASCADE,
  versao integer NOT NULL,
  nome_arquivo text NOT NULL,
  data_upload timestamptz NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pop_it_arquivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON pop_it_arquivos
  FOR SELECT
  TO authenticated
  USING (true);

-- BPMN tables
CREATE TABLE IF NOT EXISTS bpmns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  setor text NOT NULL,
  versao_atual integer DEFAULT 0 NOT NULL,
  data_envio timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bpmns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON bpmns
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS bpmn_arquivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bpmn_id uuid REFERENCES bpmns(id) ON DELETE CASCADE,
  versao integer NOT NULL,
  nome_arquivo text NOT NULL,
  data_upload timestamptz NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bpmn_arquivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON bpmn_arquivos
  FOR SELECT
  TO authenticated
  USING (true);

-- NC tables
CREATE TABLE IF NOT EXISTS ncs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  titulo text NOT NULL,
  descricao text NOT NULL,
  data_ocorrencia timestamptz NOT NULL,
  identificado_por text NOT NULL,
  area_setor text NOT NULL,
  classificacao text NOT NULL,
  tipo text NOT NULL,
  gravidade text NOT NULL,
  status text NOT NULL,
  data_atualizacao timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ncs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON ncs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS nc_analises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nc_id uuid REFERENCES ncs(id) ON DELETE CASCADE,
  porques text[] NOT NULL,
  responsavel text NOT NULL,
  data_analise timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nc_analises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON nc_analises
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS nc_acoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nc_id uuid REFERENCES ncs(id) ON DELETE CASCADE,
  descricao text NOT NULL,
  responsavel text NOT NULL,
  data_limite timestamptz NOT NULL,
  recursos text NOT NULL,
  status text NOT NULL,
  evidencia text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nc_acoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON nc_acoes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS nc_verificacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nc_id uuid REFERENCES ncs(id) ON DELETE CASCADE,
  data_verificacao timestamptz NOT NULL,
  responsavel text NOT NULL,
  resolvido boolean NOT NULL,
  observacoes text NOT NULL,
  status_final text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nc_verificacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON nc_verificacoes
  FOR SELECT
  TO authenticated
  USING (true);

-- Ishikawa tables
CREATE TABLE IF NOT EXISTS ishikawa_analises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  setor text NOT NULL,
  responsavel text NOT NULL,
  data date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ishikawa_analises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON ishikawa_analises
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS ishikawa_causas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analise_id uuid REFERENCES ishikawa_analises(id) ON DELETE CASCADE,
  categoria text NOT NULL,
  descricao text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ishikawa_causas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON ishikawa_causas
  FOR SELECT
  TO authenticated
  USING (true);

-- Pareto tables
CREATE TABLE IF NOT EXISTS pareto_analises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  setor text NOT NULL,
  responsavel text NOT NULL,
  data date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pareto_analises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON pareto_analises
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS pareto_causas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analise_id uuid REFERENCES pareto_analises(id) ON DELETE CASCADE,
  descricao text NOT NULL,
  frequencia integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pareto_causas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON pareto_causas
  FOR SELECT
  TO authenticated
  USING (true);

-- Auditoria tables
CREATE TABLE IF NOT EXISTS formularios_auditoria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  processo_area text NOT NULL,
  link_evidencias text,
  observacoes_gap text,
  observacoes_melhoria text,
  responsavel_setor text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE formularios_auditoria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON formularios_auditoria
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS itens_auditaveis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formulario_id uuid REFERENCES formularios_auditoria(id) ON DELETE CASCADE,
  descricao text NOT NULL,
  tipo text NOT NULL,
  observacao text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE itens_auditaveis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON itens_auditaveis
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS auditorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formulario_id uuid REFERENCES formularios_auditoria(id) ON DELETE CASCADE,
  auditor text NOT NULL,
  unidade text NOT NULL,
  data_inicio timestamptz NOT NULL,
  data_fim timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE auditorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON auditorias
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS respostas_auditoria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auditoria_id uuid REFERENCES auditorias(id) ON DELETE CASCADE,
  item_id uuid REFERENCES itens_auditaveis(id) ON DELETE CASCADE,
  conforme boolean,
  percentual numeric,
  observacao text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE respostas_auditoria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON respostas_auditoria
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_toners_modelo ON toners(modelo);
CREATE INDEX IF NOT EXISTS idx_retornados_data ON retornados(data_registro);
CREATE INDEX IF NOT EXISTS idx_retornados_destino ON retornados(destino_final);
CREATE INDEX IF NOT EXISTS idx_garantias_status ON garantias(status);
CREATE INDEX IF NOT EXISTS idx_garantia_itens_garantia ON garantia_itens(garantia_id);
CREATE INDEX IF NOT EXISTS idx_pop_it_arquivos_pop_it ON pop_it_arquivos(pop_it_id);
CREATE INDEX IF NOT EXISTS idx_bpmn_arquivos_bpmn ON bpmn_arquivos(bpmn_id);
CREATE INDEX IF NOT EXISTS idx_nc_analises_nc ON nc_analises(nc_id);
CREATE INDEX IF NOT EXISTS idx_nc_acoes_nc ON nc_acoes(nc_id);
CREATE INDEX IF NOT EXISTS idx_nc_verificacoes_nc ON nc_verificacoes(nc_id);
CREATE INDEX IF NOT EXISTS idx_ishikawa_causas_analise ON ishikawa_causas(analise_id);
CREATE INDEX IF NOT EXISTS idx_pareto_causas_analise ON pareto_causas(analise_id);
CREATE INDEX IF NOT EXISTS idx_itens_auditaveis_formulario ON itens_auditaveis(formulario_id);
CREATE INDEX IF NOT EXISTS idx_respostas_auditoria ON respostas_auditoria(auditoria_id);
CREATE INDEX IF NOT EXISTS idx_respostas_item ON respostas_auditoria(item_id);
CREATE INDEX IF NOT EXISTS idx_ishikawa_analises_data ON ishikawa_analises(data);
CREATE INDEX IF NOT EXISTS idx_ishikawa_analises_setor ON ishikawa_analises(setor);
CREATE INDEX IF NOT EXISTS idx_pareto_analises_data ON pareto_analises(data);
CREATE INDEX IF NOT EXISTS idx_pareto_analises_setor ON pareto_analises(setor);
CREATE INDEX IF NOT EXISTS idx_pop_its_setor ON pop_its(setor);
CREATE INDEX IF NOT EXISTS idx_bpmns_setor ON bpmns(setor);