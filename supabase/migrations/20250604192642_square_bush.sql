/*
  # Schema for Toners Management System

  1. New Tables
    - `toners`: Stores toner models and specifications
    - `retornados`: Stores returned toners
    - `fornecedores`: Stores supplier information
    - `garantias`: Stores warranty claims
    - `garantia_itens`: Stores warranty items

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Toners table
CREATE TABLE IF NOT EXISTS toners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modelo text NOT NULL,
  peso_cheio decimal NOT NULL,
  peso_vazio decimal NOT NULL,
  impressoras_compativeis text[] NOT NULL,
  cor text NOT NULL,
  area_impressa_iso text NOT NULL,
  capacidade_folhas integer NOT NULL,
  tipo text NOT NULL,
  preco_compra decimal NOT NULL,
  preco_folha decimal NOT NULL,
  gramatura decimal NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Retornados table
CREATE TABLE IF NOT EXISTS retornados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_cliente text NOT NULL,
  unidade text NOT NULL,
  modelo_toner text NOT NULL,
  peso_retornado decimal NOT NULL,
  gramatura_restante decimal NOT NULL,
  porcentagem_restante decimal NOT NULL,
  destino_final text NOT NULL,
  data_registro timestamptz NOT NULL,
  valor_resgatado decimal NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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
  valor_total decimal NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Garantia Items table
CREATE TABLE IF NOT EXISTS garantia_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  garantia_id uuid REFERENCES garantias(id) ON DELETE CASCADE,
  modelo_toner text NOT NULL,
  quantidade integer NOT NULL,
  valor_unitario decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE toners ENABLE ROW LEVEL SECURITY;
ALTER TABLE retornados ENABLE ROW LEVEL SECURITY;
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE garantias ENABLE ROW LEVEL SECURITY;
ALTER TABLE garantia_itens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read for authenticated users" ON toners
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON retornados
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON fornecedores
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON garantias
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON garantia_itens
  FOR SELECT TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_toners_modelo ON toners(modelo);
CREATE INDEX idx_retornados_data ON retornados(data_registro);
CREATE INDEX idx_retornados_destino ON retornados(destino_final);
CREATE INDEX idx_garantias_status ON garantias(status);
CREATE INDEX idx_garantia_itens_garantia ON garantia_itens(garantia_id);