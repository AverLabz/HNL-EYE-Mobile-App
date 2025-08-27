import { StyleSheet } from 'react-native';
import constants from '../../../constants/constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.screenBackgroundWhite
    },
    loaderContainerStyle: {
        flex: 1,
        position: 'absolute',
        top: "40%",
        right: 0,
        left: 0,
        zIndex: 100,
    },
    renderItemContainer: {
        paddingBottom: 14,
        paddingTop: 12,
        paddingHorizontal: 16,
        backgroundColor: constants.screenBackgroundWhite,
        borderRadius: 5,
        marginHorizontal: 12,
        marginTop: 14,
        elevation: 5
    },
    renderItemSubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cardTopRowText: {
        fontSize: 14,
        fontFamily: constants.fontMedium,
        color: constants.blackText,
        lineHeight: 17.07
    },
    subContainer: {
        flexGrow: 1,
        flexDirection: 'column',
    },
    detailsItemContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 1,
    },
    titleContainer: {
        backgroundColor: constants.colorMainBg,
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    titleText: {
        fontFamily: constants.fontMedium,
        paddingVertical: 13,
        paddingHorizontal:16,
        fontSize: 13,
        color: constants.textWhite
    },
    valueContainer: {
        flex: 1.4,
        backgroundColor: constants.siteValueBackground
    }
})

export default styles;