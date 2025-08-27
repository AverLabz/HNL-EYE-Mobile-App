import { TouchableOpacity, View, ScrollView, Text } from 'react-native';
import React, { useContext, useRef } from 'react';
import JsonServer from '../../../Api/api/JsonServer';
import styles from './Style'
import globalStyles from '../../../Styles/Style'
import constants from '../../../constants/constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5Design from 'react-native-vector-icons/FontAwesome5';
import getDirections from 'react-native-google-maps-directions';
import { DataContext } from '../../../Context/context-provider';
import DropdownAlert from 'react-native-dropdownalert';
import { SafeAreaView } from 'react-native-safe-area-context';

const CMWODetailPage = ({ route, navigation }) => {

    const { postRequest } = useContext(DataContext)
    let dropDownAlertRef = useRef(null);
    const WoDetails = route.params.pendingWosItem


    const handleGetDirections = (lat, long) => {
        const data = {
            source: {
                //  getting Current Location
            },
            destination: {
                latitude: Number(lat),
                longitude: Number(long),
            },
            params: [
                {
                    key: 'travelmode',
                    value: 'driving', // may be "walking", "bicycling" or "transit" as well
                },
            ],
        };

        getDirections(data);
    };

    const handleAcceptWo = (id) => {
        var url = JsonServer.baseURL + "services/app/WorkOrder/AcceptWorkOrder?WorkOrderId=" + id
        postRequest({}, url, (success, result, error) => {
            if (success) {
                dropDownAlertRef.alertWithType('success', 'Success', "Work Order Accepted Successfully")
                setTimeout(() => {
                    navigation.pop()
                }, 1200);
            } else if (error) {
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

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
            style={[styles.container, { paddingTop: 20 }]}>
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
            <View style={globalStyles.footerView}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleAcceptWo(WoDetails.id)}
                    style={[globalStyles.footerButtonInactive]}>
                    <AntDesign name="like1" size={16} color={constants.colorWhite} />
                    <Text style={{ color: 'white', fontSize: 10 }}>Accept</Text>
                </TouchableOpacity>
                <View style={{ backgroundColor: constants.lightGrayBorder, borderWidth: 0.5, height: '100%' }} />
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleGetDirections(WoDetails.siteLatitude, WoDetails.siteLongitude)}
                    style={globalStyles.footerButtonInactive}>
                    <FontAwesome5Design
                        name="directions"
                        size={16}
                        color={constants.colorWhite}
                    />
                    <Text style={{ color: 'white', fontSize: 10 }}>Directions</Text>
                </TouchableOpacity>
            </View>
            <DropdownAlert
                ref={(ref) => {
                    if (ref) {
                        dropDownAlertRef = ref;
                    }
                }}
                showCancel={true}
            />
        </SafeAreaView>
    );
}
export default CMWODetailPage;
