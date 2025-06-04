/*
  # Schema for Audit Management System

  1. New Tables
    - `formularios_auditoria`: Stores audit forms
    - `itens_auditaveis`: Stores auditable items
    - `auditorias`: Stores audits
    - `respostas_auditoria`: Stores audit responses

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Audit Forms tables
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

CREATE TABLE IF NOT EXISTS itens_auditaveis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formulario_id uuid REFERENCES formularios_auditoria(id) ON DELETE CASCADE,
  descricao text NOT NULL,
  tipo text NOT NULL,
  observacao text,
  created_at timestamptz DEFAULT now()
);

-- Audits tables
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

CREATE TABLE IF NOT EXISTS respostas_auditoria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auditoria_id uuid REFERENCES auditorias(id) ON DELETE CASCADE,
  item_id uuid REFERENCES itens_auditaveis(id) ON DELETE CASCADE,
  conforme boolean,
  percentual decimal,
  observacao text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE formularios_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_auditaveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE respostas_auditoria ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read for authenticated users" ON formularios_auditoria
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON itens_auditaveis
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON auditorias
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON respostas_auditoria
  FOR SELECT TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_itens_auditaveis_formulario ON itens_auditaveis(formulario_id);
CREATE INDEX idx_auditorias_formulario ON auditorias(formulario_id);
CREATE INDEX idx_respostas_auditoria ON respostas_auditoria(auditoria_id);
CREATE INDEX idx_respostas_item ON respostas_auditoria(item_id);