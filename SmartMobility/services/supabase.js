import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'AVISO: Variáveis de ambiente EXPO_PUBLIC_SUPABASE_URL ou EXPO_PUBLIC_SUPABASE_ANON_KEY não estão definidas.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Insere uma nova leitura de sensores no banco de dados Supabase com PostGIS.
 * @param {Object} reading - Objeto contendo os dados da leitura.
 * @param {string} reading.deviceId - Identificador do dispositivo IoT/Celular.
 * @param {number} reading.latitude - Coordenada de latitude GPS.
 * @param {number} reading.longitude - Coordenada de longitude GPS.
 * @param {number} reading.temperature - Temperatura medida (°C).
 * @param {number} reading.humidity - Umidade relativa do ar (%).
 * @param {number} reading.coPpm - Concentração de CO em ppm.
 * @param {number} reading.soundDb - Nível de ruído em decibéis.
 * @param {number} reading.overtakingDist - Distância lateral de ultrapassagem (cm).
 */
export const insertSensorReading = async (reading) => {
  try {
    const {
      deviceId,
      latitude,
      longitude,
      temperature,
      humidity,
      coPpm,
      soundDb,
      overtakingDist,
    } = reading;

    // WKT (Well-Known Text) formato para Point(longitude latitude) no PostGIS
    const pointWKT = `POINT(${longitude} ${latitude})`;

    const { data, error } = await supabase
      .from('sensor_readings')
      .insert([
        {
          device_id: deviceId,
          geom: pointWKT,
          latitude,
          longitude,
          temperature,
          humidity,
          carbon_ppm: coPpm,
          sound_db: soundDb,
          overtaking_dist_cm: overtakingDist,
          timestamp: new Date().toISOString(),
        },
      ]);

    if (error) {
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Erro ao salvar leitura no Supabase:', err.message);
    throw err;
  }
};
