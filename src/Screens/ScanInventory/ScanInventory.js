import { View, Text, TouchableOpacity, TextInput, Image, PermissionsAndroid, Alert, ActivityIndicator, StatusBar } from 'react-native'
import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './Style';
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import constants from '../../constants/constants';
import RNTextDetector from "rn-text-detector";
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import { DataContext } from '../../Context/context-provider';
import JsonServer from '../../Api/api/JsonServer';
import DropdownAlert from 'react-native-dropdownalert';

const ScanInventory = ({ navigation, route }) => {
    const { postRequest, ConvertImageToBase64 } = useContext(DataContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [serial, setSerial] = useState("")
    const [imageSource, setImageSource] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [allInventories, setAllInventories] = useState([])
    let dropDownAlertRef = useRef(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text style={{ fontSize: 16, fontWeight: "700", color: constants.colorWhite, textTransform: 'capitalize' }}>Scan {route.params.item.name}</Text>
            ),
        })
    }, [])
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

                                        if (visionResp.length > 0) {
                                            console.log('visionResp[0].text', visionResp[0].text)
                                            setSerial(visionResp[0].text)
                                            setIsLoading(true)
                                            setSearchQuery(visionResp[0].text)
                                            getInventoryDetails(visionResp[0].text)
                                        } else {
                                            Alert.alert('Unable to Read the serial Number');
                                        }
                                    })
                                })
                                .catch(err => {
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

    const getInventoryDetails = (barCode) => {

        var url = JsonServer.baseURL + 'services/app/SiteAssets_Answer/RetrieveDetailsByBarcode?Barcode=' + barCode
        postRequest('', url, (success, result, error) => {
            if (success) {
                setAllInventories(result)
                setIsLoading(false)
            } else {
                setIsLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        });
    }

    return (
        <SafeAreaView edges={['bottom']} style={[styles.container, { gap: 20 }]}>
            <StatusBar
                translucent
                backgroundColor={constants.colorPrimary}
                barStyle={'light-content'}
            />
            {isLoading && <View style={{ flex: 1, position: 'absolute', top: "50%", right: 0, left: 0, zIndex: 100, }}>
                <ActivityIndicator size="large" animating={isLoading} color={constants.colorPrimary} style={{ flex: 1, justifyContent: 'center', alignItems: "center", zIndex: 100, right: 0, left: 0, bottom: 0, top: 0, }} />
            </View>}

            <View style={styles.rowContainer}>
                <View style={styles.inputContainer}>
                    <AntDesign name='search1' size={22} style={{
                        color: constants.lightGrayBorder
                    }} />
                    <TextInput
                        placeholder='Search Code'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.inputStyle}
                        cursorColor={constants.grayColor}
                        keyboardType='default'
                        onSubmitEditing={() => {
                            setIsLoading(true)
                            getInventoryDetails(searchQuery)
                        }}
                    />
                </View>

                <TouchableOpacity onPress={() => { selectPhotoTapped() }} activeOpacity={0.8} style={styles.scanButton}>
                    <Image source={require('../../ImageAssets/scanBarcode.png')} style={{ height: 28, width: 28 }} />
                </TouchableOpacity>
            </View>
            {allInventories.length === 0 && <>
                <Text style={[styles.defaultText, { opacity: !searchQuery ? 1 : 0.4 }]}>Fetch the product details by entering product code or scanning barcode</Text>
                <Image source={require('../../ImageAssets/scannerImage.png')} style={[styles.defaultImageStyle, { opacity: !searchQuery ? 1 : 0.4 }]} resizeMode='contain' />

                {searchQuery &&
                    <TouchableOpacity
                        onPress={() => {
                            setIsLoading(true)
                            getInventoryDetails(searchQuery)
                        }}
                        activeOpacity={0.8}
                        style={styles.searchButton}>
                        <Text style={[styles.SearchButtonText]}>Search Now</Text>
                    </TouchableOpacity>}
            </>}
            {allInventories.length > 0 && <View style={{ padding: 12, backgroundColor: constants.lightGrayColor, borderRadius: 8 }}>
                {allInventories.map((item, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: i === 0 ? 0 : 15 }}>
                        <Text style={styles.questionTextStyle}>{item.questionText}:</Text>
                        <Text style={styles.answerTextStyle}>{item.answerText}</Text>
                    </View>
                ))}

            </View>}
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    backgroundColor: constants.red,
                    borderColor: 'rgba(0,0,0,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 55,
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    height: 55,
                    borderRadius: 100
                }}
                onPress={() => navigation.navigate("AddInventoryQuestionnaire", {
                    selectedTab: route?.params?.item?.name, templateQuestions: route?.params?.item, response: route.params?.response
                })}
            >
                <Entypo name='plus' size={40} color={constants.colorWhite} />
            </TouchableOpacity>

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

export default ScanInventory