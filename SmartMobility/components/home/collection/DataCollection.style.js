import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONT } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  headerInfo: {
    padding: SIZES.medium,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  statusTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  deviceStatus: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginTop: 4,
  },
  activeText: {
    color: '#2e7d32',
    fontFamily: FONT.bold,
  },
  noiseStatus: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginTop: 2,
  },
  noiseText: {
    color: '#0288d1',
    fontFamily: FONT.bold,
  },
  errorText: {
    color: '#d32f2f',
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    marginTop: 4,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  colTitle: {
    justifyContent: 'center',
  },
  tableRow: {
    borderBottomColor: '#f0f0f0',
  },
  cellText: {
    justifyContent: 'center',
  },
  noDataContainer: {
    padding: SIZES.xLarge,
    alignItems: 'center',
  },
  noDataText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
});

export default styles;
