/*
  # Create tables for Ishikawa and Pareto analysis

  1. New Tables
    - `ishikawa_analises`: Stores basic information about Ishikawa analysis
    - `ishikawa_causas`: Stores causes for each Ishikawa analysis
    - `pareto_analises`: Stores basic information about Pareto analysis
    - `pareto_causas`: Stores causes and frequencies for each Pareto analysis

  2. Indexes
    - Added appropriate indexes for foreign keys and common search fields
*/

-- Ishikawa Analysis Tables
CREATE TABLE IF NOT EXISTS ishikawa_analises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  setor text NOT NULL,
  responsavel text NOT NULL,
  data date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ishikawa_causas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analise_id uuid NOT NULL REFERENCES ishikawa_analises(id) ON DELETE CASCADE,
  categoria text NOT NULL,
  descricao text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ishikawa_analises_data ON ishikawa_analises(data);
CREATE INDEX IF NOT EXISTS idx_ishikawa_analises_setor ON ishikawa_analises(setor);
CREATE INDEX IF NOT EXISTS idx_ishikawa_causas_analise ON ishikawa_causas(analise_id);
CREATE INDEX IF NOT EXISTS idx_ishikawa_causas_categoria ON ishikawa_causas(categoria);

-- Pareto Analysis Tables
CREATE TABLE IF NOT EXISTS pareto_analises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  setor text NOT NULL,
  responsavel text NOT NULL,
  data date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pareto_causas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analise_id uuid NOT NULL REFERENCES pareto_analises(id) ON DELETE CASCADE,
  descricao text NOT NULL,
  frequencia integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pareto_analises_data ON pareto_analises(data);
CREATE INDEX IF NOT EXISTS idx_pareto_analises_setor ON pareto_analises(setor);
CREATE INDEX IF NOT EXISTS idx_pareto_causas_analise ON pareto_causas(analise_id);