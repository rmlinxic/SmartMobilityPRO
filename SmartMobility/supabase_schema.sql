-- ============================================================
-- SmartMobilityPRO — Schema SQL para Supabase (PostgreSQL + PostGIS)
-- ============================================================
-- Execute este script no "SQL Editor" do Supabase Console
-- para criar a tabela de leituras de sensores.

-- 1. Ativar extensão PostGIS (necessário para dados geográficos)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Criar tabela principal de leituras
CREATE TABLE IF NOT EXISTS sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),

  -- Geometria PostGIS (ponto geográfico SRID 4326 = WGS84)
  geom GEOMETRY(Point, 4326),

  -- Coordenadas explícitas para queries simples
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,

  -- Dados do sensor IoT B1K3L4B
  temperature FLOAT,          -- Temperatura em °C
  humidity FLOAT,              -- Umidade relativa em %
  carbon_ppm FLOAT,            -- Concentração de CO em ppm
  sound_db FLOAT,              -- Nível de ruído em dB (microfone do celular)
  overtaking_dist_cm FLOAT     -- Distância lateral de ultrapassagem em cm
);

-- 3. Índice espacial para consultas por proximidade geográfica
CREATE INDEX IF NOT EXISTS idx_sensor_readings_geom
  ON sensor_readings USING GIST (geom);

-- 4. Índice temporal para consultas históricas
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp
  ON sensor_readings (timestamp DESC);

-- 5. Índice por dispositivo
CREATE INDEX IF NOT EXISTS idx_sensor_readings_device
  ON sensor_readings (device_id);

-- 6. Habilitar Row Level Security (RLS) — recomendado pelo Supabase
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

-- 7. Política: qualquer usuário autenticado ou anônimo pode inserir
CREATE POLICY "Permitir inserção pública"
  ON sensor_readings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 8. Política: qualquer usuário pode ler (necessário para o mapa de calor)
CREATE POLICY "Permitir leitura pública"
  ON sensor_readings
  FOR SELECT
  TO anon, authenticated
  USING (true);
