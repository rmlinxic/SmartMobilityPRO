import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import BikeComponent from './BikeComponent';
import styles from "./welcome.style";
import { SIZES, COLORS, FONT } from "../../../constants";
import GoogleMapsAPI from './GoogleMapsAPI';

const mobilityTypes = ["de Bike"];

const Welcome = () => {
  const navigation = useNavigation();
  const [activeMobilityType, setActiveMobilityType] = useState("de Bike");

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.userName}>Olá Ciclista</Text>
        <Text style={styles.welcomeMessage}> Hoje vamos de? </Text>
      </View>

      <View style={styles.tabsContainer}>
        <FlatList
          data={mobilityTypes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tab(activeMobilityType, item)}
              onPress={() => {
                setActiveMobilityType(item);
              }}
            >
              <Text style={styles.tabText(activeMobilityType, item)}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={{ columnGap: SIZES.small }}
          horizontal
        />
      </View>
      
      <GoogleMapsAPI />
      
      <View>
        {activeMobilityType === "de Bike" && <BikeComponent />}
      </View>

      {/* Botão de acesso ao Mapa Inteligente / Roteamento Seguro */}
      <Pressable
        style={{
          backgroundColor: COLORS.tertiary,
          paddingVertical: 14,
          borderRadius: SIZES.medium,
          alignItems: 'center',
          marginHorizontal: SIZES.medium,
          marginTop: SIZES.medium,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 4,
        }}
        onPress={() => navigation.navigate('SmartRoutingScreen')}
      >
        <Text style={{ color: '#fff', fontFamily: FONT.bold, fontSize: SIZES.medium }}>
          🗺️ Mapa Inteligente & Rota Segura
        </Text>
      </Pressable>
    </View>
  );
};

export default Welcome;