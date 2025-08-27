import { StyleSheet } from 'react-native';
import constants from '../../constants/constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.screenBackgroundWhite,
    },
    contentContainerStyle: {
        flexGrow: 1
    },
    imageStyle: {
        width: '100%',
        height: '40%',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        height: "40%"
    },
    logImageStyle: {
        width: 204,
        height: 92,
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: constants.screenBackgroundWhite,
        marginTop: -28,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        elevation: 3,
        // borderWidth: 1,
        borderColor: constants.screenBackgroundWhite
    },
    heading: {
        fontSize: 22,
        fontFamily: constants.fontMedium,
        color: constants.defaultTextBlack,
        textAlign: 'left',
        lineHeight: 27,
        marginBottom: 4
    },
    forgotContainer: {
        alignSelf: 'flex-end',
        marginTop: 10
    },
    forgotText: {
        fontSize: 14,
        fontFamily: constants.fontMedium,
        color: constants.forgotText,
        textAlign: 'right',
        lineHeight: 17.07,
        textDecorationLine: 'underline'
    },
    inputStyle: {
        height: 53,
        fontSize: 14,
        fontFamily: constants.fontMedium,
        color: constants.defaultTextBlack,
        textAlign: 'left',
        borderWidth: 1,
        borderColor: constants.lightGrayBorder,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 20
    },
    loginButton: {
        height: 53,
        borderRadius: 5,
        backgroundColor: constants.loginButton,
        justifyContent: 'center',
        marginTop: 23
    },
    loginText: {
        fontSize: 16,
        fontFamily: constants.fontMedium,
        color: constants.textWhite,
        lineHeight: 19.5,
        textAlign:'center'
    },
})

export default styles;