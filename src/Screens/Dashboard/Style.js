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
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
        gap: 15,
    },
    headerImage: {
        height: 40,
        width: 40,
        borderRadius: 100,
        resizeMode: 'cover',
        backgroundColor: constants.lightGrayColor,
        borderWidth: 2,
        borderRadius: 100
    },
    attendanceButton: {
        height: 52,
        borderRadius: 5,
        backgroundColor: constants.red,
        justifyContent: 'center',
        marginTop: 5
    },
    attendanceText: {
        fontSize: 14,
        fontFamily: constants.fontMedium,
        color: constants.textWhite,
        lineHeight: 17.07,
        textAlign: 'center'
    },
    attendanceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: constants.cardBackground,
        marginTop: 16,
        borderRadius: 10
    },
    attendanceCardSubCOntainerLeft: {
        flex: 1,
        gap: 6
    },
    attendanceCardSubCOntainerRight: {
        flex: 1,
        gap: 6,
        borderLeftWidth: 1,
        paddingLeft: 10,
        borderColor: constants.borderDarkGrayColor
    },
    attendanceTitle: {
        fontFamily: constants.fontMedium,
        fontSize: 14,
        lineHeight: 17.07,
        color: constants.defaultTextBlack,
    }
})

export default styles;