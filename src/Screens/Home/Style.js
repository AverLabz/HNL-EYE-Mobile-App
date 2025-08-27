import { Dimensions, StyleSheet } from 'react-native';
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
    },
    field: {
        fontFamily: constants.fontBold,
        color: constants.defaultTextBlack,
        fontSize: 16,
        marginBottom: 6,
        lineHeight: 19.5,
    },
    leaveCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: constants.cardBackgroundGreen,
        marginTop: 20,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10
    },
    leaveCardSubContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
    },
    leaveCardRightContainer: {
        flex: 1,
        borderLeftWidth: 1,
        paddingLeft: 10,
        gap: 8,
        borderColor: constants.borderDarkGreen,
        height: '100%'
    },
    totalLeaveText: {
        fontFamily: constants.fontBold,
        color: constants.defaultTextBlack,
        fontSize: 50,
        lineHeight: 60.95,
        color: constants.textWhite
    },
    totalLeaveSubText: {
        flex: 1,
        fontFamily: constants.fontBold,
        fontSize: 18,
        lineHeight: 21.94,
        color: constants.textWhite
    },
    annualLeaveText: {
        fontFamily: constants.fontBold,
        color: constants.defaultTextBlack,
        fontSize: 30,
        lineHeight: 30.87,
        color: constants.textDarkGreen
    },
    annualLeaveSubText: {
        flex: 1,
        fontFamily: constants.fontMedium,
        fontSize: 12,
        lineHeight: 12.35,
        color: constants.textDarkGreen
    },
    leaveCardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    leaveListCard: {
        width: Dimensions.get('window').width / 2 - 30,
        paddingHorizontal: 15,
        paddingVertical: 11,
        marginTop: 22,
        borderRadius: 10,
    },
    leaveListCardTopText: {
        fontFamily: constants.fontBold,
        fontSize: 22,
        lineHeight: 26.82,
        color: constants.textWhite
    },
    leaveListCardCenterText: {
        fontFamily: constants.fontBold,
        fontSize: 18,
        lineHeight: 21.94,
        color: constants.textWhite
    },
    bottomContainer: {
        paddingTop: 22,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    bottomSubContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10
    },
    bottomContainerText: {
        fontFamily: constants.fontMedium,
        fontSize: 14,
        lineHeight: 20,
        color: constants.defaultTextBlack,
        letterSpacing: 0.32
    },
    bottomCircle: {
        height: 15,
        width: 15,
        borderRadius: 100,
        backgroundColor: constants.selectedDateColor
    },
    calenderText: {
        fontSize: 12,
        fontFamily: constants.fontMedium,
        color: constants.defaultTextBlack,
        lineHeight: 20
    },
    dayLabelsWrapper: {
        flexDirection: 'row',
        borderBottomWidth: 0,
        borderTopWidth: 0,
        position: 'absolute',
        bottom: -40,
    },
    monthAndYearText: {
        fontSize: 14,
        fontFamily: constants.fontMedium,
        letterSpacing: 0.32,
        lineHeight: 20,
        color: constants.defaultTextBlack
    }
})

export default styles;