import React, { } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import constants from '../../constants/constants';

const WOClosedDetailPage = ({ route }) => {
    const WoDetails = route.params.pendingWosItem

    const DetailItem = ({ title, value }) => (
        <View style={styles.detailsItemContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
            </View>
            <View style={styles.valueContainer}>
                <Text style={[styles.titleText, { color: constants.defaultTextBlack, }]}>
                    {value}
                </Text>
            </View>
        </View>
    );


    return (
        <SafeAreaView
            edges={['bottom']}
            style={styles.container}>
            <ScrollView contentContainerStyle={styles.subContainer}>
                <DetailItem title="Site Code" value={WoDetails.siteCode} />
                <DetailItem title="Site Name" value={WoDetails.siteName} />
                <DetailItem title="City" value={WoDetails.cityName} />
                <DetailItem title="Site Latitude" value={WoDetails.siteLatitude} />
                <DetailItem title="Site Longitude" value={WoDetails.siteLongitude} />
                <DetailItem title="Source Field" value={WoDetails.sourceFieldTypeName} />
                <DetailItem title="Assigned Employee" value={WoDetails.assignedName} />
                <DetailItem title="Due Date" value={WoDetails.dueDate} />
            </ScrollView>
        </SafeAreaView>


    );
}
export default WOClosedDetailPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 20,
        backgroundColor: constants.screenBackgroundWhite
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
