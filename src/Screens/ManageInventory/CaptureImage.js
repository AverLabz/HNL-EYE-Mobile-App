import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, PermissionsAndroid, SafeAreaView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownAlert from 'react-native-dropdownalert';
import ImageMarker, { Position } from "react-native-image-marker";
import { launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';
import constants from '../../constants/constants';

const CaptureImage = ({ navigation, route }) => {
    const { getCurretLocation, getAPICall, postRequest, ConvertImageToBase64, selectedSite, setSelectedSite } = React.useContext(DataContext)

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [loading, setLoading] = useState(true);
    const [reasonType, setReasonType] = useState("");
    const [remarks, setRemarks] = useState("");

    const [currentLongitude, setCurrentLongitude] = useState('');
    const [currentLatitude, setCurrentLatitude] = useState('');
    const [imageSource, setImageSource] = useState('')

    const [openSites, setOpenSites] = useState(false);
    const [siteValues, setSiteValues] = useState(null);
    const [sitesItems, setSitesItems] = useState([]);
    let dropDownAlertRef = useRef(null);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: route?.params?.headerTitle
        });

    }, [navigation]);

    useEffect(() => {
        if (route.params.barcodeItem) {
            getAllIssuance(route.params.barcodeItem.userId)
        }

        getCurretLocation((location, success) => {
            if (success) {
                setLoading(false)
                setCurrentLatitude(location.coords.latitude);
                setCurrentLongitude(location.coords.longitude);
            } else {
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
        })


    }, [])

    const getAllIssuance = (id) => {

        var url = JsonServer.baseURL + "services/app/Suggestions/GetSites?MaxResultCount=10000&OnlyAllocated=true"
        getAPICall(url, (success, result, error) => {
            if (success == true) {

                let siteItemsArr = [];
                result.items.forEach((itemsElement) => {
                    siteItemsArr.push({
                        label: itemsElement.siteCode,
                        value: itemsElement.siteId,
                    });
                });
                setSitesItems(siteItemsArr);

            }
            else { dropDownAlertRef.alertWithType('error', 'Alert', error.message) }
        })
    }

    const selectPhotoTapped = async (lat, long) => {

        if (currentLatitude == "") {

            Alert.alert(
                "Alert!",
                "Please Turn",
                [

                    {
                        text: "Ok", onPress: () => {
                            navigation.goBack()
                        }
                    }
                ]
            );
        }
        else {
            try {
                await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ]);
                if (
                    (await PermissionsAndroid.check('android.permission.CAMERA')) &&
                    (await PermissionsAndroid.check('android.permission.CAMERA')) &&
                    (await PermissionsAndroid.check('android.permission.CAMERA'))
                ) {
                    try {
                        const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.CAMERA,
                            {
                                title: 'HNL App Camera Permission',
                                message:
                                    'HNL needs access to your camera ' +
                                    'so you can take awesome pictures.',
                                buttonNeutral: 'Ask Me Later',
                                buttonNegative: 'Cancel',
                                buttonPositive: 'OK',
                            },
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            var options = {
                                title: 'Select Profile Image',
                                cancelButtonTitle: 'Cancel',
                                takePhotoButtonTitle: 'Take Photo...',
                                chooseFromLibraryButtonTitle: 'Choose from Library...',
                                chooseFromLibraryButtonHidden: false,
                                noData: false, // we use response.data to display gif
                                allowsEditing: false, // make sure we don't edit the gif
                            };
                            launchCamera(options, response => {
                                if (response.didCancel) {
                                    console.log('User cancelled image picker');
                                } else if (response.error) {
                                    console.log('ImagePicker Error: ', response.error);
                                    console.log(response);
                                } else if (response.customButton) {
                                    console.log(
                                        'User tapped custom button: ',
                                        response.customButton,
                                    );
                                }
                                else {

                                    const options = {
                                        // background image
                                        backgroundImage: {
                                          src: response.assets[0].uri,
                                          scale: 1,
                                        },
                                        watermarkTexts: [{
                                          text: 'Latitude ' + currentLatitude + '\n\nLongitude ' + currentLongitude + '\n\nSite Code : ' + woSiteCode + '\n\nDate: ' + moment().format('MMMM Do YYYY, h:mm'),
                                          position: {
                                            position: Position.bottomLeft,
                                          },
                                          style: {
                                            color: '#9d0000',
                                            fontSize: 30,
                                            fontName: 'Arial',
                                            shadowStyle: {
                                              dx: 10.5,
                                              dy: 20.8,
                                              radius: 20.9,
                                              color: 'rgba(52, 52, 52, 0.8)' // '#ff00ffad'
                                            },
                                            textBackgroundStyle: {
                                              type: 'stretchX',
                                              paddingX: 10,
                                              paddingY: 10,
                                            },
                                          },
                                        }],
                                        scale: 1,
                                        quality: 100,
                                        filename: 'test',
                                      };

                                    ImageMarker.markText(options).then((res) => {

                                        ImageResizer.createResizedImage(
                                            res,
                                            700,
                                            500,
                                            'PNG',
                                            100,
                                        )
                                            .then(({ uri }) => {
                                                ConvertImageToBase64(uri, (result) => {
                                                    setImageSource(result)
                                                })

                                            })
                                            .catch(err => {
                                                console.log(err);
                                                return Alert.alert(
                                                    'Unable to resize the photo',
                                                    'Check the console for full the error message',
                                                );
                                            });
                                        console.log("the path is" + res)
                                    }).catch((err) => {
                                        console.log(err)

                                    })
                                }
                            });
                        } else {
                            console.log('Camera permission denied');
                        }
                    } catch (err) {
                        console.warn(err);
                    }
                    return true;
                } else {
                    console.log('all permissions denied');
                    return false;
                }
            } catch (err) {
                console.warn(err);
            }
        }

    }

    const handleSaveBtn = () => {

        var url = JsonServer.baseURL + "services/app/JazzTelcoInventoryConsumption/ConsumeInventory"

        let dataToInsert = {
            acceptanceId: route.params.barcodeItem.id,
            siteId: selectedSite,
            base64Image: imageSource,
            reasonType: reasonType,
            reasonRemarks: remarks,
            isCompleted: isEnabled
        }

        postRequest(dataToInsert, url, (success, result, error) => {
            if (success) {
                setLoading(false)
                dropDownAlertRef.alertWithType('success', 'Alert', "Data has been updated")
                setTimeout(() => {
                    navigation.pop()
                }, 1000);
            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const handleSaveBtnData = () => {

        var url = JsonServer.baseURL + "services/app/JazzTelcoInventoryReturn/AssignNormalInventory"

        let dataToInsert = {
            consumptionId: route.params.item.id,
            base64Image: imageSource,
            reasonType: reasonType,
            reasonRemarks: remarks,
        }

        postRequest(dataToInsert, url, (success, result, error) => {
            if (success) {
                setLoading(false)
                dropDownAlertRef.alertWithType('success', 'Alert', "Data has been updated")
                setTimeout(() => {
                    navigation.pop()
                }, 1000);
            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: "center", backgroundColor: constants.lightGrayColor }}>
            {loading ?
                <View
                    style={{ flex: 1, position: 'absolute', top: '40%', right: 0, left: 0 }}>
                    <ActivityIndicator
                        size="large"
                        animating={loading}
                        color="#9d0000"
                        style={{}}
                    />
                </View> :
                <>
                    {route.params.barcodeItem !== null && <View style={styles.viewstyle}>
                        <Text style={styles.textstyle}>Select Site:</Text>
                        <DropDownPicker
                            open={openSites}
                            value={siteValues}
                            items={sitesItems}
                            setOpen={setOpenSites}
                            setValue={setSiteValues}
                            setItems={setSitesItems}
                            placeholder="Select Site"
                            style={styles.DropDownPicker}
                            onSelectItem={(item) => {
                                setSelectedSite(item.value)
                                // setSelectedSiteName(item.label)
                            }}
                            searchable
                            listMode="MODAL"
                            placeholderStyle={{
                                color: "grey",
                            }} />
                    </View>}

                    {/* {route.params.item &&
                        <>
                            <TouchableOpacity style={{ backgroundColor: constants.colorPrimary, paddingHorizontal: 20, paddingVertical: 10, marginTop: 20 }} onPress={() => selectPhotoTapped(currentLatitude, currentLongitude)}>
                                <Text style={{ color: constants.colorWhite, fontSize: 16 }}>Open Camera</Text>
                            </TouchableOpacity>

                            <Image
                                style={{
                                    height: 150,
                                    width: "90%",
                                    backgroundColor: constants.colorGrey838383,
                                    borderWidth: 1,
                                    marginTop: 20
                                }}
                                resizeMode="stretch"

                                source={{
                                    uri: 'data:image/png;base64,' + imageSource,
                                    cache: 'reload'
                                }}
                            />

                        </>
                    } */}

                    {selectedSite != null &&
                        <>
                            <TouchableOpacity style={{ height: 150, backgroundColor: constants.colorGrey838383, width: "90%", alignItems: "center", justifyContent: 'center', marginTop: 20 }} onPress={() => selectPhotoTapped(currentLatitude, currentLongitude)}>
                                {imageSource != '' ?
                                    <Image
                                        style={{
                                            height: 150,
                                            width: "100%",
                                            backgroundColor: constants.colorGrey838383,
                                            borderWidth: 1
                                        }}
                                        resizeMode="stretch"

                                        source={{
                                            uri: 'data:image/png;base64,' + imageSource,
                                            cache: 'reload'
                                        }}
                                        key={imageSource}

                                    /> : <Text style={{ color: constants.blackText, fontSize: 16 }}>Open Camera</Text>}
                            </TouchableOpacity>



                            {selectedSite != null && imageSource != '' && route?.params?.item == null &&
                                <>

                                    <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%" }}>
                                        <Text style={{ color: constants.blackText, fontSize: 16 }}>isCompleted</Text>
                                        <Switch
                                            trackColor={{ false: "#767577", true: constants.colorPrimary }}
                                            thumbColor={isEnabled ? constants.colorPrimary : "#f4f3f4"}
                                            onValueChange={toggleSwitch}
                                            value={isEnabled}
                                        />
                                    </View>
                                    {/* <TextInput
                                        style={{ width: "90%", backgroundColor: "white", borderWidth: 0.5, borderColor: constants.colorPrimary, marginTop: 5, borderRadius: 5, paddingLeft: 15 }}
                                        placeholder="Enter Type"
                                        onChangeText={(text) => setReasonType(text)}
                                        value={reasonType}
                                    />
                                    <TextInput
                                        style={{ width: "90%", backgroundColor: "white", borderWidth: 0.5, borderColor: constants.colorPrimary, marginTop: 5, borderRadius: 5, paddingLeft: 15 }}
                                        onChangeText={(text) => setRemarks(text)}
                                        value={remarks}
                                        placeholder="Enter Remarks"
                                    /> */}
                                </>
                            }
                        </>
                    }
                    {route.params.item != null && imageSource != "" &&
                        <>

                            <TextInput
                                style={{ width: "90%", backgroundColor: "white", borderWidth: 0.5, borderColor: constants.colorPrimary, marginTop: 5, borderRadius: 5, paddingLeft: 15 }}
                                placeholder="Enter Type"
                                onChangeText={(text) => setReasonType(text)}
                                value={reasonType}
                            />
                            <TextInput
                                style={{ width: "90%", backgroundColor: "white", borderWidth: 0.5, borderColor: constants.colorPrimary, marginTop: 5, borderRadius: 5, paddingLeft: 15 }}
                                onChangeText={(text) => setRemarks(text)}
                                value={remarks}
                                placeholder="Enter Remarks"
                            />
                        </>
                    }


                    {route.params.barcodeItem != null && imageSource != "" && <TouchableOpacity style={{ backgroundColor: constants.colorPrimary, paddingHorizontal: 30, paddingVertical: 10, marginTop: 20, borderRadius: 5 }}
                        onPress={() => {
                            setLoading(true)
                            handleSaveBtn()
                        }}>
                        <Text style={{ color: constants.colorWhite, fontSize: 16 }}>Save</Text>
                    </TouchableOpacity>}

                    {route.params.item != null && imageSource != "" && <TouchableOpacity style={{ backgroundColor: constants.colorPrimary, paddingHorizontal: 30, paddingVertical: 10, marginTop: 20, borderRadius: 5 }}
                        onPress={() => {
                            setLoading(true)
                            handleSaveBtnData()
                        }}>
                        <Text style={{ color: constants.colorWhite, fontSize: 16 }}>Save</Text>
                    </TouchableOpacity>}
                </>}
            <DropdownAlert
                ref={(ref) => {
                    if (ref) {
                        dropDownAlertRef = ref;
                    }
                }}
                showCancel={true}
            />
        </SafeAreaView>
    )
}

export default CaptureImage

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff'
    },
    DropDownPicker: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: 'black',
    },
    viewstyle: {
        margin: 10,
        marginHorizontal: 20
    },
    textstyle: {
        paddingBottom: 10,
        fontSize: 16,
    },
    panel: {
        margin: 10,
        marginHorizontal: 20
    },
    panelButton: {
        padding: 14,
        borderRadius: 8,
        backgroundColor: constants.colorPrimary,
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    viewContainer: { alignItems: "flex-end", justifyContent: "flex-end", marginRight: 20 },
    btnContainer: { backgroundColor: constants.colorPrimary, padding: 10 }
});