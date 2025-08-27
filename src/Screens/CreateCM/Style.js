import { StyleSheet } from 'react-native';
import constants from '../../constants/constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.screenBackgroundWhite,
    },
    contentContainerStyle: {
        flexGrow: 1,
        padding: 20
    },
    heading: {
        fontSize: 22,
        fontFamily: constants.fontMedium,
        color: constants.defaultTextBlack,
        textAlign: 'left',
        lineHeight: 27,
        marginBottom: 4
    },
    // Old style
    flex: {
        flex: 1
    },
    Container: {
        flex: 1,
        marginHorizontal: 10,
        justifyContent: 'center'
    },
    SubView: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    Text: {
        fontSize: 22,
        fontFamily: constants.fontSemiBold,
        color: constants.colorPrimary,
        textAlign: 'left',
        lineHeight: 28,
    },
    DropDownPicker: {
        backgroundColor: constants.colorWhite,
        borderWidth: 1,
        borderColor: constants.defaultTextBlack,
        width: "100%",
        zIndex: 100,
    },
    TextInput: {
        fontFamily: constants.fontRegular,
        backgroundColor: constants.colorWhite,
        borderWidth: 1,
        borderColor: constants.defaultTextBlack,
        width: "100%",
        borderRadius: 5,
        paddingHorizontal: 8
    },
    panelButtonTitle: {
        fontSize: 16,
        fontFamily: constants.fontSemiBold,
        color: constants.textWhite,
        lineHeight: 19.5,
        textAlign: 'center'
    },
    panelButton: {
        padding: 14,
        borderRadius: 8,
        backgroundColor: constants.colorPrimary,
        alignItems: 'center',
        marginVertical: 10
    },
    ViewStyle: {
        marginVertical: 10,
    },
    loader: {
        flexGrow: 0,
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'relative'
    }
})

export default styles;