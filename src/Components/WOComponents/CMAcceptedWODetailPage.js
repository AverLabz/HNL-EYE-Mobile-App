import moment from 'moment';
import React, { useContext, useRef, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import getDirections from 'react-native-google-maps-directions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5Design from 'react-native-vector-icons/FontAwesome5';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';
import styles from '../../Styles/Style';
import constants from '../../constants/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const CMAcceptedWODetailPage = ({ route, navigation }) => {

    const { checkDistance, getCurretLocation, setWoSiteCode, postRequest } = useContext(DataContext)
    const [WoDetails, setWoDetails] = useState(route.params.acceptedWosItem)
    let dropDownAlertRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false)

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

    const handlePressChecklist = async () => {
        setWoSiteCode(WoDetails.siteCode)
        if (Platform.OS == "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'HNL Eye',
                        'message': 'HNL Eye wants to access your location '
                    }
                )

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurretLocation((location, success) => {
                        if (success) {
                            var distance = checkDistance(parseFloat(WoDetails.siteLatitude), parseFloat(WoDetails.siteLongitude), location.coords.latitude, location.coords.longitude, "M");
                            if (distance < 250) {
                                navigation.navigate("WOQuestionnaireTabs", { workOrderTypeId: WoDetails.workOrderTypeId, sourceFieldTypeId: WoDetails.sourceFieldTypeId, workOrderId: WoDetails.id, isVisitRequired: WoDetails.isVisitRequired });
                            } else if (WoDetails.isVisitRequired == false) {
                                navigation.navigate("WOQuestionnaireTabs", { workOrderTypeId: WoDetails.workOrderTypeId, sourceFieldTypeId: WoDetails.sourceFieldTypeId, workOrderId: WoDetails.id, isVisitRequired: WoDetails.isVisitRequired });
                            } else {
                                // navigation.navigate("WOQuestionnaireTabs", { workOrderTypeId: WoDetails.workOrderTypeId, sourceFieldTypeId: WoDetails.sourceFieldTypeId, workOrderId: WoDetails.id });
                                Alert.alert("You are not near to site");
                            }
                        }
                        else {
                            Alert.alert("Please turn on your location")
                        }
                    });
                } else {
                    console.log("location permission denied")
                    Alert.alert("Location permission denied");
                }
            } catch (err) {
                console.warn(err)
            }

        }
        else {

            getCurretLocation((location, success) => {
                if (success) {
                    var distance = checkDistance(parseFloat(WoDetails.siteLatitude), parseFloat(WoDetails.siteLongitude), location.coords.latitude, location.coords.longitude, "M");

                    if (distance > 250) {
                        Alert.alert("You are not near to site");
                    }
                    else
                        navigation.navigate("WOQuestionnaireTabs", { workOrderTypeId: WoDetails.workOrderTypeId, sourceFieldTypeId: WoDetails.sourceFieldTypeId, workOrderId: WoDetails.id });
                }
                else {
                    Alert.alert(
                        "Please turn on your location",
                        "Allow HNL to access Your current location",
                        [
                            {
                                text: "Cancel",
                                onPress: () => navigation.goBack(),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => Linking.openSettings() }
                        ]
                    );

                }
            });
        }
    }

    const askPermission = (id) => {
        Alert.alert('Attention', 'Are you sure to close this WorkOrder?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'YES', onPress: () => {
                    setIsLoading(true)
                    handleCloseWorkOrder(id)
                }
            },
        ]);
    }

    const handleCloseWorkOrder = (id) => {
        var url = JsonServer.baseURL + 'services/app/WorkOrder/CloseWorkOrder?WorkOrderId=' + id
        postRequest({}, url, (success, result, error) => {

            if (result) {
                dropDownAlertRef.alertWithType('success', 'Success', result)
                setTimeout(() => {
                    navigation.goBack()
                }, 1500);
                setIsLoading(false)
            } else {
                setIsLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        });
    }

    return (

        <SafeAreaView
            edges={['bottom']}
            style={{
                flex: 1,
                flexDirection: 'column',
            }}>

            {isLoading ?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    <ActivityIndicator animating={isLoading} size="large" color={constants.colorPrimary} />
                </View>
                :
                <ScrollView
                    style={{
                        flexGrow: 1,
                        flexDirection: 'column',
                    }}>
                    <View
                        style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: constants.colorWhite,
                        }}>
                        <View style={styles.orderDetailTitleCell}>
                            <Text style={styles.orderDetailTitleText}>Site Code</Text>
                        </View>
                        <View
                            style={{
                                flex: 1.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: constants.colorMainBg,
                            }}>
                            <Text style={styles.orderDetailTitleBlack}>
                                {WoDetails.siteCode}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: constants.colorWhite,
                        }}>
                        <View style={styles.orderDetailTitleCell}>
                            <Text style={styles.orderDetailTitleText}>Site Name</Text>
                        </View>
                        <View
                            style={{
                                flex: 1.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: constants.colorMainBg,
                            }}>
                            <Text style={styles.orderDetailTitleBlack}>
                                {WoDetails.siteName}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: constants.colorWhite,
                        }}>
                        <View style={styles.orderDetailTitleCell}>
                            <Text style={styles.orderDetailTitleText}>City</Text>
                        </View>
                        <View
                            style={{
                                flex: 1.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: constants.colorMainBg,
                            }}>
                            <Text style={styles.orderDetailTitleBlack}>
                                {WoDetails.cityName}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: constants.colorWhite,
                        }}>
                        <View style={styles.orderDetailTitleCell}>
                            <Text style={styles.orderDetailTitleText}>Site Latitude</Text>
                        </View>
                        <View
                            style={{
                                flex: 1.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: constants.colorMainBg,
                            }}>
                            <Text style={styles.orderDetailTitleBlack}>
                                {WoDetails.siteLatitude}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: constants.colorWhite,
                        }}>
                        <View style={styles.orderDetailTitleCell}>
                            <Text style={styles.orderDetailTitleText}>Site Longitude</Text>
                        </View>
                        <View
                            style={{
                                flex: 1.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: constants.colorMainBg,
                            }}>
                            <Text style={styles.orderDetailTitleBlack}>
                                {WoDetails.siteLongitude}

                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: constants.colorWhite,
                        }}>
                        <View style={styles.orderDetailTitleCell}>
                            <Text style={styles.orderDetailTitleText}>Source Field</Text>
                        </View>
                        <View
                            style={{
                                flex: 1.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: constants.colorMainBg,
                            }}>
                            <Text style={styles.orderDetailTitleBlack}>
                                {WoDetails.sourceFieldTypeName}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: constants.colorWhite,
                        }}>
                        <View style={styles.orderDetailTitleCell}>
                            <Text style={styles.orderDetailTitleText}>Assigned Employee</Text>
                        </View>
                        <View
                            style={{
                                flex: 1.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: constants.colorMainBg,
                            }}>
                            <Text style={styles.orderDetailTitleBlack}>
                                {WoDetails.assignedName}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: constants.colorWhite,
                        }}>
                        <View style={styles.orderDetailTitleCell}>
                            <Text style={styles.orderDetailTitleText}>Due Date</Text>
                        </View>
                        <View
                            style={{
                                flex: 1.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: constants.colorMainBg,
                            }}>
                            <Text style={styles.orderDetailTitleBlack}>
                                {moment(WoDetails.dueDate).format("DD MMM YYYY")}
                            </Text>
                        </View>
                    </View>





                </ScrollView>
            }

            <View style={styles.footerView}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handlePressChecklist()}
                    style={[styles.footerButtonInactive]}>
                    <AntDesign name="table" size={16} color={constants.colorWhite} />
                    <Text style={{ color: 'white', fontSize: 10 }}>Checklist</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => { navigation.navigate('CreateFSR', { WoDetails: WoDetails }) }}
                    style={styles.footerButtonInactive}>
                    <Entypo name="new-message"
                        size={16}
                        color={constants.colorWhite}
                    />
                    <Text style={{ color: 'white', fontSize: 10 }}>FSR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => { askPermission(WoDetails.id) }}
                    style={styles.footerButtonInactive}>
                    <Feather
                        name="check-square"
                        size={16}
                        color={constants.colorWhite} />
                    <Text style={{ color: 'white', fontSize: 10 }}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleGetDirections(WoDetails.siteLatitude, WoDetails.siteLongitude)}
                    style={styles.footerButtonInactive}>
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
export default CMAcceptedWODetailPage;
