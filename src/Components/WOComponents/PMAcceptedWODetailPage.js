import React, { useContext, useRef, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import getDirections from 'react-native-google-maps-directions';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';
import constants from '../../constants/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomLoader from '../CustomLoader/CustomLoader';
import CheckList from '../../ImageAssets/Svg/checkList.svg'
import Fsr from '../../ImageAssets/Svg/Fsr.svg'
import Directions from '../../ImageAssets/Svg/Directions.svg'

const PMAcceptedWODetailPage = ({ route, navigation }) => {

    const { getCurretLocation, checkDistance, setWoSiteCode, postRequest } = useContext(DataContext)
    const WoDetails = route.params.acceptedWosItem
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
                    alert("Location permission denied");
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
            {isLoading && <CustomLoader medium />}

            <ScrollView contentContainerStyle={styles.subContainer}>
                <DetailItem title="Site Code" value={WoDetails.siteCode} />
                <DetailItem title="Site Name" value={WoDetails.siteName} />
                <DetailItem title="City" value={WoDetails.cityName} />
                <DetailItem title="Site Latitude" value={WoDetails.siteLatitude} />
                <DetailItem title="Site Longitude" value={WoDetails.siteLongitude} />
                <DetailItem title="Source Field" value={WoDetails.sourceFieldTypeName} />
                <DetailItem title="Assigned Employee" value={WoDetails.assignedName} />
                <DetailItem title="Due Date" value={WoDetails.dueDate} />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handlePressChecklist()}
                        style={[styles.customButtonContainer, { backgroundColor: constants.greenBackground }]}>
                        <CheckList />
                        <Text style={styles.buttonText}>Checklist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => { navigation.navigate('CreateFSR', { WoDetails: WoDetails }) }}
                        style={[styles.customButtonContainer, { backgroundColor: constants.orangeBackground }]}>
                        <Fsr />
                        <Text style={styles.buttonText}>FSR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleGetDirections(WoDetails.siteLatitude, WoDetails.siteLongitude)}
                        style={[styles.customButtonContainer, { backgroundColor: constants.skyBlueBackground }]}>
                        <Directions />
                        <Text style={styles.buttonText}>Directions</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.loginButton}
                    onPress={() => { askPermission(WoDetails.id) }}>
                    <Text style={styles.loginText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>

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
export default PMAcceptedWODetailPage;

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
        paddingHorizontal: 16,
        fontSize: 13,
        color: constants.textWhite
    },
    valueContainer: {
        flex: 1.4,
        backgroundColor: constants.siteValueBackground
    },
    buttonText: {
        fontFamily: constants.fontSemiBold,
        fontSize: 13,
        color: constants.textWhite
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 20
    },
    customButtonContainer: {
        gap: 3,
        paddingBottom: 9,
        paddingTop: 10,
        width: 98,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    loginButton: {
        height: 53,
        borderRadius: 5,
        backgroundColor: constants.red,
        justifyContent: 'center',
        marginVertical: 70,
        width: '75%',
        alignSelf: 'center'
    },
    loginText: {
        fontSize: 14,
        fontFamily: constants.fontSemiBold,
        color: constants.textWhite,
        lineHeight: 17.07,
        textAlign: 'center'
    },
})
