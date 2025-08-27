import { Platform, StyleSheet } from "react-native"
import constants from "../../constants/constants"

const styles = StyleSheet.create({
   viewContainer: { backgroundColor: "transparent", borderBottomWidth: 1, borderColor: constants.lightGrayColor },
   viewSubContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingRight: 10 },
   pressedTab: { flexGrow: 0, flexDirection: 'row', padding: 15, paddingVertical: 15, alignItems: "center", justifyContent: "center", backgroundColor: constants.colorPrimary, marginRight: 10 },
   nonPressedTab: { flexGrow: 0, flexDirection: 'row', padding: 10, alignItems: "center", justifyContent: "center", backgroundColor: constants.lightGrayColor, marginRight: 10 },
   selectedTextStyle: { fontSize: 14, textAlign: "center", color: constants.colorWhite, fontWeight: "700", minWidth: 100 },
   nonSelectedTextStyle: { fontSize: 14, textAlign: "center", color: constants.darkGrayColor, fontWeight: "700", minWidth: 100 },
})

export default styles
