/*
  # Schema for Documents Management System

  1. New Tables
    - `pop_its`: Stores POP/IT documents
    - `pop_it_arquivos`: Stores POP/IT files
    - `bpmns`: Stores BPMN documents  
    - `bpmn_arquivos`: Stores BPMN files

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- POP/IT tables
CREATE TABLE IF NOT EXISTS pop_its (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  setor text NOT NULL,
  versao_atual integer NOT NULL DEFAULT 0,
  data_envio timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pop_it_arquivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pop_it_id uuid REFERENCES pop_its(id) ON DELETE CASCADE,
  versao integer NOT NULL,
  nome_arquivo text NOT NULL,
  data_upload timestamptz NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- BPMN tables
CREATE TABLE IF NOT EXISTS bpmns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  setor text NOT NULL,
  versao_atual integer NOT NULL DEFAULT 0,
  data_envio timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bpmn_arquivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bpmn_id uuid REFERENCES bpmns(id) ON DELETE CASCADE,
  versao integer NOT NULL,
  nome_arquivo text NOT NULL,
  data_upload timestamptz NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pop_its ENABLE ROW LEVEL SECURITY;
ALTER TABLE pop_it_arquivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bpmns ENABLE ROW LEVEL SECURITY;
ALTER TABLE bpmn_arquivos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read for authenticated users" ON pop_its
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON pop_it_arquivos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON bpmns
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON bpmn_arquivos
  FOR SELECT TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_pop_its_setor ON pop_its(setor);
CREATE INDEX idx_pop_it_arquivos_pop_it ON pop_it_arquivos(pop_it_id);
CREATE INDEX idx_bpmns_setor ON bpmns(setor);
CREATE INDEX idx_bpmn_arquivos_bpmn ON bpmn_arquivos(bpmn_id);