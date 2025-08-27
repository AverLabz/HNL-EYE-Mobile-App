import { View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, StyleSheet, TextInput, Image, FlatList, PermissionsAndroid, Keyboard, Alert } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import constants from '../../constants/constants'
import Modal from 'react-native-modal';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import ImageResizer from 'react-native-image-resizer';
import { DataContext } from '../../Context/context-provider';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../Api/api/JsonServer';
import RNTextDetector from "rn-text-detector";
import ImagePicker from 'react-native-image-crop-picker';

const SerialNumber = ({ navigation, route }) => {

    const { ConvertImageToBase64, getAPICall, ConvertImageUrlToBase64 } = useContext(DataContext)
    let dropDownAlertRef = useRef(null);

    const [serialNumberData, setSerialNumberData] = useState([])
    const [serial, setSerial] = useState("")
    const [popupType, setPopupType] = useState("Create")
    const [selectedItem, setSelectedItem] = useState("")
    const [imageSource, setImageSource] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [manual, setManual] = useState(null)

    useEffect(() => {
        setLoading(true)
        if (route.params.tabName == "rrus") {

            GetAll_RRUs(route.params.site_Id)
        } else if (route.params.tabName == "idu") {

            GetAll_IDUs(route.params.site_Id)
        } else if (route.params.tabName == "odu") {

            GetAll_ODUs(route.params.site_Id)
        } else if (route.params.tabName == "btsCabinetBoardCard") {

            GetAll_BtsCabinetBoardCards(route.params.site_Id)
        } else if (route.params.tabName == "iduMMUCardPress") {

            GetAll_IDUMMUCards(route.params.site_Id)
        }

    }, [])

    const performOCR = async (imageUri) => {
        try {
            const processedImage = await vision().textRecognizerProcessImage(imageUri);
            const text = processedImage.text;
            return text;
        } catch (error) {
            console.error("OCR Error:", error);
            throw error;
        }
    }

    const GetAll_RRUs = (siteId) => {
        setLoading(true)

        var url = JsonServer.baseURL + "services/app/AMS/GetAll_RRUs?SiteId=" + siteId
        getAPICall(url, (success, result, error) => {
            if (success) {

                if (result.items.length > 0) {
                    let imageArr = []
                    result.items[0].serialImagePairs.forEach(function (element, index) {
                        ConvertImageUrlToBase64(JsonServer.imageApiUrl + element[1], (result) => {
                            imageArr.push({
                                id: index + 1,
                                serialName: element[0],
                                imgSource: result
                            })
                            setSerialNumberData(imageArr)
                        })

                    });
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }
    const GetAll_IDUs = (siteId) => {
        setLoading(true)

        var url = JsonServer.baseURL + "services/app/AMS/GetAll_IDUs?SiteId=" + siteId
        getAPICall(url, (success, result, error) => {
            if (success) {

                if (result.items.length > 0) {
                    let imageArr = []
                    result.items[0].serialImagePairs.forEach(function (element, index) {
                        ConvertImageUrlToBase64(JsonServer.imageApiUrl + element[1], (result) => {
                            imageArr.push({
                                id: index + 1,
                                serialName: element[0],
                                imgSource: result
                            })
                            setSerialNumberData(imageArr)
                        })

                    });
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const GetAll_ODUs = (siteId) => {
        setLoading(true)

        var url = JsonServer.baseURL + "services/app/AMS/GetAll_ODUs?SiteId=" + siteId
        getAPICall(url, (success, result, error) => {
            if (success) {

                if (result.items.length > 0) {
                    let imageArr = []
                    result.items[0].serialImagePairs.forEach(function (element, index) {
                        ConvertImageUrlToBase64(JsonServer.imageApiUrl + element[1], (result) => {
                            imageArr.push({
                                id: index + 1,
                                serialName: element[0],
                                imgSource: result
                            })
                            setSerialNumberData(imageArr)
                        })

                    });
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const GetAll_BtsCabinetBoardCards = (siteId) => {
        setLoading(true)

        var url = JsonServer.baseURL + "services/app/AMS/GetAll_BtsCabinetBoardCards?SiteId=" + siteId
        getAPICall(url, (success, result, error) => {
            if (success) {

                if (result.items.length > 0) {
                    let imageArr = []
                    result.items[0].serialImagePairs.forEach(function (element, index) {
                        ConvertImageUrlToBase64(JsonServer.imageApiUrl + element[1], (result) => {
                            imageArr.push({
                                id: index + 1,
                                serialName: element[0],
                                imgSource: result
                            })
                            setSerialNumberData(imageArr)
                        })

                    });
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }
    const GetAll_IDUMMUCards = (siteId) => {
        setLoading(true)

        var url = JsonServer.baseURL + "services/app/AMS/GetAll_IDUMMUCards?SiteId=" + siteId
        getAPICall(url, (success, result, error) => {
            if (success) {

                if (result.items.length > 0) {
                    let imageArr = []
                    result.items[0].serialImagePairs.forEach(function (element, index) {
                        ConvertImageUrlToBase64(JsonServer.imageApiUrl + element[1], (result) => {
                            imageArr.push({
                                id: index + 1,
                                serialName: element[0],
                                imgSource: result
                            })
                            setSerialNumberData(imageArr)
                        })

                    });
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }


    const selectPhotoTapped = async () => {

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
                                                setSerial(visionResp[0].text)
                                            } else {
                                                Alert.alert('Unable to Read the serial Number');
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

    const handleOnSavePress = (srNumber, imgUrl, selectedItem) => {
        Keyboard.dismiss()
        if (popupType == "Create") {
            if (srNumber == "") {
                dropDownAlertRef.alertWithType('error', 'Alert', "Enter Serial Number")
            } else if (imgUrl == '') {
                dropDownAlertRef.alertWithType('error', 'Alert', "Capture Image")
            } else {
                let imageArr = serialNumberData

                imageArr.push({
                    serialName: srNumber,
                    imgSource: imgUrl
                })
                setSerialNumberData(imageArr)
                setModalVisible(false)
                setSerial('')
                setImageSource('')
            }
        }
        else {
            if (srNumber == "") {
                dropDownAlertRef.alertWithType('error', 'Alert', "Enter Serial Number")
            } else if (imgUrl == '') {
                dropDownAlertRef.alertWithType('error', 'Alert', "Capture Image")
            } else {
                serialNumberData.find(x => x.id == selectedItem.id).serialName = srNumber;
                serialNumberData.find(x => x.id == selectedItem.id).imgSource = imgUrl
                setModalVisible(false)
                setSerial('')
                setImageSource('')
            }
        }

    }

    const handleUpdate = () => {
        if (serialNumberData.length > 0) {
            var mainSerial = [];
            var serialData = [];
            serialNumberData.forEach(element => {
                serialData.push(element.serialName)
                serialData.push(element.imgSource)
                mainSerial.push(serialData);
                serialData = [];
            });
            route.params.setSerialImagePairs(mainSerial)
            navigation.goBack()
        }
    }

    const renderItem = ({ item }) => (
        <View style={{ borderWidth: 1, marginHorizontal: 10, borderRadius: 10, borderColor: constants.colorGrey838383, marginTop: 10, }}>
            <View style={{ ...styles.viewstyle, flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <Text style={{ fontSize: 14, fontWeight: "700" }}>Serial Number : </Text>
                    <Text style={{ fontSize: 14 }}>{item.serialName}</Text>
                </View>
                <View>
                    <TouchableOpacity style={{ backgroundColor: constants.colorGrey838383, padding: 10, borderRadius: 10 }} onPress={() => {
                        setModalVisible(true)
                        setSerial(item.serialName)
                        setImageSource(item.imgSource)
                        setSelectedItem(item)
                        setPopupType("Update")
                    }}>
                        <Text>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => { }}>
                <Image
                    style={{
                        height: 150,
                        backgroundColor: constants.colorGrey838383,
                        margin: 20,
                        marginTop: 0,
                        borderRadius: 8
                    }}
                    source={{
                        uri: item.imgSource.slice(0, 3).localeCompare("htt") == 0 ? item.imgSource : 'data:image/png;base64,' + item.imgSource,
                        cache: 'reload'
                    }}
                    key={item.imgSource}

                />
            </TouchableOpacity>
        </View>
    )

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: constants.lightGrayColor }}>

            <View style={{ alignItems: "flex-end", justifyContent: 'center', margin: 20 }}>
                <TouchableOpacity style={{ backgroundColor: constants.colorPrimary, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 100 }} onPress={() => {
                    setPopupType("Create")
                    setModalVisible(true)
                }}>
                    <FontAwesome5Icon name='plus' size={20} color={constants.lightGrayColor} />
                </TouchableOpacity>
            </View>
            {loading ?
                <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', }}>
                    <ActivityIndicator
                        size="large"
                        animating={loading}
                        color={constants.colorPrimary}
                        style={{}}
                    />
                </View> :
                <>
                    <FlatList
                        data={serialNumberData}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                    <View style={styles.panel}>
                        <TouchableOpacity onPress={() => handleUpdate()} style={styles.panelButton}>
                            <Text style={styles.panelButtonTitle}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </>}
            <Modal
                isVisible={isModalVisible}
                swipeDirection='down'
                style={{ margin: 0 }}>

                <SafeAreaView style={styles.main}>
                    <View style={{ marginBottom: 10, alignItems: "flex-end" }}>
                        <TouchableOpacity style={styles.closeButtonStyle} onPress={() => {
                            setModalVisible(false)
                            setManual(null)
                        }}>
                            <Text style={{ fontWeight: "700", color: constants.colorWhite }}>X</Text>
                        </TouchableOpacity>
                    </View>
                    {manual !== null ? <>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Serial Number :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setSerial(text)}
                                value={serial}
                                editable={manual}
                                placeholder={manual === true ? "Enter Serial Number":"Capture image to scan Serial #"}
                                keyboardType="default" />
                        </View>
                        <TouchableOpacity onPress={() => { selectPhotoTapped() }}>
                            <Image
                                style={{
                                    height: 150,
                                    backgroundColor: constants.colorGrey838383,
                                    margin: 20,
                                    marginTop: 10,
                                }}
                                resizeMode='contain'
                                source={{
                                    // uri: 'data:image/png;base64,' + imageSource,
                                    uri: imageSource.slice(0, 3).localeCompare("htt") == 0 ? imageSource : 'data:image/png;base64,' + imageSource,
                                    cache: 'reload'
                                }}
                                key={imageSource}

                            />
                        </TouchableOpacity>
                        <View style={styles.panel}>
                            <TouchableOpacity style={styles.panelButton} onPress={() => handleOnSavePress(serial, imageSource, selectedItem, serialNumberData)}>
                                <Text style={styles.panelButtonTitle}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                        :
                        <>
                            <Text style={[styles.textstyle, { fontSize: 16, fontWeight: '600', color: 'black' }]}>Enter Serial Number through</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={[styles.panel, { flex: 1, marginHorizontal: 5 }]}>
                                    <TouchableOpacity style={styles.panelButton} onPress={() => { setManual(true) }}>
                                        <Text style={styles.panelButtonTitle}>Manual</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.textstyle, { fontSize: 14, fontWeight: '600', color: 'black', marginHorizontal: 10 }]}>OR</Text>
                                <View style={[styles.panel, { flex: 1, marginHorizontal: 5 }]}>
                                    <TouchableOpacity style={styles.panelButton} onPress={() => { setManual(false) }}>
                                        <Text style={styles.panelButtonTitle}>Scan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>}
                </SafeAreaView>
            </Modal >
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

export default SerialNumber

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
        color: 'black'
    },
    DropDownPicker: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: 'black',
    },
    main: {
        backgroundColor: '#fff',
        width: "100%",
        alignSelf: 'center',
        bottom: -20,
        position: 'absolute',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20
    },
    viewstyle: {
        margin: 10,
        marginHorizontal: 20
    },
    textstyle: {
        paddingBottom: 10
    },
    panel: {
        margin: 10,
        marginHorizontal: 20,
        marginBottom: 20
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
    closeButtonStyle: { backgroundColor: constants.colorPrimary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },

});