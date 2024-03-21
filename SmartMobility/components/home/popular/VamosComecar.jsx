import {
  Text,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

import styles from "./VamosComecar.style";
import { icons, SIZES } from "../../../constants";
import { useNavigation } from '@react-navigation/native';

export default function Button(props) {
  const { onPress, title = 'Começar Coleta' } = props;
  const navigation = useNavigation();

  return (
    <Pressable style={styles.button} 
    onPress={() => navigation.navigate('NearbyJobsScreen')}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}