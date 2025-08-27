import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View, TextInput, SafeAreaView, Linking } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownAlert from 'react-native-dropdownalert';
import ImageResizer from 'react-native-image-resizer';
import JsonServer from '../../Api/api/JsonServer';
import { showSuccess, showWarning } from '../../Components/AlertsMessage/AlertMessage';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import RNTextDetector from "rn-text-detector";
import ImagePicker from 'react-native-image-crop-picker';

const AddInventoryToSite = ({ navigation }) => {
    const { getCurretLocation, getAPICall, postRequest, ConvertImageToBase64, selectedSite, setSelectedSite } = React.useContext(DataContext)
    const [loading, setLoading] = useState(true);
    const [itemName, setItemName] = useState("");
    const [serialNumber, setSerialNumber] = useState("");

    const [currentLongitude, setCurrentLongitude] = useState('');
    const [currentLatitude, setCurrentLatitude] = useState('');
    const [imageSource, setImageSource] = useState('')
    const [manual, setManual] = useState(null)

    const [openSites, setOpenSites] = useState(false);
    const [siteValues, setSiteValues] = useState(null);
    const [sitesItems, setSitesItems] = useState([]);
    const [openModalType, setOpenModalType] = useState(false);
    const [modalTypeValues, setModalTypeValues] = useState(null);
    const [modalTypeItems, setModalTypeItems] = useState([
        {
            label: "Same",
            value: "Same"
        },
        {
            label: "Different",
            value: "Different"
        }
    ]);
    const [selectedModalType, setSelectedModalType] = useState('')
    let dropDownAlertRef = useRef(null);


    useEffect(() => {
        setLoading(true)
        AsyncStorage.getItem('userCredential').then((value) => {
            let id = parseInt(JSON.parse(value).userNameOrEmailAddress)
            getAllSites(id)
        })

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

    const getAllSites = (id) => {
        setLoading(true)
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
                if (selectedSite !== "") {
                    // Find the corresponding label and value for selectedSite
                    const siteItem = siteItemsArr.find(item => item.value === selectedSite);
                    if (siteItem) {
                        setSiteValues(siteItem.value);
                    }
                }
                setLoading(false)


            }
            else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
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

                            ImagePicker.openCamera({
                                width: 300,
                                height: 400,
                                cropping: true,
                            }).then(image => {
                                console.log(image);

                                // ImageMarker.markText({
                                //     src: image.path,
                                //     text: 'Latitude ' + currentLatitude + '\n\nLongitude ' + currentLongitude + '\n\nDate: ' + moment().format('MMMM Do YYYY, h:mm'),
                                //     X: 30,
                                //     Y: 30,
                                //     position: "bottomLeft",
                                //     color: '#9d0000', // '#ff0000aa' '#f0aa'
                                //     fontName: 'Arial-BoldItalicMT',
                                //     fontSize: 30,
                                //     shadowStyle: {
                                //         dx: 10.5,
                                //         dy: 20.8,
                                //         radius: 20.9,
                                //         color: 'rgba(52, 52, 52, 0.8)' // '#ff00ffad'
                                //     },
                                //     textBackgroundStyle: {
                                //         type: 'stretchX',
                                //         paddingX: 10,
                                //         paddingY: 10,
                                //         // color: '#C0C0C0' // '#0f0a'
                                //     },
                                //     scale: 1,
                                //     quality: 100
                                // }).then((res) => {

                                ImageResizer.createResizedImage(
                                    image.path,
                                    700,
                                    500,
                                    'PNG',
                                    100,
                                )
                                    .then(({ uri }) => {
                                        ConvertImageToBase64(uri, async (result) => {

                                            const visionResp = await RNTextDetector.detectFromUri(uri);
                                            setImageSource(result)
                                            if (manual === false) {
                                                if (visionResp.length > 0) {
                                                    setSerialNumber(visionResp[0].text)
                                                } else {
                                                    Alert.alert(
                                                        'Unable to Read the serial Number'
                                                    );
                                                }
                                            }
                                        })
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return Alert.alert(
                                            'Unable to resize the photo',
                                            'Check the console for full the error message',
                                        );
                                    });
                                // }).catch((err) => {
                                //     console.log(err)

                                // })
                                //     }
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

        if (itemName == "") {
            showWarning("Enter Item Name")
        } else if (serialNumber == "") {
            showWarning("Enter Item Serial Number")
        } else {
            setLoading(true);
            var url = JsonServer.baseURL + "services/app/JazzTelcoInventoryReturn/CreateOpenInventory"

            let dataToInsert = {
                serialNumber: serialNumber,
                itemName: itemName,
                hardwareDetail: "",
                partNumber: "",
                siteId: siteValues,
                reasonType: selectedModalType,
                reasonRemarks: "",
                base64Image: imageSource
            }

            postRequest(dataToInsert, url, (success, result, error) => {
                setLoading(false);
                if (success) {
                    navigation.pop()
                    showSuccess("Item Saved To site")
                } else if (error) {
                    showWarning(error.message)
                }
            })
        }
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
                    {sitesItems.length > 0 != null && <View style={styles.viewstyle}>
                        <Text style={styles.textStyleCustom}>Select Site</Text>
                        <DropDownPicker
                            open={openSites}
                            value={siteValues}
                            items={sitesItems}
                            setOpen={setOpenSites}
                            setValue={setSiteValues}
                            setItems={setSitesItems}
                            placeholder="Select Site"
                            style={styles.DropDownPicker}
                            searchable
                            onChangeValue={(item) => {
                                if (item) {
                                    setImageSource("")
                                }
                            }}
                            onSelectItem={(item) => {
                                setSelectedSite(item.value)
                            }}
                            listMode="MODAL"
                            placeholderStyle={{
                                color: "grey",
                            }} />

                        <Text style={styles.textStyleCustom}>Select Model Type</Text>
                        <DropDownPicker
                            open={openModalType}
                            value={modalTypeValues}
                            items={modalTypeItems}
                            setOpen={setOpenModalType}
                            setValue={setModalTypeValues}
                            setItems={setModalTypeItems}
                            placeholder="Select Site"
                            style={styles.DropDownPicker}
                            searchable
                            onSelectItem={(item) => {
                                setSelectedModalType(item.value)
                            }}
                            listMode="MODAL"
                            placeholderStyle={{
                                color: "grey",
                            }} />
                    </View>}

                    {siteValues != null && modalTypeValues != null &&
                        <>
                            {siteValues != null &&
                                <>
                                    <TextInput
                                        style={{ width: "90%", backgroundColor: "white", borderWidth: 0.5, borderColor: constants.colorPrimary, marginTop: 5, borderRadius: 5, paddingLeft: 15 }}
                                        placeholder="Enter Item Name"
                                        onChangeText={(text) => setItemName(text)}
                                        value={itemName}
                                    />
                                    {manual === null ?
                                        <>
                                            <Text style={[styles.textstyle, { fontSize: 16, fontWeight: '600', color: 'black', textAlign: 'left', alignSelf: 'flex-start', margin: 20 }]}>Enter Serial Number through</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <View style={[styles.panel, { flex: 1, marginHorizontal: 20 }]}>
                                                    <TouchableOpacity style={styles.panelButton} onPress={() => { setManual(true) }}>
                                                        <Text style={styles.panelButtonTitle}>Manual</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <Text style={[styles.textstyle, { fontSize: 14, fontWeight: '600', color: 'black', marginHorizontal: 10 }]}>OR</Text>
                                                <View style={[styles.panel, { flex: 1, marginHorizontal: 20 }]}>
                                                    <TouchableOpacity style={styles.panelButton} onPress={() => { setManual(false) }}>
                                                        <Text style={styles.panelButtonTitle}>Scan</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </> :
                                        <TextInput
                                            style={{ width: "90%", backgroundColor: "white", borderWidth: 0.5, borderColor: constants.colorPrimary, marginTop: 5, borderRadius: 5, paddingLeft: 15, color: 'black' }}
                                            onChangeText={(text) => setSerialNumber(text)}
                                            value={serialNumber}
                                            editable={manual}
                                            placeholder={manual === true ? "Enter Serial Number" : "Capture image to scan Serial #"}
                                        />}
                                </>
                            }
                            {manual !== null && <TouchableOpacity style={{ height: 150, backgroundColor: constants.colorGrey838383, width: "90%", alignItems: "center", justifyContent: 'center', marginTop: 10 }} onPress={() => selectPhotoTapped(currentLatitude, currentLongitude)}>
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

                                    /> : <Text style={{ color: constants.blackText, fontSize: 16 }}>Capture Item Photo</Text>}
                            </TouchableOpacity>}
                        </>
                    }


                    {siteValues != null && imageSource != "" &&
                        <TouchableOpacity style={{ backgroundColor: constants.colorPrimary, paddingHorizontal: 30, paddingVertical: 10, marginTop: 20, borderRadius: 5 }} onPress={() => handleSaveBtn()}>
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
                zIndex={100}
            />

        </SafeAreaView>
    )
}

export default AddInventoryToSite

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
    btnContainer: { backgroundColor: constants.colorPrimary, padding: 10 },
    textStyleCustom: {
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: '600'
    }
});