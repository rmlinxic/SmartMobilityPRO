import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Switch } from 'react-native';
import MapView, { Marker, Polyline, Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import { supabase } from '../../../services/supabase';
import styles from './SmartRouting.style';
import { COLORS } from '../../../constants';

// Seed mock historical data for Joi/SC region (fallback if Supabase is empty)
const SEED_HEATMAP_POINTS = [
  // Noise hotspots (Avenida Beira Rio area)
  { latitude: -26.3015, longitude: -48.8442, weight: 85, metric: 'sound_db' },
  { latitude: -26.3025, longitude: -48.8432, weight: 90, metric: 'sound_db' },
  { latitude: -26.3035, longitude: -48.8422, weight: 78, metric: 'sound_db' },
  // CO hotspots
  { latitude: -26.3012, longitude: -48.8440, weight: 450, metric: 'carbon_ppm' },
  { latitude: -26.3020, longitude: -48.8430, weight: 520, metric: 'carbon_ppm' },
  // Safe / low overtaking distance areas (Dangerous zones)
  { latitude: -26.3050, longitude: -48.8460, weight: 20, metric: 'overtaking_dist_cm' }, // 20cm (very close!)
  { latitude: -26.3060, longitude: -48.8470, weight: 35, metric: 'overtaking_dist_cm' },
  // High temperature areas
  { latitude: -26.3030, longitude: -48.8450, weight: 32, metric: 'temperature' },
  { latitude: -26.3040, longitude: -48.8465, weight: 33, metric: 'temperature' },
];

export default function SmartRouting() {
  const [loading, setLoading] = useState(false);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: -26.3015,
    longitude: -48.8442,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [startPoint, setStartPoint] = useState('Minha Localização');
  const [endPoint, setEndPoint] = useState('Parque Boa Vista');
  const [selectedMetric, setSelectedMetric] = useState('sound_db'); // sound_db, carbon_ppm, overtaking_dist_cm, temperature
  const [dbReadings, setDbReadings] = useState([]);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [showRoutes, setShowRoutes] = useState(false);
  
  // Safe routing parameters
  const [routes, setRoutes] = useState([]);

  // Load current user position
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      const userRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };
      setCurrentRegion(userRegion);
    })();
  }, []);

  // Fetch readings from Supabase and merge with fallback seeds
  const loadHeatmapData = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('latitude, longitude, temperature, humidity, carbon_ppm, sound_db, overtaking_dist_cm');

      if (error) throw error;

      const supabasePoints = (data || []).map((row) => ({
        latitude: row.latitude,
        longitude: row.longitude,
        // weight is determined by selected metric value
        weight: row[selectedMetric] || 0,
        metric: selectedMetric,
      }));

      // Combine Supabase data with fallback seed data
      const localSeeds = SEED_HEATMAP_POINTS.filter((p) => p.metric === selectedMetric);
      
      // Map weights to standard ranges based on selected metric
      const combined = [...supabasePoints, ...localSeeds].map((pt) => {
        let normalizedWeight = 1;
        if (selectedMetric === 'sound_db') {
          // sound: 0 to 120 dB
          normalizedWeight = Math.max(1, Math.min(100, (pt.weight / 120) * 100));
        } else if (selectedMetric === 'carbon_ppm') {
          // CO: 0 to 1000 ppm
          normalizedWeight = Math.max(1, Math.min(100, (pt.weight / 1000) * 100));
        } else if (selectedMetric === 'overtaking_dist_cm') {
          // Overtaking: lower distance is higher weight (risk) on heatmap!
          // We invert it so closer overtakes (higher risk) show hotter!
          normalizedWeight = Math.max(1, Math.min(100, 100 - (pt.weight / 200) * 100));
        } else {
          // Temperature: 0 to 45 °C
          normalizedWeight = Math.max(1, Math.min(100, (pt.weight / 45) * 100));
        }

        return {
          latitude: pt.latitude,
          longitude: pt.longitude,
          weight: Math.round(normalizedWeight),
        };
      });

      setHeatmapPoints(combined);
    } catch (err) {
      console.warn('Erro ao carregar dados do Supabase:', err.message);
      // Fallback only to seed points on error
      const filteredSeeds = SEED_HEATMAP_POINTS.filter((p) => p.metric === selectedMetric).map((pt) => {
        let weight = pt.weight;
        if (selectedMetric === 'overtaking_dist_cm') {
          weight = 100 - (pt.weight / 200) * 100;
        }
        return {
          latitude: pt.latitude,
          longitude: pt.longitude,
          weight: Math.max(1, Math.round(weight)),
        };
      });
      setHeatmapPoints(filteredSeeds);
    }
  };

  useEffect(() => {
    loadHeatmapData();
  }, [selectedMetric]);

  const handleRouteCalculation = () => {
    if (!endPoint) {
      Alert.alert('Erro', 'Por favor, insira um destino.');
      return;
    }
    setLoading(true);

    // Mock two routes in Joinville, SC near Beira Rio area
    const startLat = currentRegion.latitude;
    const startLng = currentRegion.longitude;

    // Route 1 (Main Road - fast but high noise/pollution)
    const route1 = [
      { latitude: startLat, longitude: startLng },
      { latitude: startLat + 0.003, longitude: startLng + 0.002 },
      { latitude: startLat + 0.007, longitude: startLng + 0.004 },
      { latitude: startLat + 0.010, longitude: startLng + 0.005 },
    ];

    // Route 2 (Alternative Safe Way - secondary streets, low noise)
    const route2 = [
      { latitude: startLat, longitude: startLng },
      { latitude: startLat + 0.001, longitude: startLng - 0.003 },
      { latitude: startLat + 0.005, longitude: startLng - 0.002 },
      { latitude: startLat + 0.009, longitude: startLng + 0.001 },
      { latitude: startLat + 0.010, longitude: startLng + 0.005 },
    ];

    setRoutes([
      {
        id: 'route_main',
        name: 'Via Principal (Av. Beira Rio)',
        path: route1,
        color: '#ff3d00',
        score: 42,
        avgNoise: '82 dB',
        avgCO: '480 ppm',
        minOvertake: '45 cm',
      },
      {
        id: 'route_safe',
        name: 'Rota Segura (Ciclovia Secundária)',
        path: route2,
        color: '#00e676',
        score: 95,
        avgNoise: '52 dB',
        avgCO: '120 ppm',
        minOvertake: '155 cm',
      },
    ]);

    setTimeout(() => {
      setLoading(false);
      setShowRoutes(true);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Upper Panel: Routing Inputs */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ponto de partida"
          value={startPoint}
          onChangeText={setStartPoint}
        />
        <TextInput
          style={styles.input}
          placeholder="Destino"
          value={endPoint}
          onChangeText={setEndPoint}
        />
        <TouchableOpacity style={styles.routeButton} onPress={handleRouteCalculation}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.routeButtonText}>Traçar Rota Inteligente</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={currentRegion}
        showsUserLocation
      >
        {/* Heatmap Layer */}
        {heatmapPoints.length > 0 && (
          <Heatmap
            points={heatmapPoints}
            radius={40}
            opacity={0.7}
            gradient={{
              colors: ['#00f', '#0f0', '#f00'],
              startPoints: [0.01, 0.25, 0.85],
              colorMapSize: 256,
            }}
          />
        )}

        {/* Recommended Path Markers */}
        {showRoutes && routes.length > 0 && (
          <>
            <Marker coordinate={routes[0].path[0]} title="Partida" pinColor="blue" />
            <Marker coordinate={routes[0].path[routes[0].path.length - 1]} title="Destino" pinColor="red" />

            {routes.map((rt) => (
              <Polyline
                key={rt.id}
                coordinates={rt.path}
                strokeColor={rt.color}
                strokeWidth={5}
              />
            ))}
          </>
        )}
      </MapView>

      {/* Bottom Floating Selector: Metrics selection for Heatmap */}
      <View style={styles.metricSelector}>
        {[
          { key: 'sound_db', label: 'Poluição Sonora' },
          { key: 'carbon_ppm', label: 'Monóxido CO' },
          { key: 'overtaking_dist_cm', label: 'Risco Ultrap.' },
          { key: 'temperature', label: 'Temperatura' },
        ].map((m) => (
          <TouchableOpacity
            key={m.key}
            style={[styles.metricTab, selectedMetric === m.key && styles.activeMetricTab]}
            onPress={() => setSelectedMetric(m.key)}
          >
            <Text style={[styles.metricText, selectedMetric === m.key && styles.activeMetricText]}>
              {m.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lower Panel: Safe Route Details & Score Card */}
      {showRoutes && routes.length > 0 && (
        <View style={styles.routeDetailsCard}>
          <Text style={styles.cardTitle}>Comparativo de Rotas Inteligentes</Text>

          {routes.map((rt) => (
            <View key={rt.id} style={{ marginVertical: 6, borderBottomWidth: 0.5, borderBottomColor: '#eee', paddingBottom: 6 }}>
              <View style={styles.routeScoreRow}>
                <Text style={[styles.routeLabel, { fontFamily: 'Outfit-Bold', color: COLORS.primary }]}>
                  {rt.name}
                </Text>
                <Text style={[styles.routeScore, rt.score < 50 && styles.badScore]}>
                  {rt.score}/100 Pts
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: COLORS.gray }}>
                Ruído Médio: {rt.avgNoise}  |  Poluição CO: {rt.avgCO}  |  Ultrapassagem Mín: {rt.minOvertake}
              </Text>
            </View>
          ))}

          <TouchableOpacity style={styles.closeButton} onPress={() => setShowRoutes(false)}>
            <Text style={styles.closeButtonText}>Fechar Comparativo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
