import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, FONT } from "../../../constants";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  map: {
    width: '100%',
    height: '100%',
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    top: SIZES.medium,
    left: SIZES.medium,
    right: SIZES.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  input: {
    height: 40,
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    marginBottom: SIZES.small,
    backgroundColor: '#fff',
    fontFamily: FONT.regular,
  },
  routeButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    borderRadius: SIZES.medium,
    alignItems: 'center',
  },
  routeButtonText: {
    color: '#fff',
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
  },
  metricSelector: {
    position: 'absolute',
    bottom: 160,
    left: SIZES.medium,
    right: SIZES.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: SIZES.medium,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
    elevation: 3,
    zIndex: 9,
  },
  metricTab: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  activeMetricTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  metricText: {
    fontSize: 10,
    fontFamily: FONT.bold,
    color: COLORS.gray,
  },
  activeMetricText: {
    color: '#fff',
  },
  routeDetailsCard: {
    position: 'absolute',
    bottom: SIZES.medium,
    left: SIZES.medium,
    right: SIZES.medium,
    backgroundColor: 'white',
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 10,
  },
  cardTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  routeScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  routeLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  routeScore: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: '#2e7d32',
  },
  badScore: {
    color: '#d32f2f',
  },
  closeButton: {
    marginTop: SIZES.small,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: SIZES.small,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontFamily: FONT.bold,
  },
});

export default styles;
