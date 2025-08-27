import { StyleSheet, Dimensions } from 'react-native';
import constants from '../../constants/constants';

const styles = StyleSheet.create({
  filterButtonContainer: {
    flex: 1,
    position: 'absolute',
    alignItems: "center",
    bottom: 35,
    zIndex: 1,
    alignSelf: "flex-end",
    right: 15,
    justifyContent: 'center',
  },
  touchableButtonStyle: { alignItems: "center", padding: 10, backgroundColor: constants.colorPrimary, justifyContent: 'center', borderRadius: 50 },
  listContainer: {
    padding: 10,
    borderColor: constants.colorPrimary,
    borderWidth: 1,
    borderRadius: 8,
    margin: 2,
  },
  listRowStyle: { flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', paddingVertical: 4 },
  textStyle: { fontSize: 14, color: constants.blackText },
  viewContainer: { flex: 1, margin: 15 },
  panelButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  panel: {
    padding: 10,
  },
  panelButton: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: constants.colorPrimary,
    alignItems: 'center',
    marginVertical: 7,
  },
});

export default styles;
