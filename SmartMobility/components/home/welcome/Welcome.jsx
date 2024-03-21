import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import BikeComponent from './BikeComponent';
import CarComponent from './CarComponent';
import WalkingComponent from './WalkingComponent';
import styles from "./welcome.style";
import { icons, SIZES } from "../../../constants";
import GoogleMapsAPI from './GoogleMapsAPI';
import React from "react";


const jobTypes = ["de Carro", "Andando", "de Bike"];

const Welcome = ({ searchTerm, setSearchTerm, handleClick }) => {
  const router = useRouter();
  const [activeJobType, setActiveJobType] = useState("de Bike");

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.userName}>Olá Ciclista</Text>
        <Text style={styles.welcomeMessage}> Hoje vamos de? </Text>
      </View>

      <View style={styles.tabsContainer}>
        <FlatList
          data={jobTypes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tab(activeJobType, item)}
              onPress={() => {
                setActiveJobType(item);
              }}
            >
              <Text style={styles.tabText(activeJobType, item)}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={{ columnGap: SIZES.small }}
          horizontal
        />
      </View>
     <GoogleMapsAPI/>
      <View>
  {activeJobType === "de Carro" && <CarComponent />}
  {activeJobType === "Andando" && <WalkingComponent />}
  {activeJobType === "de Bike" && <BikeComponent />}
</View>


    </View>
  );
};

export default Welcome;