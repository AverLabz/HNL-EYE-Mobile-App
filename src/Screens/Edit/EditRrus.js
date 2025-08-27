import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, PermissionsAndroid, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, forwardRef, useRef, useImperativeHandle, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import JsonServer from '../../Api/api/JsonServer';
import { launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import DropdownAlert from 'react-native-dropdownalert';

const EditRrus = React.forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        childMethod() {
            getAllRRUType();
        }
    }))

    useEffect(() => {
        setLoading(true)
        getAllRRUType();
    }, [])

    const { getAPICall, putRequest, ConvertImageToBase64 } = useContext(DataContext)
    let dropDownAlertRef = useRef(null);

    //States For TextInputs
    const [serial, setSerial] = useState("")
    const [height, setHeight] = useState("")
    const [siteId, setSiteId] = useState("")
    const [rowId, setrowId] = useState("")
    const [imageSource, setImageSource] = useState('')
    const [serialImagePairs, setSerialImagePairs] = useState([])

    //States For Dropdowns
    const [openSidecode, setOpenSidecode] = useState(false);
    const [sidecodeValue, setSidecodeValue] = useState(null);
    const [sidecodeItems, setSidecodeItems] = useState([]);

    const [openRru, setOpenRru] = useState(false);
    const [rruValue, setRruValue] = useState(null);
    const [rruItems, setRruItems] = useState([]);

    const [openActive, setOpenActive] = useState(false);
    const [activeValue, setActiveValue] = useState(null);
    const [activeItems, setActiveItems] = useState([{
        label: "True",
        value: true,
    }, {
        label: "False",
        value: false,
    }]);
    const [loading, setLoading] = useState(false);



    const getAllRRUType = () => {
        var url = JsonServer.baseURL + "services/app/RRUType/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {
                    let rruTypeTempArr = [];
                    result.items.forEach((itemsElement) => {
                        rruTypeTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setRruItems(rruTypeTempArr);
                    if (props.siteIdToSend != null)
                        getAllRRUDetails(props.siteIdToSend);
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const getAllRRUDetails = (id) => {
        setLoading(true)
        var url = JsonServer.baseURL + "services/app/AMS/GetAll_RRUs?SiteId=" + id
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result.items.length > 0) {
                    //
                    setRruValue(result.items[0].rruTypeId);
                    setHeight(result.items[0].installationHeight.toString());
                    setSerial(result.items[0].serialNumber);
                    setSiteId(result.items[0].siteId);
                    setActiveValue(result.items[0].isActive);
                    setrowId(result.items[0].id);
                    setLoading(false)
                } else {
                    setLoading(false);
                }
            }
            else {
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
                            } else {
                                ImageResizer.createResizedImage(
                                    response.assets[0].uri,
                                    700,
                                    500,
                                    'PNG',
                                    100,
                                )
                                    .then(({ uri }) => {
                                        const source = { uri: response.assets[0].uri };
                                        // setIsLoadingActivityIncatorForImage(true)
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


    const handleUpdateData = () => {

        setLoading(true)
        var url = JsonServer.baseURL + "services/app/AMS/Update";
        let dataToInsert = {
            dto: {
                rru: {
                    site_Id: siteId,
                    rruType_Id: rruValue,
                    serialNumber: serial,
                    installationHeight: height,
                    isActive: activeValue,
                    id: rowId,
                    serialImagePairs: serialImagePairs,
                }
            }
        }

        putRequest(dataToInsert, url, (success, result, error) => {
            if (success) {
                dropDownAlertRef.alertWithType('success', 'Alert', "Data has been updated")
                setLoading(false)
            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: constants.lightGrayColor }}>
                {loading ?
                    <View style={{ flex: 1, marginTop: "55%" }}>
                        <ActivityIndicator
                            size="large"
                            animating={loading}
                            color={constants.colorPrimary}
                            style={{}}
                        />
                    </View> :
                    <View style={{ marginTop: 10 }}>

                        {props.siteIdToSend && <View style={styles.viewContainer}>
                            <TouchableOpacity style={styles.btnContainer} onPress={() => props.onRRusPress("rrus", setSerialImagePairs, props.siteIdToSend)}>
                                <Text style={{ color: "white" }}>Serial Number</Text>
                            </TouchableOpacity>
                        </View>}

                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}> RRU Type:</Text>
                            <DropDownPicker
                                open={openRru}
                                value={rruValue}
                                items={rruItems}
                                setOpen={setOpenRru}
                                setValue={setRruValue}
                                setItems={setRruItems}
                                placeholder="Select RRU Type"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Installation Height :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setHeight(text)}
                                value={height}
                                placeholder="Add Installation Height"
                                keyboardType="default" />
                        </View>


                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}> IsActive :</Text>
                            <DropDownPicker
                                open={openActive}
                                value={activeValue}
                                items={activeItems}
                                setOpen={setOpenActive}
                                setValue={setActiveValue}
                                setItems={setActiveItems}
                                placeholder="False"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
                        </View>
                        {/* <View style={styles.viewstyle}>
                        <Text style={styles.textstyle}>Serial Number :</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setSerial(text)}
                            value={serial}
                            placeholder="Add Serial Number"
                            keyboardType="default" />
                    </View>
                    <TouchableOpacity onPress={() => selectPhotoTapped()}>
                        <Image
                            style={{
                                height: 150,
                                backgroundColor: constants.colorGrey838383,
                                margin: 20,
                                marginTop: 10,
                            }}
                            source={{
                                uri: 'data:image/png;base64,' + imageSource,
                                cache: 'reload'
                            }}
                            key={imageSource}

                        />
                    </TouchableOpacity> */}
                        <View style={styles.panel}>
                            <TouchableOpacity onPress={() => handleUpdateData()} style={styles.panelButton}>
                                <Text style={styles.panelButtonTitle}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}

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
    )
})

export default EditRrus
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
        paddingBottom: 10
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