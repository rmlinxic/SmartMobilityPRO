import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

import styles from "./BikeComponent.style";
import { icons, SIZES } from "../../../constants";

export default function Button(props) {
  const { onPress, title = 'Vamos Começar!' } = props;
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}